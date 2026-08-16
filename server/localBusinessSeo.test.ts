import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const indexSource = readFileSync(resolve(import.meta.dirname, '../client/index.html'), 'utf8');

function getLocalBusinessSchema(): Record<string, unknown> {
  const match = indexSource.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  if (!match?.[1]) throw new Error('Marcação JSON-LD LocalBusiness não encontrada');
  return JSON.parse(match[1]) as Record<string, unknown>;
}

describe('SEO LocalBusiness', () => {
  it('declares a valid LocalBusiness JSON-LD block', () => {
    const schema = getLocalBusinessSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toContain('LocalBusiness');
    expect(schema['@type']).toContain('ProfessionalService');
    expect(schema.name).toBe('Bessa Energia Solar - Usinas solares');
    expect(schema.url).toBe('https://bessaenergia.com.br/');
  });

  it('uses the confirmed contact and address information', () => {
    const schema = getLocalBusinessSchema();
    expect(schema.telephone).toBe('+5531991029003');
    expect(schema.email).toBe('contato@bessaenergia.com.br');
    expect(schema.address).toMatchObject({
      streetAddress: 'AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500, PARTE 1557 SAVASSI',
      addressLocality: 'Belo Horizonte',
      addressRegion: 'MG',
      addressCountry: 'BR',
    });
  });

  it('includes the confirmed map, coordinates and coverage regions', () => {
    const schema = getLocalBusinessSchema();
    expect(schema.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: -19.9353313,
      longitude: -43.9297169,
    });
    expect(schema.hasMap).toContain('Bessa+Energia+Solar+-+Usinas+solares');
    expect(schema.areaServed).toEqual(['Grande BH', 'Vale do Aço', 'Triângulo Mineiro', 'Sul de Minas']);
  });
});
