import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { calculateLineTotal, calculateProposalTotal, type ProposalComponent } from "@/lib/proposalCalculator";
import { formatBrlCurrencyInput, parseBrlCurrencyInput } from "@/lib/currencyMask";
import { AlertCircle, ArrowLeft, Calculator, CheckCircle2, CirclePlus, Eye, FileDown, FileImage, ImagePlus, Loader2, LockKeyhole, Minus, Plus, RefreshCw, Save, Send, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const INITIAL_COMPONENTS: ProposalComponent[] = [
  { id: "eve-0074h", name: "Estação de recarga Intelbras Home EVE 0074H", quantity: 1, unitPrice: 0 },
  { id: "installation", name: "Mão de obra de instalação e comissionamento", quantity: 1, unitPrice: 0 },
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
    reader.readAsDataURL(file);
  });
}

export default function InteractiveChargingProposal() {
  const { user, loading, refresh, logout } = useAuth();
  const [clientName, setClientName] = useState("RENATA COALHO TEIXEIRA");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [components, setComponents] = useState<ProposalComponent[]>(INITIAL_COMPONENTS);
  const [lastSavedProposalId, setLastSavedProposalId] = useState<number | null>(null);
  const [uploadingComponentId, setUploadingComponentId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<{ url: string; name: string } | null>(null);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [hasPreviewedCurrentProposal, setHasPreviewedCurrentProposal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [newSellerName, setNewSellerName] = useState("");
  const [newSellerEmail, setNewSellerEmail] = useState("");
  const [newSellerPassword, setNewSellerPassword] = useState("");
  const [editingSellerId, setEditingSellerId] = useState<number | null>(null);
  const [editingSellerName, setEditingSellerName] = useState("");
  const [editingSellerEmail, setEditingSellerEmail] = useState("");
  const [editingSellerPassword, setEditingSellerPassword] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [emailDeliveryFeedback, setEmailDeliveryFeedback] = useState<{ status: "sending" | "success" | "error"; message: string } | null>(null);
  const total = useMemo(() => calculateProposalTotal(components), [components]);
  const hasSellerAccess = user?.role === "admin" || user?.role === "seller";
  const historyInput = useMemo(() => ({ search: historySearch.trim() || undefined }), [historySearch]);
  const reportInput = useMemo(() => ({ month: reportMonth }), [reportMonth]);
  const savedProposals = trpc.chargingProposals.list.useQuery(undefined, { enabled: hasSellerAccess });
  const sentHistory = trpc.chargingProposals.sentHistory.useQuery(historyInput, { enabled: hasSellerAccess });
  const monthlyReport = trpc.chargingProposals.monthlyReport.useQuery(reportInput, { enabled: hasSellerAccess });
  const teamUsers = trpc.salesTeam.listUsers.useQuery(undefined, { enabled: user?.role === "admin" });
  const pdfPreview = trpc.chargingProposals.previewPdf.useQuery({ id: lastSavedProposalId ?? 1 }, {
    enabled: pdfPreviewOpen && Boolean(lastSavedProposalId),
    retry: false,
  });
  const localLogin = trpc.auth.localLogin.useMutation({
    onSuccess: async () => {
      await refresh();
      toast.success("Acesso comercial liberado.");
    },
    onError: (error) => toast.error(error.message || "Não foi possível entrar."),
  });
  useEffect(() => {
    if (pdfPreview.data?.dataUrl) setHasPreviewedCurrentProposal(true);
  }, [pdfPreview.data?.dataUrl]);
  const saveProposal = trpc.chargingProposals.save.useMutation({
    onSuccess: async (result) => {
      setLastSavedProposalId(result.proposalId);
      await savedProposals.refetch();
      toast.success(`Proposta #${result.proposalId} salva no painel`);
    },
    onError: (error) => toast.error(error.message || "Não foi possível salvar a proposta"),
  });
  const sendProposal = trpc.chargingProposals.sendEmail.useMutation({
    onMutate: () => {
      setEmailDeliveryFeedback({ status: "sending", message: "Preparando o PDF e enviando a proposta. Não feche esta página até a confirmação." });
    },
    onSuccess: async () => {
      await savedProposals.refetch();
      await sentHistory.refetch();
      await monthlyReport.refetch();
      setEmailDeliveryFeedback({ status: "success", message: "Proposta enviada ao servidor de e-mail com sucesso. A entrega pode levar alguns minutos; peça à cliente que verifique também a pasta de spam." });
      toast.success("Proposta enviada por e-mail à cliente.");
    },
    onError: (error) => {
      const message = error.message || "Não foi possível enviar a proposta.";
      setEmailDeliveryFeedback({ status: "error", message });
      toast.error(message);
    },
  });
  const updateRole = trpc.salesTeam.updateRole.useMutation({
    onSuccess: async () => {
      await teamUsers.refetch();
      toast.success("Perfil de acesso atualizado.");
    },
    onError: (error) => toast.error(error.message || "Não foi possível atualizar o perfil."),
  });
  const createLocalSeller = trpc.salesTeam.createLocalSeller.useMutation({
    onSuccess: async () => {
      setNewSellerName("");
      setNewSellerEmail("");
      setNewSellerPassword("");
      await teamUsers.refetch();
      toast.success("Credenciais locais do vendedor criadas.");
    },
    onError: (error) => toast.error(error.message || "Não foi possível criar as credenciais do vendedor."),
  });
  const updateLocalSeller = trpc.salesTeam.updateLocalSeller.useMutation({
    onSuccess: async () => {
      setEditingSellerId(null);
      setEditingSellerName("");
      setEditingSellerEmail("");
      setEditingSellerPassword("");
      await teamUsers.refetch();
      toast.success("Conta local do vendedor atualizada.");
    },
    onError: (error) => toast.error(error.message || "Não foi possível atualizar a conta do vendedor."),
  });
  const setLocalSellerActive = trpc.salesTeam.setLocalSellerActive.useMutation({
    onSuccess: async (_result, input) => {
      await teamUsers.refetch();
      toast.success(input.isActive ? "Conta de vendedor reativada." : "Conta de vendedor desativada.");
    },
    onError: (error) => toast.error(error.message || "Não foi possível alterar o estado da conta."),
  });
  const deleteLocalSeller = trpc.salesTeam.deleteLocalSeller.useMutation({
    onSuccess: async () => {
      await teamUsers.refetch();
      toast.success("Conta de vendedor excluída permanentemente.");
    },
    onError: (error) => toast.error(error.message || "Não foi possível excluir a conta. Se houver histórico comercial, desative-a."),
  });
  const duplicateProposal = trpc.chargingProposals.duplicate.useMutation({
    onSuccess: async (result) => {
      await savedProposals.refetch();
      toast.success(`Proposta #${result.proposalId} duplicada como pendente.`);
    },
    onError: (error) => toast.error(error.message || "Não foi possível duplicar a proposta."),
  });
  const updateProposalStatus = trpc.chargingProposals.updateStatus.useMutation({
    onSuccess: async () => {
      await savedProposals.refetch();
      toast.success("Status comercial atualizado.");
    },
    onError: (error) => toast.error(error.message || "Não foi possível atualizar o status."),
  });
  const uploadProductImage = trpc.chargingProposals.uploadProductImage.useMutation();

  const startNewProposal = () => {
    if (lastSavedProposalId && !window.confirm("Iniciar uma nova proposta? Os dados exibidos no formulário atual serão substituídos.")) return;
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setSellerName(user?.name || "");
    setComponents(INITIAL_COMPONENTS.map((component) => ({ ...component, id: crypto.randomUUID(), unitPrice: 0, imageUrl: undefined })));
    setLastSavedProposalId(null);
    setPdfPreviewOpen(false);
    setHasPreviewedCurrentProposal(false);
    setEmailDeliveryFeedback(null);
    toast.success("Novo formulário de proposta iniciado.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cloneProposalForEditing = (proposal: { clientName: string; clientEmail: string | null; clientPhone: string | null; sellerName: string; componentsJson: string }) => {
    try {
      const sourceComponents = JSON.parse(proposal.componentsJson);
      if (!Array.isArray(sourceComponents)) throw new Error("Itens inválidos");
      setClientName(`${proposal.clientName} — cópia`);
      setClientEmail(proposal.clientEmail || "");
      setClientPhone(proposal.clientPhone || "");
      setSellerName(user?.name || proposal.sellerName);
      setComponents(sourceComponents.map((component: ProposalComponent) => ({ ...component, id: crypto.randomUUID() })));
      setLastSavedProposalId(null);
      setPdfPreviewOpen(false);
      setHasPreviewedCurrentProposal(false);
      setEmailDeliveryFeedback(null);
      toast.success("Proposta clonada no formulário. Revise os dados e salve como uma nova proposta.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Não foi possível carregar os itens desta proposta para clonagem.");
    }
  };

  const handleSecureLogout = async () => {
    try {
      await logout();
      toast.success("Sessão encerrada com segurança.");
    } catch (error: any) {
      toast.error(error.message || "Não foi possível encerrar a sessão.");
    }
  };

  const updateComponent = (id: string, field: keyof Pick<ProposalComponent, "name" | "quantity" | "unitPrice">, value: string) => {
    setComponents((current) => current.map((component) => {
      if (component.id !== id) return component;
      if (field === "name") return { ...component, name: value };
      if (field === "quantity") return { ...component, quantity: Math.max(0, Number.parseInt(value || "0", 10) || 0) };
      return { ...component, unitPrice: parseBrlCurrencyInput(value) };
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

  const handleProductImageUpload = async (componentId: string, file?: File) => {
    if (!file) return;
    if (!file.type.match(/^image\/(png|jpeg|webp)$/)) {
      toast.error("Selecione uma imagem PNG, JPEG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }
    try {
      setUploadingComponentId(componentId);
      const result = await uploadProductImage.mutateAsync({ fileName: file.name, dataUrl: await readImageAsDataUrl(file) });
      setComponents((current) => current.map((component) => component.id === componentId ? { ...component, imageUrl: result.url } : component));
      toast.success("Imagem do produto adicionada ao componente.");
    } catch (error: any) {
      toast.error(error.message || "Não foi possível enviar a imagem do produto.");
    } finally {
      setUploadingComponentId(null);
    }
  };

  const handleOpenPdfPreview = () => {
    if (!lastSavedProposalId) {
      toast.error("Salve a proposta antes de gerar a pré-visualização do PDF.");
      return;
    }
    setHasPreviewedCurrentProposal(false);
    setPdfPreviewOpen(true);
  };

  const handleSend = () => {
    if (!lastSavedProposalId) {
      const message = "Salve a proposta antes de enviá-la por e-mail.";
      setEmailDeliveryFeedback({ status: "error", message });
      toast.error(message);
      return;
    }
    if (!clientEmail.trim()) {
      const message = "Informe o e-mail da cliente antes de enviar.";
      setEmailDeliveryFeedback({ status: "error", message });
      toast.error(message);
      return;
    }
    if (!hasPreviewedCurrentProposal) {
      const message = "Revise a pré-visualização do PDF antes de confirmar o envio.";
      setEmailDeliveryFeedback({ status: "error", message });
      toast.error(message);
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
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#253c7e] text-white"><LockKeyhole className="h-6 w-6" /></div>
          <h1 className="text-2xl font-bold text-[#253c7e]">Acesso de vendedor</h1>
          <p className="mt-3 text-slate-600">Entre com as credenciais locais fornecidas pelo administrador para elaborar, salvar e enviar propostas comerciais.</p>
          <form className="mt-6 space-y-4 text-left" onSubmit={(event) => { event.preventDefault(); localLogin.mutate({ email: loginEmail, password: loginPassword }); }}>
            <div className="space-y-2"><Label htmlFor="local-login-email">E-mail</Label><Input id="local-login-email" type="email" autoComplete="username" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="local-login-password">Senha</Label><Input id="local-login-password" type="password" autoComplete="current-password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required /></div>
            <Button type="submit" disabled={localLogin.isPending} className="w-full bg-[#ff6900] hover:bg-[#e35e00]">{localLogin.isPending ? "Entrando…" : "Entrar para continuar"}</Button>
          </form>
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
          <div className="flex flex-wrap justify-end gap-2 print:hidden">
            <Button type="button" onClick={startNewProposal} variant="outline" className="border-white/70 bg-transparent text-white hover:bg-white hover:text-[#253c7e]">Nova proposta</Button>
            <Button type="button" onClick={handleSecureLogout} variant="outline" className="border-orange-200 bg-orange-500 text-white hover:bg-white hover:text-[#253c7e]">Sair com segurança</Button>
            <Link href="/"><Button variant="outline" className="border-white/70 bg-transparent text-white hover:bg-white hover:text-[#253c7e]"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao site</Button></Link>
          </div>
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
            <Button onClick={handleOpenPdfPreview} disabled={!lastSavedProposalId} variant="outline" className="border-[#253c7e] text-[#253c7e] hover:bg-blue-50"><FileImage className="mr-2 h-4 w-4" /> Pré-visualizar PDF</Button>
            <Button onClick={handleSend} aria-busy={sendProposal.isPending} disabled={!lastSavedProposalId || !hasPreviewedCurrentProposal || sendProposal.isPending} variant="outline" className="border-[#ff6900] text-[#ff6900] hover:bg-orange-50"><Send className="mr-2 h-4 w-4" /> {sendProposal.isPending ? "Enviando…" : "Enviar PDF por e-mail"}</Button>
            <Button onClick={() => window.print()} className="bg-[#ff6900] text-white hover:bg-[#e35e00]"><FileDown className="mr-2 h-4 w-4" /> Imprimir ou salvar PDF</Button>
          </div>
          {emailDeliveryFeedback && <div role={emailDeliveryFeedback.status === "error" ? "alert" : "status"} aria-live={emailDeliveryFeedback.status === "error" ? "assertive" : "polite"} className={`mt-4 flex items-start justify-between gap-4 rounded-xl border px-4 py-4 text-sm ${emailDeliveryFeedback.status === "sending" ? "border-blue-200 bg-blue-50 text-blue-800" : emailDeliveryFeedback.status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
            <div className="flex items-start gap-3">
              {emailDeliveryFeedback.status === "sending" ? <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin" aria-hidden="true" /> : emailDeliveryFeedback.status === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
              <div><p className="font-bold">{emailDeliveryFeedback.status === "sending" ? "Enviando proposta…" : emailDeliveryFeedback.status === "success" ? "Envio confirmado" : "Não foi possível concluir o envio"}</p><p className="mt-1 leading-relaxed">{emailDeliveryFeedback.message}</p></div>
            </div>
            {emailDeliveryFeedback.status === "error" ? <Button type="button" size="sm" variant="outline" onClick={handleSend} disabled={sendProposal.isPending} className="shrink-0 border-red-300 text-red-800 hover:bg-red-100"><RefreshCw className="mr-2 h-4 w-4" />Tentar novamente</Button> : emailDeliveryFeedback.status === "success" ? <Button type="button" size="sm" variant="ghost" onClick={() => setEmailDeliveryFeedback(null)} className="shrink-0 text-emerald-800 hover:bg-emerald-100">Fechar</Button> : null}
          </div>}
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
                      <Input aria-label={`Valor unitário de ${component.name}`} type="text" inputMode="numeric" value={formatBrlCurrencyInput(component.unitPrice)} onChange={(event) => updateComponent(component.id, "unitPrice", event.target.value)} placeholder="0,00" className="border-0 shadow-none focus-visible:ring-0" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-bold text-[#253c7e] md:justify-end md:bg-transparent md:px-0">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500 md:hidden">Subtotal</span>
                    <span>{currency.format(calculateLineTotal(component))}</span>
                  </div>
                  <Button aria-label={`Remover ${component.name}`} onClick={() => setComponents((current) => current.filter((item) => item.id !== component.id))} variant="ghost" size="icon" disabled={components.length === 1} className="justify-self-end text-slate-400 hover:bg-red-50 hover:text-red-600 print:hidden"><Trash2 className="h-4 w-4" /></Button>
                  <div className="flex flex-wrap items-center gap-3 md:col-span-5 print:hidden">
                    {component.imageUrl ? <img src={component.imageUrl} alt={`Imagem de ${component.name}`} className="h-12 w-16 rounded-md border border-slate-200 object-cover" /> : <div className="flex h-12 w-16 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-400"><ImagePlus className="h-4 w-4" /></div>}
                    <label className="inline-flex h-9 cursor-pointer items-center rounded-md border border-[#253c7e] px-3 text-sm font-semibold text-[#253c7e] transition-colors hover:bg-blue-50">
                      <ImagePlus className="mr-2 h-4 w-4" /> {uploadingComponentId === component.id ? "Enviando…" : "Inserir imagem"}
                      <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={uploadingComponentId === component.id} onChange={(event) => { void handleProductImageUpload(component.id, event.target.files?.[0]); event.currentTarget.value = ""; }} />
                    </label>
                    {component.imageUrl && <Button onClick={() => setImagePreview({ url: component.imageUrl!, name: component.name })} type="button" variant="outline" size="sm" className="border-[#ff6900] text-[#ff6900] hover:bg-orange-50"><Eye className="mr-2 h-4 w-4" /> Visualizar imagem</Button>}
                  </div>
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
                <div key={proposal.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{proposal.clientName}</p>
                    <p className="text-sm text-slate-500">{proposal.sellerName} · {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <select aria-label={`Status da proposta de ${proposal.clientName}`} value={proposal.status} onChange={(event) => updateProposalStatus.mutate({ id: proposal.id, status: event.target.value as "pending" | "approved" | "rejected" })} disabled={updateProposalStatus.isPending} className={`h-8 rounded-full border-0 px-2.5 text-xs font-bold ${proposal.status === "approved" ? "bg-emerald-100 text-emerald-700" : proposal.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovada</option>
                    <option value="rejected">Recusada</option>
                  </select>
                  <p className="font-bold text-[#253c7e]">{currency.format(proposal.totalCents / 100)}</p>
                  <div className="flex flex-wrap justify-end gap-2"><Button onClick={() => cloneProposalForEditing(proposal)} variant="outline" size="sm" className="border-[#253c7e] text-[#253c7e] hover:bg-blue-50">Clonar e editar</Button><Button onClick={() => duplicateProposal.mutate({ id: proposal.id })} disabled={duplicateProposal.isPending} variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50">Duplicar</Button></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-6 text-sm text-slate-500">Nenhuma proposta foi salva por este perfil ainda.</p>
          )}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div><h3 className="font-bold text-[#253c7e]">Histórico de propostas enviadas</h3><p className="text-sm text-slate-500">Consulte os envios realizados por cliente, e-mail ou vendedor.</p></div>
            <div className="w-full md:max-w-sm"><Label htmlFor="proposal-history-search" className="sr-only">Pesquisar histórico</Label><Input id="proposal-history-search" value={historySearch} onChange={(event) => setHistorySearch(event.target.value)} placeholder="Buscar cliente, e-mail ou vendedor" /></div>
          </div>
          {sentHistory.isLoading ? <p className="px-5 py-6 text-sm text-slate-500">Carregando histórico de envios…</p> : sentHistory.data?.length ? <div className="divide-y divide-slate-100">{sentHistory.data.map((proposal) => <div key={proposal.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto_auto] md:items-center"><div><p className="font-semibold text-slate-900">{proposal.clientName}</p><p className="text-sm text-slate-500">{proposal.clientEmail || "E-mail não informado"} · {proposal.sellerName}</p><p className="mt-1 text-xs font-medium text-emerald-700">Enviada em {proposal.sentAt ? new Date(proposal.sentAt).toLocaleString("pt-BR") : "—"}</p></div><p className="font-bold text-[#253c7e]">{currency.format(proposal.totalCents / 100)}</p><Button type="button" variant="outline" size="sm" onClick={() => { setLastSavedProposalId(proposal.id); setPdfPreviewOpen(true); }} className="border-[#253c7e] text-[#253c7e]"><Eye className="mr-2 h-4 w-4" />Ver PDF</Button></div>)}</div> : <p className="px-5 py-6 text-sm text-slate-500">Nenhuma proposta enviada corresponde à pesquisa.</p>}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between"><div><h3 className="font-bold text-[#253c7e]">{user?.role === "admin" ? "Relatório mensal da equipe" : "Meu relatório mensal"}</h3><p className="text-sm text-slate-500">Volume de propostas criadas, enviadas e valores do período.</p></div><div><Label htmlFor="proposal-report-month" className="sr-only">Mês do relatório</Label><Input id="proposal-report-month" type="month" value={reportMonth} onChange={(event) => setReportMonth(event.target.value)} className="w-full md:w-44" /></div></div>
          {monthlyReport.isLoading ? <p className="px-5 py-6 text-sm text-slate-500">Calculando relatório mensal…</p> : monthlyReport.data && <div className="p-5"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Propostas geradas</p><p className="mt-1 text-2xl font-bold text-[#253c7e]">{monthlyReport.data.totalProposals}</p></div><div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Enviadas</p><p className="mt-1 text-2xl font-bold text-emerald-800">{monthlyReport.data.sentProposals}</p></div><div className="rounded-xl bg-amber-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-amber-700">Pendentes</p><p className="mt-1 text-2xl font-bold text-amber-800">{monthlyReport.data.pendingProposals}</p></div><div className="rounded-xl bg-orange-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-orange-700">Valor gerado</p><p className="mt-1 text-xl font-bold text-[#ff6900]">{currency.format(monthlyReport.data.totalCents / 100)}</p></div></div>{user?.role === "admin" && <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="mb-2 text-left font-bold text-[#253c7e]">Resultado por vendedor</caption><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-2 py-2">Vendedor</th><th className="px-2 py-2 text-right">Geradas</th><th className="px-2 py-2 text-right">Enviadas</th><th className="px-2 py-2 text-right">Valor</th></tr></thead><tbody>{monthlyReport.data.bySeller.map((seller) => <tr key={seller.sellerId} className="border-b border-slate-100"><td className="px-2 py-3 font-medium text-slate-800">{seller.sellerName}</td><td className="px-2 py-3 text-right">{seller.totalProposals}</td><td className="px-2 py-3 text-right">{seller.sentProposals}</td><td className="px-2 py-3 text-right font-semibold text-[#253c7e]">{currency.format(seller.totalCents / 100)}</td></tr>)}</tbody></table></div>}</div>}
        </section>

        {user?.role === "admin" && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h3 className="font-bold text-[#253c7e]">Perfis de vendedores</h3>
              <p className="text-sm text-slate-500">Crie credenciais locais para vendedores que acessarão o painel pelo domínio bessaenergia.com.br.</p>
            </div>
            <form className="grid gap-3 border-b border-slate-200 p-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end" onSubmit={(event) => { event.preventDefault(); createLocalSeller.mutate({ name: newSellerName, email: newSellerEmail, password: newSellerPassword }); }}>
              <div className="space-y-2"><Label htmlFor="new-seller-name">Nome do vendedor</Label><Input id="new-seller-name" value={newSellerName} onChange={(event) => setNewSellerName(event.target.value)} minLength={2} required /></div>
              <div className="space-y-2"><Label htmlFor="new-seller-email">E-mail</Label><Input id="new-seller-email" type="email" value={newSellerEmail} onChange={(event) => setNewSellerEmail(event.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="new-seller-password">Senha inicial</Label><Input id="new-seller-password" type="password" value={newSellerPassword} onChange={(event) => setNewSellerPassword(event.target.value)} minLength={16} required /><p className="text-xs text-slate-500">Mínimo de 16 caracteres.</p></div>
              <Button type="submit" disabled={createLocalSeller.isPending} className="bg-[#ff6900] hover:bg-[#e35e00]">{createLocalSeller.isPending ? "Criando…" : "Criar vendedor"}</Button>
            </form>
            <div className="divide-y divide-slate-100">
              {teamUsers.data?.map((teamMember) => {
                const isManageableLocalSeller = teamMember.role === "seller" && teamMember.loginMethod === "local" && teamMember.isLocalAccountActive !== null;
                const isActive = teamMember.isLocalAccountActive === 1;
                return <div key={teamMember.id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1fr_11rem_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-slate-900">{teamMember.name || "Usuário sem nome"}</p>{isManageableLocalSeller && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{isActive ? "Ativa" : "Desativada"}</span>}</div>
                    <p className="text-sm text-slate-500">{teamMember.email || "E-mail não informado"}{isManageableLocalSeller ? " · conta local" : ""}</p>
                  </div>
                  <select aria-label={`Perfil de ${teamMember.name || teamMember.id}`} value={teamMember.role} onChange={(event) => updateRole.mutate({ id: teamMember.id, role: event.target.value as "user" | "seller" | "admin" })} disabled={updateRole.isPending} className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold text-[#253c7e] focus:outline-none focus:ring-2 focus:ring-[#253c7e]">
                    <option value="user">Usuário</option>
                    <option value="seller">Vendedor</option>
                    <option value="admin">Administrador</option>
                  </select>
                  {isManageableLocalSeller && <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditingSellerId(teamMember.id); setEditingSellerName(teamMember.name || ""); setEditingSellerEmail(teamMember.email || ""); setEditingSellerPassword(""); }} className="border-[#253c7e] text-[#253c7e]">Editar</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setLocalSellerActive.mutate({ id: teamMember.id, isActive: !isActive })} disabled={setLocalSellerActive.isPending} className="border-amber-500 text-amber-700">{isActive ? "Desativar" : "Reativar"}</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => { if (window.confirm(`Excluir permanentemente a conta de ${teamMember.name || teamMember.email}? Esta ação não pode ser desfeita.`)) deleteLocalSeller.mutate({ id: teamMember.id }); }} disabled={deleteLocalSeller.isPending} className="border-red-300 text-red-700 hover:bg-red-50">Excluir</Button>
                  </div>}
                </div>;
              })}
            </div>
          </section>
        )}
      </main>
      {editingSellerId !== null && <div role="dialog" aria-modal="true" aria-label="Editar conta de vendedor" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4">
        <form className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onSubmit={(event) => { event.preventDefault(); updateLocalSeller.mutate({ id: editingSellerId, name: editingSellerName, email: editingSellerEmail, password: editingSellerPassword || undefined }); }}>
          <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-bold text-[#253c7e]">Editar vendedor</h3><p className="mt-1 text-sm text-slate-500">Deixe a senha em branco para mantê-la inalterada.</p></div><Button type="button" variant="ghost" size="icon" aria-label="Fechar edição de vendedor" onClick={() => setEditingSellerId(null)}><X className="h-5 w-5" /></Button></div>
          <div className="mt-5 space-y-4"><div className="space-y-2"><Label htmlFor="edit-seller-name">Nome</Label><Input id="edit-seller-name" value={editingSellerName} onChange={(event) => setEditingSellerName(event.target.value)} minLength={2} required /></div><div className="space-y-2"><Label htmlFor="edit-seller-email">E-mail</Label><Input id="edit-seller-email" type="email" value={editingSellerEmail} onChange={(event) => setEditingSellerEmail(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="edit-seller-password">Nova senha opcional</Label><Input id="edit-seller-password" type="password" value={editingSellerPassword} onChange={(event) => setEditingSellerPassword(event.target.value)} minLength={editingSellerPassword ? 16 : undefined} /><p className="text-xs text-slate-500">Se informada, deve ter pelo menos 16 caracteres.</p></div></div>
          <div className="mt-6 flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setEditingSellerId(null)}>Cancelar</Button><Button type="submit" disabled={updateLocalSeller.isPending} className="bg-[#ff6900] hover:bg-[#e35e00]">{updateLocalSeller.isPending ? "Salvando…" : "Salvar alterações"}</Button></div>
        </form>
      </div>}
      {imagePreview && <div role="dialog" aria-modal="true" aria-label={`Imagem de ${imagePreview.name}`} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={() => setImagePreview(null)}>
        <div className="relative max-h-full max-w-4xl rounded-2xl bg-white p-3 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <Button aria-label="Fechar imagem" onClick={() => setImagePreview(null)} variant="ghost" size="icon" className="absolute right-4 top-4 z-10 bg-white/90 text-[#253c7e]"><X className="h-5 w-5" /></Button>
          <img src={imagePreview.url} alt={imagePreview.name} className="max-h-[80vh] max-w-full rounded-xl object-contain" />
          <p className="px-2 pb-1 pt-3 text-sm font-semibold text-[#253c7e]">{imagePreview.name}</p>
        </div>
      </div>}
      {pdfPreviewOpen && <div role="dialog" aria-modal="true" aria-label="Pré-visualização do PDF da proposta" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4">
        <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h3 className="font-bold text-[#253c7e]">Pré-visualização da proposta</h3><p className="text-sm text-slate-500">Revise o PDF antes de confirmar o envio à cliente.</p></div><Button aria-label="Fechar pré-visualização do PDF" onClick={() => setPdfPreviewOpen(false)} variant="ghost" size="icon"><X className="h-5 w-5" /></Button></div>
          {pdfPreview.isLoading ? <div className="flex flex-1 items-center justify-center text-slate-500">Gerando PDF…</div> : pdfPreview.data?.dataUrl ? <iframe title="Pré-visualização da proposta comercial" src={pdfPreview.data.dataUrl} className="min-h-0 flex-1 bg-slate-100" /> : <div className="flex flex-1 items-center justify-center p-8 text-center text-red-600">Não foi possível gerar a pré-visualização. Feche e tente novamente.</div>}
        </div>
      </div>}
    </div>
  );
}
