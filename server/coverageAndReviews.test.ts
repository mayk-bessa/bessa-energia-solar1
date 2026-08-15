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
    expect(mapSource).toContain('Mapa alternativo de cobertura em Minas Gerais');
    expect(mapSource).toContain('https://www.google.com/maps?q=Minas+Gerais%2C+Brazil&output=embed');
    expect(mapSource).toContain('Abrir no Google Maps');
  });

  it('does not hard-code customer testimonials or ratings', () => {
    expect(reviewsSource).not.toContain('Carlos Silva');
    expect(reviewsSource).not.toContain('Fernanda Costa');
    expect(reviewsSource).not.toContain('4.9★');
    expect(reviewsSource).toContain('trpc.reviews.listApproved.useQuery()');
    expect(reviewsSource).toContain('trpc.reviews.submit.useMutation');
    expect(reviewsSource).toContain('será exibida após validação');
  });

  it('defines pending moderation and approved-only public review procedures', () => {
    expect(schemaSource).toContain('export const reviews = mysqlTable');
    expect(schemaSource).toContain('status: mysqlEnum("status", ["pending", "approved", "rejected"])');
    expect(routerSource).toContain('listApproved: publicProcedure');
    expect(routerSource).toContain('listPending: protectedProcedure');
    expect(routerSource).toContain('moderate: protectedProcedure');
    expect(routerSource).toContain('status: "pending"');
    expect(adminSource).toContain('useEffect(() => {');
    expect(adminSource).toContain('if (user && user.role !== "admin")');
  });
});
