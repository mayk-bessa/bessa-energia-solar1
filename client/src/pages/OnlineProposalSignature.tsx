import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Clock3, FileText, Loader2, Mail, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type ComponentRow = { id?: string; name: string; quantity: number; unitPrice: number };

export default function OnlineProposalSignature() {
  const [, params] = useRoute("/aceite-proposta/:token");
  const token = params?.token || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const proposalQuery = trpc.chargingProposals.getForSignature.useQuery({ token }, { enabled: Boolean(token), retry: false });
  const signOnline = trpc.chargingProposals.signOnline.useMutation({
    onSuccess: () => setAccepted(true),
  });
  const components = useMemo<ComponentRow[]>(() => {
    try {
      const parsed = proposalQuery.data?.componentsJson ? JSON.parse(proposalQuery.data.componentsJson) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [proposalQuery.data?.componentsJson]);
  const isExpired = Boolean(proposalQuery.data?.validUntil && new Date(proposalQuery.data.validUntil).getTime() < Date.now());
  const isSigned = Boolean(proposalQuery.data?.signedAt || accepted);

  if (proposalQuery.isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-[#253c7e]"><Loader2 className="mr-3 h-6 w-6 animate-spin" />Carregando proposta…</div>;
  }

  if (proposalQuery.isError || !proposalQuery.data) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4"><section className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl"><FileText className="mx-auto h-10 w-10 text-red-600" /><h1 className="mt-4 text-2xl font-bold text-[#253c7e]">Proposta indisponível</h1><p className="mt-3 text-slate-600">O link é inválido, a proposta não está disponível ou foi removida do painel comercial.</p><Link href="/"><Button className="mt-6 bg-[#253c7e] hover:bg-[#1d3065]">Voltar ao site</Button></Link></section></main>;
  }

  const proposal = proposalQuery.data;
  const validUntil = proposal.validUntil ? new Date(proposal.validUntil).toLocaleDateString("pt-BR") : "Prazo não informado";
  const submitAcceptance = (event: React.FormEvent) => {
    event.preventDefault();
    signOnline.mutate({ token, name: name.trim(), email: email.trim() });
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="rounded-t-2xl border-b-4 border-[#ff6900] bg-[#253c7e] px-6 py-6 text-white shadow-lg sm:px-8">
          <div className="flex items-center gap-4"><div className="rounded-xl bg-white px-3 py-2"><img src="/Logotransparente_bessaenergia_cores.png" alt="Bessa Energia Solar" className="h-9 w-auto" /></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-200">Aceite eletrônico</p><h1 className="text-2xl font-bold">Proposta comercial Bessa Energia</h1></div></div>
        </header>
        <section className="rounded-b-2xl bg-white p-6 shadow-xl sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start"><div><p className="text-sm font-semibold uppercase tracking-wide text-[#ff6900]">Cliente</p><h2 className="mt-1 text-2xl font-bold text-[#253c7e]">{proposal.clientName}</h2><p className="mt-1 text-sm text-slate-500">Atendimento de {proposal.sellerName}</p></div><div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${isExpired ? "bg-red-100 text-red-700" : "bg-blue-50 text-[#253c7e]"}`}><Clock3 className="h-4 w-4" />Válida até {validUntil}</div></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Projeto</p><p className="mt-1 font-semibold text-[#253c7e]">{proposal.projectType === "solar" ? "Sistema fotovoltaico" : proposal.projectType === "hybrid" ? "Solar + recarga veicular" : "Recarga veicular"}</p></div><div className="rounded-xl bg-orange-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-orange-700">Investimento estimado</p><p className="mt-1 text-xl font-bold text-[#ff6900]">{currency.format(proposal.totalCents / 100)}</p></div></div>
          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200"><div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 font-bold text-[#253c7e]"><FileText className="h-4 w-4" />Resumo do escopo</div><div className="divide-y divide-slate-100">{components.map((component, index) => <div key={`${component.id || component.name}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3 text-sm"><span><strong>{component.quantity}×</strong> {component.name}</span><span className="shrink-0 font-semibold text-[#253c7e]">{currency.format(component.quantity * component.unitPrice)}</span></div>)}</div></section>
          {isSigned ? <div className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" /><div><h3 className="font-bold">Aceite registrado</h3><p className="mt-1 text-sm leading-relaxed">A Bessa Energia recebeu a confirmação eletrônica desta proposta. Nossa equipe entrará em contato para conduzir as próximas etapas.</p></div></div></div> : isExpired ? <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-5 text-red-900"><h3 className="font-bold">Prazo de validade encerrado</h3><p className="mt-1 text-sm leading-relaxed">Esta proposta não pode mais ser aprovada por este link. Entre em contato com a Bessa Energia para solicitar uma atualização.</p></div> : <form className="mt-7 rounded-xl border border-blue-100 bg-blue-50/60 p-5" onSubmit={submitAcceptance}><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#ff6900]" /><div><h3 className="font-bold text-[#253c7e]">Confirmar aceite eletrônico</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">Ao confirmar, você registra seu aceite desta proposta comercial. A confirmação será vinculada aos dados informados abaixo.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="signature-name"><UserRound className="mr-1 inline h-4 w-4" />Nome completo</Label><Input id="signature-name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} required /></div><div className="space-y-2"><Label htmlFor="signature-email"><Mail className="mr-1 inline h-4 w-4" />E-mail</Label><Input id="signature-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></div>{signOnline.isError && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{signOnline.error.message || "Não foi possível registrar o aceite."}</p>}<Button type="submit" disabled={signOnline.isPending} className="mt-5 w-full bg-[#ff6900] hover:bg-[#e35e00]">{signOnline.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registrando aceite…</> : "Confirmar aceite da proposta"}</Button></form>}
        </section>
        <p className="mt-5 text-center text-xs text-slate-500">Bessa Energia Solar · Avenida Getúlio Vargas, 671, Sala 500, Savassi, Belo Horizonte/MG</p>
      </div>
    </main>
  );
}
