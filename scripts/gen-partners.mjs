// Génère les vignettes logos des partenaires (SVG) et leurs fichiers de contenu (markdown)
// à partir d'une liste unique — ainsi noms de fichiers et chemins restent synchronisés.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const partners = [
  'Ville de Chazelles-sur-Lyon',
  'Ville de Longué-Jumelles',
  "Ville d'Aurillac",
  'Camus la Grande Marque',
  'Herbalife',
  'PHV Carrière',
  'BML',
  'Le 18.10',
  'Best Western',
  'Le Sou des Écoles',
  'Comité des fêtes de Marcenod',
  'Pionsat en fête',
  'Théâtre Le Grenier',
  'Les Tréteaux du Grand Val',
  'Théâtre Sous le Caillou',
  'Espace culturel O Lac',
  'MJC Les Passerelles',
  'MJC Jean Cocteau',
];

const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const svgDir = path.join(root, 'public/images/partenaires');
const mdDir = path.join(root, 'src/content/partenaires');
mkdirSync(svgDir, { recursive: true });
mkdirSync(mdDir, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

for (const name of partners) {
  const id = slug(name);
  const fontSize = name.length > 22 ? 24 : name.length > 14 ? 27 : 31;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160" viewBox="0 0 320 160" role="img" aria-label="${esc(name)}">
  <rect width="320" height="160" rx="14" fill="#faf5ec"/>
  <rect x="1.5" y="1.5" width="317" height="157" rx="12.5" fill="none" stroke="#e4d5ba" stroke-width="2"/>
  <circle cx="160" cy="46" r="3.5" fill="#c9a24b"/>
  <text x="160" y="100" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-weight="600" font-size="${fontSize}" fill="#33272e">${esc(name)}</text>
  <text x="160" y="132" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="10.5" letter-spacing="4" fill="#9a8a94">ML’ART · PARTENAIRE</text>
</svg>
`;
  writeFileSync(path.join(svgDir, `${id}.svg`), svg);

  const md = `---
name: "${name}"
logo: "/images/partenaires/${id}.svg"
---

`;
  writeFileSync(path.join(mdDir, `${id}.md`), md);
}

console.log(`✅ ${partners.length} partenaires générés`);
console.log(partners.map((n) => `${slug(n)} — ${n}`).join('\n'));
