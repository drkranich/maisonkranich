#!/usr/bin/env node
/**
 * Smoke test sem dependências — valida a integridade estrutural do projeto.
 * Uso: node scripts/smoke-test.mjs
 * Sai com código 1 se encontrar problemas (útil em CI / pré-deploy).
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
let errors = 0;
const fail = (msg) => { console.error("  ✗", msg); errors++; };
const ok = (msg) => console.log("  ✓", msg);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(p);
  }
  return out;
}

const files = walk(srcDir);
const exts = [".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"];

// 1) imports de alias "@/..." resolvem para um arquivo real
console.log("Imports @/* resolvem:");
let brokenImports = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const re = /from\s+["']@\/([^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) {
    const base = join(srcDir, m[1]);
    if (!exts.some((e) => existsSync(base + e)) && !existsSync(base)) {
      fail(`${f.replace(root + "/", "")} → @/${m[1]}`);
      brokenImports++;
    }
  }
}
if (brokenImports === 0) ok(`${files.length} arquivos, nenhum import quebrado`);

// 2) arquivos críticos presentes
console.log("Arquivos críticos:");
const critical = [
  "src/lib/supabase/server.ts",
  "src/lib/supabase/client.ts",
  "src/lib/auth.ts",
  "src/lib/cart/CartContext.tsx",
  "src/lib/admin/schemas.ts",
  "src/components/chat/ChatThread.tsx",
  "src/components/account/AddressManager.tsx",
  "src/lib/account/lgpd.ts",
];
for (const c of critical) existsSync(join(root, c)) ? ok(c) : fail(`ausente: ${c}`);

// 3) lista de países: códigos únicos e formato ISO-2
console.log("Lista de países:");
try {
  const txt = readFileSync(join(srcDir, "lib/countries.ts"), "utf8");
  const codes = [...txt.matchAll(/code:\s*"([A-Z]{2})"/g)].map((m) => m[1]);
  const dups = codes.filter((c, i) => codes.indexOf(c) !== i);
  if (codes.length < 100) fail(`poucos países: ${codes.length}`);
  else if (dups.length) fail(`códigos duplicados: ${[...new Set(dups)].join(", ")}`);
  else ok(`${codes.length} países, códigos únicos`);
} catch (e) {
  fail("não foi possível ler countries.ts");
}

// 4) nenhuma chave secreta hardcoded (service role / stripe secret)
console.log("Sem segredos hardcoded:");
let leaks = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  if (/sk_live_|sk_test_|service_role.*ey[A-Za-z0-9]/.test(src)) { fail(`possível segredo em ${f.replace(root + "/", "")}`); leaks++; }
}
if (leaks === 0) ok("nenhum segredo aparente no código");

console.log("");
if (errors) {
  console.error(`✘ Smoke test falhou: ${errors} problema(s).`);
  process.exit(1);
} else {
  console.log("✔ Smoke test passou.");
}
