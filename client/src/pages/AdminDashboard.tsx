import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

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
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const { data: budgets, isLoading, refetch } = trpc.admin.budgets.list.useQuery({
    status: selectedStatus || undefined,
    limit: 50,
  });

  const { data: selectedBudgetData } = trpc.admin.budgets.getById.useQuery(
    { id: selectedBudget! },
    { enabled: !!selectedBudget }
  );

  const updateStatusMutation = trpc.admin.budgets.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedBudget(null);
      setNewStatus("");
      setNotes("");
    },
  });

  const { data: pendingReviews, refetch: refetchReviews } = trpc.reviews.listPending.useQuery();
  const moderateReviewMutation = trpc.reviews.moderate.useMutation({
    onSuccess: () => refetchReviews(),
  });

  const handleUpdateStatus = () => {
    if (!selectedBudget || !newStatus) return;
    updateStatusMutation.mutate({
      id: selectedBudget,
      status: newStatus as any,
      notes: notes || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerenciar solicitações de orçamento e leads</p>
        </div>

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

        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações pendentes</CardTitle>
              <CardDescription>Somente avaliações aprovadas são exibidas no site.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingReviews?.length ? (
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
                          <Button disabled={moderateReviewMutation.isPending} onClick={() => moderateReviewMutation.mutate({ id: review.id, status: 'approved' })} className="bg-green-600 hover:bg-green-700">Aprovar</Button>
                          <Button disabled={moderateReviewMutation.isPending} onClick={() => moderateReviewMutation.mutate({ id: review.id, status: 'rejected' })} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">Rejeitar</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
