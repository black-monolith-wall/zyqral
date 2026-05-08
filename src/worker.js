export default {
  async fetch(request, env, ctx) {
    return new Response(
      JSON.stringify({
        service: "zyqral",
        status: "ok",
        message: "Baseline Cloudflare Worker is live.",
      }),
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      }
    );
  },
};
