globalThis.process ??= {}; globalThis.process.env ??= {};
const FALLBACK_ALLOWED_EMAILS = "parentcoachplaybook@gmail.com";
function parseAllowList(raw) {
  return new Set(
    raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
  );
}
function b64urlDecode(input) {
  const pad = input.length % 4 === 2 ? "==" : input.length % 4 === 3 ? "=" : "";
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return atob(b64);
}
function getAdminEmailFromCookie(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(b64urlDecode(parts[1]));
    if (payload.exp && payload.exp * 1e3 < Date.now()) return null;
    if (typeof payload.email === "string" && payload.email.includes("@")) {
      return payload.email.toLowerCase();
    }
    return null;
  } catch {
    return null;
  }
}
function getAdminEmailFromRequest(request) {
  const headerEmail = request.headers.get("Cf-Access-Authenticated-User-Email");
  if (headerEmail) return headerEmail.toLowerCase();
  return getAdminEmailFromCookie(request);
}
function requireAdmin(request, env) {
  const email = getAdminEmailFromRequest(request);
  if (!email) {
    return new Response(JSON.stringify({ ok: false, error: "unauthenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  const allowList = parseAllowList(env?.ADMIN_EMAILS ?? FALLBACK_ALLOWED_EMAILS);
  if (!allowList.has(email)) {
    return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  return { email };
}
function requireSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    const referer = request.headers.get("referer");
    if (!referer) {
      return new Response(JSON.stringify({ ok: false, error: "missing origin" }), {
        status: 403,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }
    try {
      const refUrl = new URL(referer);
      const reqUrl = new URL(request.url);
      if (refUrl.host !== reqUrl.host) {
        return new Response(JSON.stringify({ ok: false, error: "cross-origin referer" }), {
          status: 403,
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }
      return null;
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "bad referer" }), {
        status: 403,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }
  }
  try {
    const originHost = new URL(origin).host;
    const requestHost = new URL(request.url).host;
    if (originHost !== requestHost) {
      return new Response(JSON.stringify({ ok: false, error: "cross-origin" }), {
        status: 403,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }
    return null;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "bad origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}

export { requireSameOrigin as a, getAdminEmailFromRequest as g, requireAdmin as r };
