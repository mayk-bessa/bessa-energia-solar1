import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { calculateLineTotal, calculateProposalTotal, type ProposalComponent } from "@/lib/proposalCalculator";
import { ArrowLeft, Calculator, CheckCircle2, CirclePlus, FileDown, LockKeyhole, Minus, Plus, Save, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const INITIAL_COMPONENTS: ProposalComponent[] = [
  { id: "eve-0074h", name: "Estação de recarga Intelbras Home EVE 0074H", quantity: 1, unitPrice: 0 },
  { id: "installation", name: "Mão de obra de instalação e comissionamento", quantity: 1, unitPrice: 0 },
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function parseCurrencyValue(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^0-9.-]/g, "");
  return Number.isFinite(Number(normalized)) ? Math.max(0, Number(normalized)) : 0;
}

export default function InteractiveChargingProposal() {
  const { user, loading } = useAuth();
  const [clientName, setClientName] = useState("RENATA COALHO TEIXEIRA");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [components, setComponents] = useState<ProposalComponent[]>(INITIAL_COMPONENTS);
  const [lastSavedProposalId, setLastSavedProposalId] = useState<number | null>(null);
  const total = useMemo(() => calculateProposalTotal(components), [components]);
  const hasSellerAccess = user?.role === "admin" || user?.role === "seller";
  const savedProposals = trpc.chargingProposals.list.useQuery(undefined, { enabled: hasSellerAccess });
  const teamUsers = trpc.salesTeam.listUsers.useQuery(undefined, { enabled: user?.role === "admin" });
  const saveProposal = trpc.chargingProposals.save.useMutation({
    onSuccess: async (result) => {
      setLastSavedProposalId(result.proposalId);
      await savedProposals.refetch();
      toast.success(`Proposta #${result.proposalId} salva no painel`);
    },
    onError: (error) => toast.error(error.message || "Não foi possível salvar a proposta"),
  });
  const sendProposal = trpc.chargingProposals.sendEmail.useMutation({
    onSuccess: async () => {
      await savedProposals.refetch();
      toast.success("Proposta enviada por e-mail à cliente.");
    },
    onError: (error) => toast.error(error.message || "Não foi possível enviar a proposta."),
  });
  const updateRole = trpc.salesTeam.updateRole.useMutation({
    onSuccess: async () => {
      await teamUsers.refetch();
      toast.success("Perfil de acesso atualizado.");
    },
    onError: (error) => toast.error(error.message || "Não foi possível atualizar o perfil."),
  });

  const updateComponent = (id: string, field: keyof Pick<ProposalComponent, "name" | "quantity" | "unitPrice">, value: string) => {
    setComponents((current) => current.map((component) => {
      if (component.id !== id) return component;
      if (field === "name") return { ...component, name: value };
      if (field === "quantity") return { ...component, quantity: Math.max(0, Number.parseInt(value || "0", 10) || 0) };
      return { ...component, unitPrice: parseCurrencyValue(value) };
    }));
  };

  const addComponent = () => {
    setComponents((current) => [...current, {
      id: crypto.randomUUID(),
      name: "Novo componente de instalação",
      quantity: 1,
      unitPrice: 0,
    }]);
  };

  const adjustQuantity = (id: string, step: number) => {
    setComponents((current) => current.map((component) => component.id === id
      ? { ...component, quantity: Math.max(0, component.quantity + step) }
      : component));
  };

  const handleSave = () => {
    if (!clientName.trim()) {
      toast.error("Informe o nome da cliente antes de salvar.");
      return;
    }

    saveProposal.mutate({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || undefined,
      clientPhone: clientPhone.trim() || undefined,
      sellerName: sellerName.trim() || undefined,
      components,
    });
  };

  const handleSend = () => {
    if (!lastSavedProposalId) {
      toast.error("Salve a proposta antes de enviá-la por e-mail.");
      return;
    }
    if (!clientEmail.trim()) {
      toast.error("Informe o e-mail da cliente antes de enviar.");
      return;
    }
    sendProposal.mutate({ id: lastSavedProposalId });
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-[#253c7e]">Carregando acesso comercial…</div>;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#253c7e] text-white"><LockKeyhole className="h-6 w-6" /></div>
          <h1 className="text-2xl font-bold text-[#253c7e]">Acesso de vendedor</h1>
          <p className="mt-3 text-slate-600">Entre com sua conta autorizada para elaborar, salvar e enviar propostas comerciais.</p>
          <Button onClick={() => { window.location.href = getLoginUrl(); }} className="mt-6 w-full bg-[#ff6900] hover:bg-[#e35e00]">Entrar para continuar</Button>
        </section>
      </div>
    );
  }

  if (!hasSellerAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#ff6900]"><LockKeyhole className="h-6 w-6" /></div>
          <h1 className="text-2xl font-bold text-[#253c7e]">Acesso não autorizado</h1>
          <p className="mt-3 text-slate-600">Esta área é exclusiva para vendedores autorizados e administradores. Solicite a liberação do seu perfil ao administrador.</p>
          <Link href="/"><Button variant="outline" className="mt-6 border-[#253c7e] text-[#253c7e]">Voltar ao site</Button></Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white">
      <header className="border-b-4 border-[#ff6900] bg-[#253c7e] text-white print:border-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
              <img src="/Logotransparente_bessaenergia_cores.png" alt="Bessa Energia Solar" className="h-9 w-auto" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-200">Mobilidade elétrica</p>
              <h1 className="text-xl font-bold sm:text-2xl">Proposta Interativa</h1>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-white/70 bg-transparent text-white hover:bg-white hover:text-[#253c7e] print:hidden">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao site
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#ff6900]">Intelbras Home EVE 0074H</p>
            <h2 className="text-3xl font-bold tracking-tight text-[#253c7e]">Monte o escopo da instalação</h2>
            <p className="mt-2 max-w-3xl text-slate-600">Preencha os componentes, quantidades e valores unitários. O total é atualizado automaticamente a cada alteração.</p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button onClick={handleSave} disabled={saveProposal.isPending} variant="outline" className="border-[#253c7e] text-[#253c7e] hover:bg-blue-50"><Save className="mr-2 h-4 w-4" /> {saveProposal.isPending ? "Salvando…" : "Salvar no painel"}</Button>
            <Button onClick={handleSend} disabled={!lastSavedProposalId || sendProposal.isPending} variant="outline" className="border-[#ff6900] text-[#ff6900] hover:bg-orange-50"><Send className="mr-2 h-4 w-4" /> {sendProposal.isPending ? "Enviando…" : "Enviar PDF por e-mail"}</Button>
            <Button onClick={() => window.print()} className="bg-[#ff6900] text-white hover:bg-[#e35e00]"><FileDown className="mr-2 h-4 w-4" /> Imprimir ou salvar PDF</Button>
          </div>
        </section>

        <section className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="client-name" className="font-semibold text-[#253c7e]">Cliente</Label>
            <Input id="client-name" value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Nome da cliente" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seller-name" className="font-semibold text-[#253c7e]">Vendedor responsável</Label>
            <Input id="seller-name" value={sellerName} onChange={(event) => setSellerName(event.target.value)} placeholder={user.name || "Nome do vendedor"} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email" className="font-semibold text-[#253c7e]">E-mail da cliente</Label>
            <Input id="client-email" type="email" value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} placeholder="cliente@exemplo.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-phone" className="font-semibold text-[#253c7e]">Telefone da cliente</Label>
            <Input id="client-phone" value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} placeholder="(31) 99999-9999" />
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-[#253c7e]">Componentes de instalação</h3>
                <p className="text-sm text-slate-500">Inclua materiais, proteções, serviços e itens adicionais.</p>
              </div>
              <Button onClick={addComponent} variant="outline" className="border-[#ff6900] text-[#ff6900] hover:bg-orange-50 print:hidden">
                <CirclePlus className="mr-2 h-4 w-4" /> Adicionar componente
              </Button>
            </div>

            <div className="hidden grid-cols-[minmax(0,1fr)_7rem_10rem_9rem_2.5rem] gap-3 border-b border-slate-200 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
              <span>Componente</span><span>Quantidade</span><span>Valor unitário</span><span className="text-right">Subtotal</span><span aria-hidden="true" />
            </div>

            <div className="divide-y divide-slate-100">
              {components.map((component) => (
                <div key={component.id} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_7rem_10rem_9rem_2.5rem] md:items-center">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 md:hidden">Componente</Label>
                    <Input aria-label={`Componente ${component.name}`} value={component.name} onChange={(event) => updateComponent(component.id, "name", event.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 md:hidden">Quantidade</Label>
                    <div className="flex items-center rounded-md border border-input bg-background">
                      <button aria-label={`Diminuir quantidade de ${component.name}`} onClick={() => adjustQuantity(component.id, -1)} className="p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#253c7e]"><Minus className="h-3.5 w-3.5" /></button>
                      <Input aria-label={`Quantidade de ${component.name}`} type="number" min="0" value={component.quantity} onChange={(event) => updateComponent(component.id, "quantity", event.target.value)} className="h-9 border-0 px-1 text-center shadow-none focus-visible:ring-0" />
                      <button aria-label={`Aumentar quantidade de ${component.name}`} onClick={() => adjustQuantity(component.id, 1)} className="p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#253c7e]"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 md:hidden">Valor unitário</Label>
                    <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <span className="select-none border-r border-input px-2 text-sm font-semibold text-slate-500">R$</span>
                      <Input aria-label={`Valor unitário de ${component.name}`} type="number" min="0" step="0.01" inputMode="decimal" value={component.unitPrice === 0 ? "" : component.unitPrice} onChange={(event) => updateComponent(component.id, "unitPrice", event.target.value)} placeholder="0,00" className="border-0 shadow-none focus-visible:ring-0" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-bold text-[#253c7e] md:justify-end md:bg-transparent md:px-0">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500 md:hidden">Subtotal</span>
                    <span>{currency.format(calculateLineTotal(component))}</span>
                  </div>
                  <Button aria-label={`Remover ${component.name}`} onClick={() => setComponents((current) => current.filter((item) => item.id !== component.id))} variant="ghost" size="icon" disabled={components.length === 1} className="justify-self-end text-slate-400 hover:bg-red-50 hover:text-red-600 print:hidden"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-[#253c7e] p-6 text-white shadow-lg print:border print:border-slate-200 print:bg-white print:text-[#253c7e]">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-[#ff6900] p-2 text-white"><Calculator className="h-5 w-5" /></div>
              <div><p className="text-sm font-semibold text-orange-200 print:text-[#ff6900]">Resumo comercial</p><h3 className="font-bold">Valor da proposta</h3></div>
            </div>
            <div className="border-y border-white/20 py-5 print:border-slate-200">
              <p className="text-sm text-blue-100 print:text-slate-500">Total estimado</p>
              <p aria-live="polite" className="mt-1 text-4xl font-bold tracking-tight text-white print:text-[#253c7e]">{currency.format(total)}</p>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-blue-100 print:text-slate-500">Cliente</dt><dd className="text-right font-semibold">{clientName || "Não informado"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-blue-100 print:text-slate-500">Vendedor</dt><dd className="text-right font-semibold">{sellerName || "A preencher"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-blue-100 print:text-slate-500">Itens</dt><dd className="font-semibold">{components.length}</dd></div>
            </dl>
            <div className="mt-6 rounded-xl border border-white/20 bg-white/10 p-3 print:border-slate-200 print:bg-slate-50">
              <p className="flex items-center gap-2 text-xs font-semibold text-orange-200 print:text-[#ff6900]"><CheckCircle2 className="h-4 w-4" /> Propostas salvas</p>
              <p className="mt-1 text-2xl font-bold">{savedProposals.data?.length ?? 0}</p>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-blue-100 print:text-slate-500">Os valores são estimativos. O escopo definitivo deve ser confirmado após vistoria técnica, avaliação de infraestrutura, proteções e cabeamento.</p>
          </aside>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:hidden">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <h3 className="font-bold text-[#253c7e]">Propostas salvas no painel</h3>
              <p className="text-sm text-slate-500">Vendedores visualizam suas propostas; administradores visualizam todas.</p>
            </div>
          </div>
          {savedProposals.isLoading ? (
            <p className="px-5 py-6 text-sm text-slate-500">Carregando propostas salvas…</p>
          ) : savedProposals.data?.length ? (
            <div className="divide-y divide-slate-100">
              {savedProposals.data.map((proposal) => (
                <div key={proposal.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6">
                  <div>
                    <p className="font-semibold text-slate-900">{proposal.clientName}</p>
                    <p className="text-sm text-slate-500">{proposal.sellerName} · {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${proposal.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-[#253c7e]"}`}>{proposal.status === "sent" ? "Enviada" : "Rascunho"}</span>
                  <p className="font-bold text-[#253c7e]">{currency.format(proposal.totalCents / 100)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-6 text-sm text-slate-500">Nenhuma proposta foi salva por este perfil ainda.</p>
          )}
        </section>

        {user?.role === "admin" && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h3 className="font-bold text-[#253c7e]">Perfis de vendedores</h3>
              <p className="text-sm text-slate-500">Libere o acesso comercial após o usuário realizar o primeiro login.</p>
            </div>
            <div className="divide-y divide-slate-100">
              {teamUsers.data?.map((teamMember) => (
                <div key={teamMember.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_11rem] sm:items-center">
                  <div>
                    <p className="font-semibold text-slate-900">{teamMember.name || "Usuário sem nome"}</p>
                    <p className="text-sm text-slate-500">{teamMember.email || "E-mail não informado"}</p>
                  </div>
                  <select aria-label={`Perfil de ${teamMember.name || teamMember.id}`} value={teamMember.role} onChange={(event) => updateRole.mutate({ id: teamMember.id, role: event.target.value as "user" | "seller" | "admin" })} disabled={updateRole.isPending} className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold text-[#253c7e] focus:outline-none focus:ring-2 focus:ring-[#253c7e]">
                    <option value="user">Usuário</option>
                    <option value="seller">Vendedor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
