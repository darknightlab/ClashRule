import { config_string } from "./config";
// yaml
import { parse, stringify } from "yaml";
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;
    //
    // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
    // MY_SERVICE: Fetcher;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        let url = new URL(request.url);
        let searchParams = url.searchParams;
        let mode = searchParams.get("mode");
        let subscription_url = searchParams.get("subscription");

        if (mode === "subconverter") {
            let response = await fetch(subscription_url!, {
                headers: {
                    "User-Agent": "clash-verge",
                },
            });

            let text = await response.text();
            let subscription_config = parse(text);
            let proxies = subscription_config["proxies"];

            let headers = new Headers();
            headers.set("profile-update-interval", response.headers.get("profile-update-interval")!);
            headers.set("subscription-userinfo", response.headers.get("subscription-userinfo")!);

            return new Response(stringify({ proxies: proxies }), {
                headers: headers,
            });
        }

        let config = parse(config_string);
        if (subscription_url) {
            config["proxy-providers"]["All"]["url"] = url.origin + "/?mode=subconverter&subscription=" + encodeURIComponent(subscription_url + "&flag=clash");
        }

        return new Response(stringify(config));
    },
};
