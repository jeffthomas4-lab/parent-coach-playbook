globalThis.process ??= {}; globalThis.process.env ??= {};
const DEFAULT_TIMEOUT_MS = 6e3;
async function checkUrlHealth(rawUrl, timeoutMs = DEFAULT_TIMEOUT_MS) {
  let url;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { status: "dead", statusCode: null, finalUrl: null };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { status: "dead", statusCode: null, finalUrl: null };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let res = await fetch(url.toString(), {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "parentcoachdesk.com link checker" }
    });
    if (res.status >= 400) {
      res = await fetch(url.toString(), {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "parentcoachdesk.com link checker" }
      });
    }
    clearTimeout(timer);
    const code = res.status;
    const finalUrl = res.url || url.toString();
    if (code >= 200 && code < 300) {
      return { status: "live", statusCode: code, finalUrl };
    }
    if (code >= 300 && code < 400) {
      return { status: "redirect", statusCode: code, finalUrl };
    }
    return { status: "dead", statusCode: code, finalUrl };
  } catch (err) {
    clearTimeout(timer);
    const isAbort = err instanceof Error && err.name === "AbortError";
    return {
      status: isAbort ? "timeout" : "dead",
      statusCode: null,
      finalUrl: null
    };
  }
}

export { checkUrlHealth as c };
