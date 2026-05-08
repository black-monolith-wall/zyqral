const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: JSON_HEADERS,
  });
}

function parseJsonSafely(value, fallback = null) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function loadInstructionManifest(env) {
  const manifestUrl = env.TASK_MANIFEST_URL;
  if (!manifestUrl) {
    return {
      ok: false,
      error: "TASK_MANIFEST_URL is not configured.",
      status: 500,
    };
  }

  const response = await fetch(manifestUrl, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    return {
      ok: false,
      error: `Failed to load manifest: HTTP ${response.status}`,
      status: 502,
    };
  }

  const manifest = await response.json();
  return { ok: true, manifest };
}

function chooseProvider(providers) {
  const healthy = providers.filter((provider) => !provider.rate_limited);
  const ranked = (healthy.length > 0 ? healthy : providers).sort((a, b) => {
    return (b.priority ?? 0) - (a.priority ?? 0);
  });
  return ranked[0] ?? null;
}

async function probeProvider(provider) {
  const startedAt = Date.now();
  const probeResponse = await fetch(provider.probe_url, {
    method: "GET",
    headers: provider.headers ?? {},
  });
  const elapsedMs = Date.now() - startedAt;

  const rateLimited = probeResponse.status === 429;
  return {
    id: provider.id,
    label: provider.label,
    priority: provider.priority ?? 0,
    probe_status: probeResponse.status,
    probe_ms: elapsedMs,
    rate_limited: rateLimited,
    retry_after: probeResponse.headers.get("retry-after"),
    remaining_hint:
      probeResponse.headers.get("x-ratelimit-remaining") ||
      probeResponse.headers.get("ratelimit-remaining"),
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return jsonResponse({
        service: "zyqral-control-worker",
        status: "ok",
        endpoints: ["/health", "/manifest", "/dispatch"],
      });
    }

    if (url.pathname === "/health") {
      return jsonResponse({ service: "zyqral-control-worker", status: "healthy" });
    }

    if (url.pathname === "/manifest") {
      const manifestResult = await loadInstructionManifest(env);
      if (!manifestResult.ok) {
        return jsonResponse({ status: "error", error: manifestResult.error }, manifestResult.status);
      }

      return jsonResponse({ status: "ok", manifest: manifestResult.manifest });
    }

    if (url.pathname === "/dispatch") {
      const manifestResult = await loadInstructionManifest(env);
      if (!manifestResult.ok) {
        return jsonResponse({ status: "error", error: manifestResult.error }, manifestResult.status);
      }

      const manifest = manifestResult.manifest;
      const providerDefinitions = manifest.providers ?? [];

      if (providerDefinitions.length === 0) {
        return jsonResponse({ status: "error", error: "Manifest has no providers." }, 400);
      }

      const secretsByProvider = parseJsonSafely(env.PROVIDER_SECRETS_JSON, {});

      const providerStatuses = [];
      for (const provider of providerDefinitions) {
        const token = secretsByProvider?.[provider.id];
        const headers = token
          ? { ...(provider.headers ?? {}), Authorization: `Bearer ${token}` }
          : provider.headers ?? {};

        providerStatuses.push(
          await probeProvider({
            ...provider,
            headers,
          })
        );
      }

      const selected = chooseProvider(providerStatuses);
      if (!selected) {
        return jsonResponse({ status: "error", error: "No provider candidates available." }, 503);
      }

      const task = manifest.task ?? {};
      return jsonResponse({
        status: "ok",
        selected_provider: selected,
        providers: providerStatuses,
        delegation_packet: {
          objective: task.objective,
          constraints: task.constraints ?? [],
          acceptance_tests: task.acceptance_tests ?? [],
          deliverables: task.deliverables ?? [],
          instructions_url: env.TASK_MANIFEST_URL,
          generated_at: new Date().toISOString(),
        },
      });
    }

    return jsonResponse({ status: "error", error: "Route not found." }, 404);
  },
};
