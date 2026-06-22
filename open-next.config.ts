import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Configuração do adapter OpenNext para Cloudflare Workers.
// Cache pode ser adicionado depois (R2/KV): https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig();
