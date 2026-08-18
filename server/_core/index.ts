import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getProductImageDirectory } from "../productImageStorage";
import { getMaintenanceJobByTaskUid, purgeChargingProposalsDeletedBefore } from "../db";
import { sdk } from "./sdk";
import { getProposalTrashRetentionCutoff } from "../proposalTrashRetention";
import { isLoopbackAddress } from "../scheduledRequestSecurity";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Storage proxy for /manus-storage/* paths
  registerStorageProxy(app);
  // Imagens de produtos recebem fallback em disco no VPS quando o storage remoto não estiver disponível.
  app.use("/uploads/products", express.static(getProductImageDirectory(), { maxAge: "30d", fallthrough: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Manutenção diária: acessível somente pelo acionador agendado autenticado.
  app.get("/api/scheduled/purge-proposal-trash", (req, res) => {
    if (!isLoopbackAddress(req.socket.remoteAddress)) {
      res.status(403).json({ error: "Verificação restrita ao servidor local" });
      return;
    }
    res.json({ success: true, service: "proposal-trash-cleanup" });
  });

  app.post("/api/scheduled/purge-proposal-trash", async (req, res) => {
    try {
      const localInvocation = isLoopbackAddress(req.socket.remoteAddress);
      const user = await sdk.authenticateRequest(req).catch(() => null);
      if (!localInvocation && (!user?.isCron || !user.taskUid)) {
        res.status(403).json({ error: "Acesso restrito ao agendamento de manutenção" });
        return;
      }
      if (!localInvocation && user?.taskUid) {
        const scheduledJob = await getMaintenanceJobByTaskUid(user.taskUid);
        if (!scheduledJob) {
          res.json({ success: true, skipped: "Tarefa agendada sem registro ativo" });
          return;
        }
        if (scheduledJob.jobKey !== "purge-proposal-trash") {
          res.status(403).json({ error: "Tarefa não autorizada para a limpeza da lixeira" });
          return;
        }
      }
      const cutoff = getProposalTrashRetentionCutoff();
      const purged = await purgeChargingProposalsDeletedBefore(cutoff);
      res.json({ success: true, purged, cutoff: cutoff.toISOString() });
    } catch (error) {
      console.error("[Proposal trash cleanup] Falha na limpeza programada", error);
      res.status(500).json({ error: "Falha ao limpar a lixeira de propostas" });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
