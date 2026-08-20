import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const homeSource = readFileSync(resolve(root, 'client/src/pages/Home.tsx'), 'utf8');
const reviewsSource = readFileSync(resolve(root, 'client/src/components/ClientReviews.tsx'), 'utf8');
const routerSource = readFileSync(resolve(root, 'server/routers.ts'), 'utf8');
const schemaSource = readFileSync(resolve(root, 'drizzle/schema.ts'), 'utf8');
const mapSource = readFileSync(resolve(root, 'client/src/components/Map.tsx'), 'utf8');
const adminSource = readFileSync(resolve(root, 'client/src/pages/AdminDashboard.tsx'), 'utf8');

describe('Coverage map and legitimate reviews', () => {
  it('renders the CEMIG coverage map with the four requested regions', () => {
    expect(homeSource).toContain("import { MapView } from '@/components/Map';");
    for (const region of ['Grande BH', 'Vale do Aço', 'Triângulo Mineiro', 'Sul de Minas']) {
      expect(homeSource).toContain(region);
    }
    expect(homeSource).toContain('initialZoom={7}');
    expect(homeSource).toContain('AdvancedMarkerElement');
    expect(mapSource).toContain('Google Maps API indisponível após o carregamento');
    expect(mapSource).toContain('aria-label="Mapa de cobertura da Bessa Energia"');
    expect(mapSource).toContain('Mapa georreferenciado das regiões atendidas em Minas Gerais');
    expect(mapSource).toContain('MapContainer');
    expect(mapSource).toContain('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    expect(mapSource).toContain('Abrir no Google Maps');
    expect(mapSource).toContain('FALLBACK_REGIONS');
    for (const region of ['Grande BH', 'Vale do Aço', 'Triângulo Mineiro', 'Sul de Minas']) {
      expect(mapSource).toContain(`name: "${region}"`);
      expect(mapSource).toContain(region);
    }
    expect(mapSource).toContain('position: { lat: -19.9191, lng: -43.9386 }');
    expect(mapSource).toContain('position: { lat: -19.4778, lng: -42.5278 }');
    expect(mapSource).toContain('position: { lat: -18.9186, lng: -48.2772 }');
    expect(mapSource).toContain('position: { lat: -21.5518, lng: -45.4303 }');
    expect(mapSource).toContain('fallbackMarkerIcon');
    expect(mapSource).toContain('Tooltip');
    expect(mapSource).toContain('force-map-fallback');
    expect(mapSource).toContain('Região atendida');
  });

  it('does not hard-code customer testimonials or ratings', () => {
    expect(reviewsSource).not.toContain('Carlos Silva');
    expect(reviewsSource).not.toContain('Fernanda Costa');
    expect(reviewsSource).not.toContain('4.9★');
    expect(reviewsSource).toContain('trpc.reviews.listApproved.useQuery()');
    expect(reviewsSource).toContain('trpc.reviews.submit.useMutation');
    expect(reviewsSource).toContain('Sua avaliação ficará pendente até ser revisada pela equipe.');
    expect(reviewsSource).toContain('Nenhum depoimento foi salvo');
    expect(reviewsSource).toContain('Enviando sua experiência...');
    expect(reviewsSource).toContain('CheckCircle2');
  });

  it('defines pending moderation and approved-only public review procedures', () => {
    expect(schemaSource).toContain('export const reviews = mysqlTable');
    expect(schemaSource).toContain('status: mysqlEnum("status", ["pending", "approved", "rejected"])');
    expect(schemaSource).toContain('verifiedAt: timestamp("verifiedAt")');
    expect(schemaSource).toContain('verifiedBy: int("verifiedBy")');
    expect(routerSource).toContain('listApproved: publicProcedure');
    expect(routerSource).toContain('listPending: protectedProcedure');
    expect(routerSource).toContain('moderate: protectedProcedure');
    expect(routerSource).toContain('status: "pending"');
    expect(routerSource).toContain('createReview({ ...input, status: "pending" })');
    expect(routerSource).toContain('sendReviewModerationNotification(input)');
    expect(routerSource).toContain('highest_rating');
    expect(routerSource).toContain('verified: z.boolean().optional()');
    expect(adminSource).toContain('reviewSearch');
    expect(adminSource).toContain('reviewSort');
    expect(adminSource).toContain('Buscar por cliente, cidade, projeto ou depoimento');
    expect(adminSource).toContain('Verificar e aprovar');
    expect(adminSource).toContain('Página {pendingReviewPage.page} de {pendingReviewPage.totalPages}');
    expect(reviewsSource).toContain('Cliente verificado');
    expect(reviewsSource).toContain('review.verifiedAt');
    expect(adminSource).toContain('useEffect(() => {');
    expect(adminSource).toContain('if (user && user.role !== "admin")');
  });
});
