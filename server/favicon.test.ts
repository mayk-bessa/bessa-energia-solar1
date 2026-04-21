import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Favicon Tests', () => {
  it('should have favicon.ico in public directory', () => {
    const faviconPath = path.resolve(__dirname, '../client/public/favicon.ico');
    expect(fs.existsSync(faviconPath)).toBe(true);
  });

  it('favicon.ico should be a valid ICO file', () => {
    const faviconPath = path.resolve(__dirname, '../client/public/favicon.ico');
    const stats = fs.statSync(faviconPath);
    expect(stats.size).toBeGreaterThan(0);
    
    // ICO files start with specific magic bytes
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(faviconPath, 'r');
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    
    // ICO files start with 0x00 0x00 0x01 0x00 or similar
    expect(buffer[0]).toBe(0x00);
    expect(buffer[1]).toBe(0x00);
  });

  it('favicon.ico should be at least 100KB (multi-resolution)', () => {
    const faviconPath = path.resolve(__dirname, '../client/public/favicon.ico');
    const stats = fs.statSync(faviconPath);
    // Multi-resolution ICO should be at least 100KB
    expect(stats.size).toBeGreaterThan(100000);
  });

  it('should have Logotransparente_bessaenergia_cores.png source', () => {
    const logoPath = path.resolve(__dirname, '../client/public/Logotransparente_bessaenergia_cores.png');
    expect(fs.existsSync(logoPath)).toBe(true);
  });
});
