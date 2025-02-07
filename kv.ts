import { type Manifest, start } from "https://deno.land/x/fresh@1.6.8/server.ts";
import { kvInsightsPlugin } from "https://deno.land/x/deno_kv_insights/mod.ts";

function getKvInstance() {
  return Deno.openKv(Deno.env.get("DENO_KV_URL"));
}

const manifest = {
  routes: {},
  islands: {},
  baseUrl: import.meta.url,
} satisfies Manifest;

const kv = await getKvInstance();

await start(manifest, {
  plugins: [
    kvInsightsPlugin({ kv }),
  ],
});
