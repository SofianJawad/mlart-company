// Vérifie la cohérence entre la config Decap (config.yml), les fichiers de contenu
// et le schéma Astro (content.config.ts). Signale tout champ incohérent.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = '/Users/sofianjawad/Documents/MLART SITE';
const cfg = yaml.load(readFileSync(path.join(ROOT, 'public/admin/config.yml'), 'utf8'));

const parseFrontmatter = (txt) => {
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  return yaml.load(m[1]) || {};
};

let errors = 0;
const ok = (msg) => console.log('  ✅ ' + msg);
const warn = (msg) => { errors++; console.log('  ❌ ' + msg); };

for (const col of cfg.collections) {
  console.log(`\n📁 ${col.label} (${col.name})`);
  const fields = new Map();
  for (const f of col.fields || []) {
    if (f.name && f.name !== 'body') fields.set(f.name, f);
  }

  // collections "folder" : parcourir les fichiers
  if (col.folder) {
    const dir = path.join(ROOT, col.folder);
    const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const fm = parseFrontmatter(readFileSync(path.join(dir, file), 'utf8'));
      const missing = [...fields.keys()].filter((k) => !(k in fm));
      const extra = Object.keys(fm).filter((k) => !fields.has(k) && k !== 'body');
      const required = [...fields.keys()].filter((k) => {
        const f = fields.get(k);
        return f && f.required !== false && !(k in fm);
      });
      if (required.length) warn(`${file} : champs REQUIS manquants → ${required.join(', ')}`);
      else ok(`${file} : tous les champs requis présents`);
      if (missing.length) console.log(`      · champs optionnels absents (ok) : ${missing.join(', ')}`);
      if (extra.length) warn(`${file} : champs dans le fichier MAIS PAS dans le CMS → ${extra.join(', ')} (risque d'être ignorés)`);
    }
  }

  // collections "files"
  if (col.files) {
    for (const f of col.files) {
      const p = path.join(ROOT, f.file);
      const fm = parseFrontmatter(readFileSync(p, 'utf8'));
      const names = f.fields.map((x) => x.name);
      const missing = names.filter((k) => !(k in fm));
      const extra = Object.keys(fm).filter((k) => !names.includes(k));
      if (missing.length) warn(`${f.file} : manquants → ${missing.join(', ')}`);
      else ok(`${f.file} : ok`);
      if (extra.length) warn(`${f.file} : champs non déclarés → ${extra.join(', ')}`);
    }
  }
}

// Schéma Astro : vérifier que chaque champ requis par le schéma est produit par le CMS
console.log('\n🔍 Croisement avec le schéma Astro (content.config.ts)');
const schemaText = readFileSync(path.join(ROOT, 'src/content.config.ts'), 'utf8');
const schemaCols = { spectacles: 'spectacles', prestations: 'prestations', ateliers: 'ateliers', partenaires: 'partenaires', settings: 'settings' };
for (const [colName, schemaName] of Object.entries(schemaCols)) {
  const col = cfg.collections.find((c) => c.name === colName);
  if (!col) { warn(`collection CMS absente pour le schéma "${schemaName}"`); continue; }
  const block = schemaText.split(`const ${schemaName} =`)[1]?.split('});')[0] || '';
  const schemaKeys = [...block.matchAll(/^\s{4}(\w+):\s*z\./gm)].map((m) => m[1]);
  const cmsKeys = new Set();
  for (const f of col.fields || []) if (f.name && f.name !== 'body') cmsKeys.add(f.name);
  for (const f of col.files || []) for (const x of f.fields) cmsKeys.add(x.name);
  for (const k of schemaKeys) {
    if (cmsKeys.has(k)) ok(`${colName}.${k} : CMS ↔ schéma cohérent`);
    else {
      // champs avec .default() ou .optional() ne sont pas bloquants
      const hasDefaultOrOptional = new RegExp(`^\\s{4}${k}:\\s*z\\.[^;]*(\\.default\\(|\\.optional\\(\\))`, 'm').test(block);
      if (hasDefaultOrOptional) console.log(`      · ${colName}.${k} : facultatif côté schéma (ok si absent du CMS)`);
      else warn(`${colName}.${k} : requis par le schéma mais PAS de champ dans le CMS`);
    }
  }
  // champs CMS inconnus du schéma
  for (const k of cmsKeys) {
    if (!schemaKeys.includes(k)) warn(`${colName}.${k} : champ CMS sans équivalent dans le schéma`);
  }
}

console.log(`\n${errors === 0 ? '✅ Aucune incohérence bloquante détectée' : '⚠️ ' + errors + ' problème(s) à corriger'}`);
