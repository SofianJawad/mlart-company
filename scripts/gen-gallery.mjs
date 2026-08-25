// Génère des visuels de galerie temporaires (3 par spectacle) que la compagnie
// remplacera par de vraies photos via le panneau d'administration.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public/images/spectacles');
mkdirSync(dir, { recursive: true });

const shows = {
  reveries: { c1: '#26275a', c2: '#4e4179', c3: '#a5637c', c4: '#e39a77' },
  cabaret: { c1: '#3c0c1c', c2: '#5c1226', c3: '#8a3044', c4: '#e8cd8b' },
  ascenseur: { c1: '#26262e', c2: '#33333e', c3: '#d9cfc0', c4: '#c9a24b' },
};

const compositions = [
  // 1 — rubans diagonaux
  (p, w, h) => `
    <rect width="${w}" height="${h}" fill="${p.c1}"/>
    <path d="M-40 ${h * 0.75} C ${w * 0.3} ${h * 0.35}, ${w * 0.6} ${h * 0.85}, ${w + 40} ${h * 0.4}" fill="none" stroke="${p.c4}" stroke-width="${w / 60}" opacity="0.55"/>
    <path d="M-40 ${h * 0.9} C ${w * 0.35} ${h * 0.55}, ${w * 0.65} ${h}, ${w + 40} ${h * 0.6}" fill="none" stroke="${p.c3}" stroke-width="${w / 90}" opacity="0.6"/>
    <circle cx="${w * 0.22}" cy="${h * 0.28}" r="${w / 22}" fill="${p.c4}" opacity="0.85"/>
    <circle cx="${w * 0.78}" cy="${h * 0.2}" r="${w / 30}" fill="${p.c3}"/>`,
  // 2 — arcs concentriques
  (p, w, h) => `
    <rect width="${w}" height="${h}" fill="${p.c2}"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.3}" fill="none" stroke="${p.c4}" stroke-width="${w / 70}"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.19}" fill="none" stroke="${p.c4}" stroke-width="${w / 110}" opacity="0.7"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.09}" fill="${p.c4}" opacity="0.9"/>
    <circle cx="${w * 0.25}" cy="${h * 0.3}" r="${w / 26}" fill="${p.c3}" opacity="0.6"/>
    <circle cx="${w * 0.75}" cy="${h * 0.68}" r="${w / 26}" fill="${p.c3}" opacity="0.6"/>`,
  // 3 — poussières d'étoiles
  (p, w, h) => `
    <rect width="${w}" height="${h}" fill="${p.c1}"/>
    <g fill="${p.c4}">
      <circle cx="${w * 0.18}" cy="${h * 0.2}" r="${w / 60}"/>
      <circle cx="${w * 0.42}" cy="${h * 0.32}" r="${w / 80}"/>
      <circle cx="${w * 0.64}" cy="${h * 0.18}" r="${w / 70}"/>
      <circle cx="${w * 0.85}" cy="${h * 0.3}" r="${w / 60}"/>
      <circle cx="${w * 0.3}" cy="${h * 0.6}" r="${w / 70}"/>
      <circle cx="${w * 0.55}" cy="${h * 0.5}" r="${w / 55}"/>
      <circle cx="${w * 0.8}" cy="${h * 0.62}" r="${w / 75}"/>
      <circle cx="${w * 0.42}" cy="${h * 0.78}" r="${w / 65}"/>
      <circle cx="${w * 0.68}" cy="${h * 0.85}" r="${w / 70}"/>
    </g>
    <path d="M${w * 0.55} ${h * 0.5}l12 24 24 12-24 12-12 24-12-24-24-12 24-12z" fill="${p.c3}" opacity="0.7"/>`,
];

for (const [show, p] of Object.entries(shows)) {
  for (let i = 1; i <= 3; i++) {
    const w = 1200;
    const h = 900;
    const body = compositions[i - 1](p, w, h);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Photo de galerie — ${show} ${i}">${body}\n</svg>\n`;
    writeFileSync(path.join(dir, `${show}-${i}.svg`), svg);
  }
}

console.log('✅ 9 visuels de galerie générés');
