import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminPasswordReset() {
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") || "", []);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const resetPassword = trpc.auth.resetLocalAdminPassword.useMutation({
    onError: (error) => setValidationError(error.message || "Não foi possível redefinir a senha."),
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return setValidationError("O link de recuperação está incompleto.");
    if (password.length < 16) return setValidationError("A nova senha deve ter pelo menos 16 caracteres.");
    if (password !== confirmation) return setValidationError("As senhas informadas não coincidem.");
    setValidationError(null);
    resetPassword.mutate({ token, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#253c7e] text-white"><KeyRound className="h-6 w-6" /></div>
        <h1 className="text-2xl font-bold text-[#253c7e]">Criar nova senha</h1>
        {resetPassword.isSuccess ? (
          <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-left text-emerald-900">
            <div className="flex gap-3"><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" /><p><strong>Senha atualizada.</strong><br />Use suas novas credenciais para entrar no painel administrativo.</p></div>
            <a href="/admin"><Button className="mt-5 w-full bg-[#253c7e] hover:bg-[#1b2d61]">Ir para o login administrativo</Button></a>
          </div>
        ) : (
          <form className="mt-6 space-y-4 text-left" onSubmit={submit}>
            <p className="text-sm leading-relaxed text-slate-600">Defina uma senha forte, com pelo menos 16 caracteres. Este link poderá ser usado uma única vez.</p>
            <label className="block text-sm font-medium text-slate-700" htmlFor="new-admin-password">Nova senha
              <Input id="new-admin-password" className="mt-2" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <label className="block text-sm font-medium text-slate-700" htmlFor="confirm-admin-password">Confirmar nova senha
              <Input id="confirm-admin-password" className="mt-2" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
            </label>
            {validationError ? <p className="text-sm text-red-600">{validationError}</p> : null}
            <Button type="submit" disabled={resetPassword.isPending} className="w-full bg-[#ff6900] hover:bg-[#e35e00]">
              {resetPassword.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Atualizando senha…</> : "Salvar nova senha"}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
