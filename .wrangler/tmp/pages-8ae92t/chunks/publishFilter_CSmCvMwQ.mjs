globalThis.process ??= {}; globalThis.process.env ??= {};
function isLive(data, now = /* @__PURE__ */ new Date()) {
  if (data.draft) return false;
  return data.publishedAt.getTime() <= now.getTime();
}
function freshnessDate(data, now = /* @__PURE__ */ new Date()) {
  const reviewed = data.editorial?.jeffReviewedAt ?? data.editorial?.claudeReviewedAt;
  if (!reviewed) return data.publishedAt;
  const r = reviewed instanceof Date ? reviewed : new Date(reviewed);
  if (r.getTime() > now.getTime()) return data.publishedAt;
  return r.getTime() > data.publishedAt.getTime() ? r : data.publishedAt;
}
function wasUpdated(data, now = /* @__PURE__ */ new Date()) {
  const fresh = freshnessDate(data, now);
  return fresh.getTime() !== data.publishedAt.getTime();
}

export { freshnessDate as f, isLive as i, wasUpdated as w };
