import { FormEvent, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send, Star } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const initialForm = {
  name: '',
  city: '',
  rating: '5',
  projectType: '',
  comment: '',
};

type ReviewFeedback = {
  kind: 'success' | 'error';
  message: string;
};

export default function ClientReviews() {
  const utils = trpc.useUtils();
  const { data: reviews, isLoading } = trpc.reviews.listApproved.useQuery();
  const submitReview = trpc.reviews.submit.useMutation({
    onSuccess: async () => {
      setForm(initialForm);
      setFeedback({
        kind: 'success',
        message: 'Obrigado por compartilhar sua experiência. Sua avaliação foi recebida com carinho e será publicada após a validação da nossa equipe.',
      });
      await utils.reviews.listApproved.invalidate();
    },
    onError: () => setFeedback({
      kind: 'error',
      message: 'Não foi possível registrar sua avaliação. Nenhum depoimento foi salvo; tente novamente em instantes.',
    }),
  });
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState<ReviewFeedback | null>(null);

  const averageRating = useMemo(() => {
    if (!reviews?.length) return 0;
    return reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  }, [reviews]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    submitReview.mutate({
      name: form.name,
      city: form.city,
      rating: Number(form.rating),
      projectType: form.projectType || undefined,
      comment: form.comment,
    });
  };

  return (
    <section id="avaliacoes" className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Avaliações de clientes</h2>
          <p className="text-lg text-gray-600">
            Compartilhe sua experiência com a Bessa Energia. As avaliações são exibidas somente após validação da equipe.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-orange-500" /></div>
            ) : reviews?.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-xl border border-gray-200 p-5">
                    <div className="mb-3 flex items-center gap-1" aria-label={`${review.rating} de 5 estrelas`}>
                      {Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <blockquote className="mb-5 text-gray-700">“{review.comment}”</blockquote>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.city}{review.projectType ? ` · ${review.projectType}` : ''}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
                <p className="font-semibold text-gray-800">Ainda não há avaliações publicadas.</p>
                <p className="mt-2 text-sm text-gray-600">Se você já é cliente, envie sua experiência pelo formulário ao lado.</p>
              </div>
            )}

            {reviews?.length ? (
              <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
                Média das avaliações publicadas: <strong className="text-gray-900">{averageRating.toFixed(1)} de 5</strong> · {reviews.length} avaliação(ões)
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl bg-gray-900 p-8 text-white shadow-xl" aria-label="Enviar avaliação">
            <h3 className="text-2xl font-bold">Conte sua experiência</h3>
            <p className="mt-2 text-sm text-gray-300">Sua avaliação ficará pendente até ser revisada pela equipe.</p>
            <div className="mt-6 space-y-4">
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nome" aria-label="Nome" className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-400 focus:outline-none" />
              <input required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Cidade e estado" aria-label="Cidade e estado" className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-400 focus:outline-none" />
              <div className="grid gap-4 sm:grid-cols-2">
                <select value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} aria-label="Nota" className="rounded-lg border border-white/20 bg-gray-800 px-4 py-3 text-white focus:border-orange-400 focus:outline-none">
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} estrela{rating === 1 ? '' : 's'}</option>)}
                </select>
                <input value={form.projectType} onChange={(event) => setForm({ ...form, projectType: event.target.value })} placeholder="Tipo de projeto (opcional)" aria-label="Tipo de projeto" className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-400 focus:outline-none" />
              </div>
              <textarea required minLength={10} maxLength={1000} value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} placeholder="Escreva sua avaliação" aria-label="Avaliação" rows={5} className="w-full resize-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-400 focus:outline-none" />
              <button type="submit" disabled={submitReview.isPending} className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60" aria-busy={submitReview.isPending}>
                {submitReview.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                {submitReview.isPending ? 'Enviando sua experiência...' : 'Enviar avaliação'}
              </button>
              {feedback ? (
                <div role="status" aria-live="polite" className={`animate-in fade-in slide-in-from-bottom-1 rounded-lg border p-4 text-sm duration-300 ${feedback.kind === 'success' ? 'border-emerald-300/50 bg-emerald-500/15 text-emerald-50' : 'border-red-300/50 bg-red-500/15 text-red-100'}`}>
                  <div className="flex gap-3">
                    {feedback.kind === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" /> : <AlertCircle className="h-5 w-5 shrink-0 text-red-200" />}
                    <p className="leading-relaxed">{feedback.message}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
