import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronRight, LockKeyhole, LogOut, Search, ShieldCheck } from "lucide-react";
import QRCode from "react-qr-code";
import { useEffect, useMemo, useState } from "react";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  proposal_sent: "bg-purple-100 text-purple-800",
  closed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  new: "Novo",
  contacted: "Contatado",
  proposal_sent: "Proposta Enviada",
  closed: "Fechado",
  rejected: "Rejeitado",
};

export default function AdminDashboard() {
  const { user, loading, refresh, logout } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewSort, setReviewSort] = useState<"newest" | "oldest" | "highest_rating" | "lowest_rating">("newest");
  const [reviewPage, setReviewPage] = useState(1);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [switchAccountError, setSwitchAccountError] = useState<string | null>(null);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryFeedback, setRecoveryFeedback] = useState<string | null>(null);
  const [loginTotpCode, setLoginTotpCode] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpSetup, setTotpSetup] = useState<{ otpauthUrl: string; manualKey: string } | null>(null);
  const [totpFeedback, setTotpFeedback] = useState<string | null>(null);
  const hasAdminAccess = user?.role === "admin";

  const { data: budgets, isLoading, refetch } = trpc.admin.budgets.list.useQuery({
    status: selectedStatus || undefined,
    limit: 50,
  }, { enabled: hasAdminAccess });

  const { data: selectedBudgetData } = trpc.admin.budgets.getById.useQuery(
    { id: selectedBudget! },
    { enabled: hasAdminAccess && !!selectedBudget }
  );

  const updateStatusMutation = trpc.admin.budgets.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedBudget(null);
      setNewStatus("");
      setNotes("");
    },
  });

  const reviewFilters = useMemo(() => ({ search: reviewSearch || undefined, sort: reviewSort, page: reviewPage, pageSize: 10 }), [reviewSearch, reviewSort, reviewPage]);
  const { data: pendingReviewPage, isLoading: isLoadingReviews, refetch: refetchReviews } = trpc.reviews.listPending.useQuery(reviewFilters, { enabled: hasAdminAccess });
  const pendingReviews = pendingReviewPage?.reviews ?? [];
  const localLogin = trpc.auth.localLogin.useMutation({
    onSuccess: async () => {
      await refresh();
    },
  });
  const requestAdminPasswordReset = trpc.auth.requestAdminPasswordReset.useMutation({
    onSuccess: () => setRecoveryFeedback("Se houver uma conta administrativa ativa com esse e-mail, enviaremos um link de recuperação. Verifique também a pasta de spam."),
    onError: () => setRecoveryFeedback("Não foi possível processar a solicitação agora. Tente novamente em instantes."),
  });
  const totpStatus = trpc.auth.getAdminTotpStatus.useQuery(undefined, { enabled: hasAdminAccess });
  const setupAdminTotp = trpc.auth.setupAdminTotp.useMutation({
    onSuccess: (setup) => { setTotpSetup(setup); setTotpCode(""); setTotpFeedback(null); },
    onError: (error) => setTotpFeedback(error.message || "Não foi possível iniciar a configuração."),
  });
  const confirmAdminTotp = trpc.auth.confirmAdminTotp.useMutation({
    onSuccess: async () => { setTotpSetup(null); setTotpCode(""); setTotpFeedback("Google Authenticator ativado para esta conta."); await totpStatus.refetch(); },
    onError: (error) => setTotpFeedback(error.message || "Não foi possível validar o código."),
  });
  const disableAdminTotp = trpc.auth.disableAdminTotp.useMutation({
    onSuccess: async () => { setTotpCode(""); setTotpFeedback("Google Authenticator desativado para esta conta."); await totpStatus.refetch(); },
    onError: (error) => setTotpFeedback(error.message || "Não foi possível desativar a proteção."),
  });
  const moderateReviewMutation = trpc.reviews.moderate.useMutation({
    onSuccess: () => refetchReviews(),
  });

  useEffect(() => {
    if (pendingReviewPage && reviewPage > pendingReviewPage.totalPages) {
      setReviewPage(pendingReviewPage.totalPages);
    }
  }, [pendingReviewPage?.totalPages, reviewPage]);

  const handleUpdateStatus = () => {
    if (!selectedBudget || !newStatus) return;
    updateStatusMutation.mutate({
      id: selectedBudget,
      status: newStatus as any,
      notes: notes || undefined,
    });
  };

  const handleSwitchToAdminAccount = async () => {
    try {
      setSwitchAccountError(null);
      setIsSwitchingAccount(true);
      await logout();
      setLoginEmail("");
      setLoginPassword("");
    } catch (error: any) {
      setSwitchAccountError(error?.message || "Não foi possível encerrar a conta atual. Tente novamente.");
    } finally {
      setIsSwitchingAccount(false);
    }
  };

  if (isSwitchingAccount) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl" role="status" aria-live="polite">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#253c7e] text-white"><Loader2 className="h-7 w-7 animate-spin" /></div>
          <h1 className="text-2xl font-bold text-[#253c7e]">Trocando de conta</h1>
          <p className="mt-3 text-slate-600">Estamos encerrando a sessão atual com segurança e preparando o login administrativo.</p>
        </section>
      </div>
    );
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-[#253c7e]">Verificando acesso administrativo…</div>;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#253c7e] text-white"><LockKeyhole className="h-6 w-6" /></div>
          <h1 className="text-2xl font-bold text-[#253c7e]">Acesso administrativo</h1>
          <p className="mt-3 text-slate-600">Entre com as credenciais locais de administrador para moderar avaliações e gerenciar solicitações.</p>
          {showPasswordRecovery ? (
            <form className="mt-6 space-y-4 text-left" onSubmit={(event) => { event.preventDefault(); requestAdminPasswordReset.mutate({ email: recoveryEmail }); }}>
              <label className="block text-sm font-medium text-slate-700" htmlFor="admin-recovery-email">E-mail administrativo
                <Input id="admin-recovery-email" className="mt-2" type="email" autoComplete="email" value={recoveryEmail} onChange={(event) => setRecoveryEmail(event.target.value)} required />
              </label>
              {recoveryFeedback ? <p className="rounded-lg bg-blue-50 p-3 text-sm leading-relaxed text-[#253c7e]">{recoveryFeedback}</p> : null}
              <Button type="submit" disabled={requestAdminPasswordReset.isPending} className="w-full bg-[#ff6900] hover:bg-[#e35e00]">{requestAdminPasswordReset.isPending ? "Enviando link…" : "Enviar link de recuperação"}</Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => { setShowPasswordRecovery(false); setRecoveryFeedback(null); }}>Voltar ao login</Button>
            </form>
          ) : (
            <form className="mt-6 space-y-4 text-left" onSubmit={(event) => { event.preventDefault(); localLogin.mutate({ email: loginEmail, password: loginPassword, totpCode: loginTotpCode || undefined }); }}>
              <label className="block text-sm font-medium text-slate-700" htmlFor="admin-login-email">E-mail
                <Input id="admin-login-email" className="mt-2" type="email" autoComplete="username" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required />
              </label>
              <label className="block text-sm font-medium text-slate-700" htmlFor="admin-login-password">Senha
                <Input id="admin-login-password" className="mt-2" type="password" autoComplete="current-password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required />
              </label>
              <label className="block text-sm font-medium text-slate-700" htmlFor="admin-login-totp">Código do Google Authenticator <span className="font-normal text-slate-500">(se ativado)</span>
                <Input id="admin-login-totp" className="mt-2 tracking-[0.35em]" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={loginTotpCode} onChange={(event) => setLoginTotpCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" />
              </label>
              {localLogin.error ? <p className="text-sm text-red-600">{localLogin.error.message || "Não foi possível entrar com essas credenciais."}</p> : null}
              <Button type="submit" disabled={localLogin.isPending} className="w-full bg-[#ff6900] hover:bg-[#e35e00]">{localLogin.isPending ? "Entrando…" : "Entrar no painel"}</Button>
              <button type="button" className="w-full text-sm font-medium text-[#253c7e] underline underline-offset-4" onClick={() => { setShowPasswordRecovery(true); setRecoveryFeedback(null); }}>Esqueci minha senha</button>
            </form>
          )}
        </section>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#ff6900]"><LockKeyhole className="h-6 w-6" /></div>
          <h1 className="text-2xl font-bold text-[#253c7e]">Acesso não autorizado</h1>
          <p className="mt-3 text-slate-600">Sua conta está autenticada, mas não possui perfil de administrador para moderar avaliações.</p>
          <Button onClick={handleSwitchToAdminAccount} disabled={isSwitchingAccount} className="mt-6 w-full bg-[#ff6900] hover:bg-[#e35e00]">
            {isSwitchingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
            {isSwitchingAccount ? "Encerrando sessão…" : "Entrar com uma conta administradora"}
          </Button>
          {switchAccountError ? <p className="mt-3 text-sm text-red-600">{switchAccountError}</p> : null}
          <a href="/"><Button variant="outline" className="mt-3 border-[#253c7e] text-[#253c7e]">Voltar ao site</Button></a>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerenciar solicitações de orçamento e leads</p>
        </div>

        <section aria-labelledby="seguranca-conta-titulo" className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle id="seguranca-conta-titulo" className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#253c7e]" />Segurança da conta</CardTitle>
              <CardDescription>Adicione uma segunda etapa ao login com o aplicativo Google Authenticator.</CardDescription>
            </CardHeader>
            <CardContent>
              {totpStatus.isLoading ? <div className="flex items-center gap-2 text-sm text-slate-600"><Loader2 className="h-4 w-4 animate-spin" />Consultando proteção da conta…</div> : totpStatus.data?.enabled ? (
                <div className="grid gap-4 md:grid-cols-[1fr_260px] md:items-end">
                  <div><Badge className="bg-emerald-100 text-emerald-800">Google Authenticator ativo</Badge><p className="mt-2 text-sm text-slate-600">O código de seis dígitos será solicitado após a senha em cada novo acesso administrativo.</p></div>
                  <div className="space-y-2"><Input inputMode="numeric" maxLength={6} value={totpCode} onChange={(event) => setTotpCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Código atual para desativar" /><Button variant="outline" disabled={disableAdminTotp.isPending || totpCode.length !== 6} onClick={() => disableAdminTotp.mutate({ code: totpCode })} className="w-full border-red-300 text-red-700 hover:bg-red-50">Desativar proteção</Button></div>
                </div>
              ) : totpSetup ? (
                <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
                  <div className="mx-auto bg-white p-3"><QRCode value={totpSetup.otpauthUrl} size={156} /></div>
                  <div className="space-y-3"><p className="text-sm text-slate-700">Abra o Google Authenticator, escaneie o QR code e informe o código exibido para confirmar.</p><p className="break-all rounded-lg bg-slate-100 p-3 font-mono text-xs text-slate-700">Chave manual: {totpSetup.manualKey}</p><Input inputMode="numeric" maxLength={6} value={totpCode} onChange={(event) => setTotpCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Código de 6 dígitos" /><Button disabled={confirmAdminTotp.isPending || totpCode.length !== 6} onClick={() => confirmAdminTotp.mutate({ code: totpCode })} className="w-full bg-[#ff6900] hover:bg-[#e35e00]">Confirmar Google Authenticator</Button></div>
                </div>
              ) : <Button disabled={setupAdminTotp.isPending} onClick={() => setupAdminTotp.mutate()} className="bg-[#253c7e] hover:bg-[#1b2d61]">{setupAdminTotp.isPending ? "Gerando configuração…" : "Configurar Google Authenticator"}</Button>}
              {totpFeedback ? <p className="mt-4 text-sm text-[#253c7e]" role="status">{totpFeedback}</p> : null}
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budgets List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações de Orçamento</CardTitle>
                <CardDescription>
                  Total: {budgets?.length || 0} solicitações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      <SelectItem value="new">Novo</SelectItem>
                      <SelectItem value="contacted">Contatado</SelectItem>
                      <SelectItem value="proposal_sent">Proposta Enviada</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  </div>
                ) : budgets && budgets.length > 0 ? (
                  <div className="space-y-3">
                    {budgets.map((budget) => (
                      <div
                        key={budget.id}
                        onClick={() => setSelectedBudget(budget.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedBudget === budget.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{budget.clientName}</h3>
                            <p className="text-sm text-gray-500">{budget.clientEmail}</p>
                            <p className="text-sm text-gray-500">{budget.clientPhone}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Consumo: R$ {budget.estimatedMonthlySpend || "N/A"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={statusColors[budget.status]}>
                              {statusLabels[budget.status]}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(budget.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Nenhuma solicitação encontrada</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Details Panel */}
          <div>
            {selectedBudgetData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nome</label>
                    <p className="text-gray-900">{selectedBudgetData.clientName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 break-all">{selectedBudgetData.clientEmail}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Telefone</label>
                    <p className="text-gray-900">{selectedBudgetData.clientPhone}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Consumo Mensal</label>
                    <p className="text-gray-900">R$ {selectedBudgetData.estimatedMonthlySpend || "N/A"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Fonte</label>
                    <p className="text-gray-900">{selectedBudgetData.source}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Data</label>
                    <p className="text-gray-900">
                      {new Date(selectedBudgetData.createdAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <hr className="my-4" />

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Novo Status
                    </label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="contacted">Contatado</SelectItem>
                        <SelectItem value="proposal_sent">Proposta Enviada</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Notas
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Adicionar notas..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleUpdateStatus}
                    disabled={!newStatus || updateStatusMutation.isPending}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4 mr-2" />
                        Atualizar Status
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Selecione uma solicitação para ver detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <section id="moderacao-avaliacoes" aria-labelledby="moderacao-avaliacoes-titulo" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle id="moderacao-avaliacoes-titulo">Central de moderação de avaliações</CardTitle>
              <CardDescription>Revise depoimentos pendentes, aprove ou rejeite o conteúdo e use “Verificar e aprovar” somente após confirmar que a cliente é real. {pendingReviewPage?.total ?? 0} encontrada(s).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input value={reviewSearch} onChange={(event) => { setReviewSearch(event.target.value); setReviewPage(1); }} placeholder="Buscar por cliente, cidade, projeto ou depoimento" className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                <select value={reviewSort} onChange={(event) => { setReviewSort(event.target.value as typeof reviewSort); setReviewPage(1); }} className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" aria-label="Ordenar avaliações pendentes">
                  <option value="newest">Mais recentes primeiro</option>
                  <option value="oldest">Mais antigas primeiro</option>
                  <option value="highest_rating">Maior nota primeiro</option>
                  <option value="lowest_rating">Menor nota primeiro</option>
                </select>
              </div>
              {isLoadingReviews ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-orange-500" /></div>
              ) : pendingReviews.length ? (
                <>
                  <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{review.name} · {review.city}</p>
                          <p className="text-sm text-gray-600">{review.rating}/5 · {review.projectType || 'Projeto não informado'}</p>
                          <p className="mt-2 text-gray-700">“{review.comment}”</p>
                        </div>
                        <div className="flex gap-2">
                          <Button disabled={moderateReviewMutation.isPending} onClick={() => moderateReviewMutation.mutate({ id: review.id, status: 'approved', verified: true })} className="bg-green-600 hover:bg-green-700">Verificar e aprovar</Button>
                          <Button disabled={moderateReviewMutation.isPending} onClick={() => moderateReviewMutation.mutate({ id: review.id, status: 'approved' })} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">Aprovar</Button>
                          <Button disabled={moderateReviewMutation.isPending} onClick={() => moderateReviewMutation.mutate({ id: review.id, status: 'rejected' })} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">Rejeitar</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                  {pendingReviewPage && pendingReviewPage.totalPages > 1 ? (
                    <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-gray-600">Página {pendingReviewPage.page} de {pendingReviewPage.totalPages} · {pendingReviewPage.total} avaliação(ões)</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled={reviewPage <= 1} onClick={() => setReviewPage((page) => Math.max(1, page - 1))}>Anterior</Button>
                        <Button size="sm" variant="outline" disabled={reviewPage >= pendingReviewPage.totalPages} onClick={() => setReviewPage((page) => page + 1)}>Próxima</Button>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="py-6 text-center text-gray-500">Nenhuma avaliação pendente.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
