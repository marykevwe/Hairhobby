// MongoDB documents come back with `_id`; the UI is written against `id`.
// These helpers map _id -> id (recursively for nested services) without
// touching any other fields, so existing components keep working unchanged.
export function normalizePro(pro) {
  if (!pro) return pro;
  return {
    ...pro,
    id: pro.id || pro._id,
    lat: pro.location?.coordinates?.[1] ?? pro.lat ?? 0,
    lng: pro.location?.coordinates?.[0] ?? pro.lng ?? 0,
    services: (pro.services || []).map((s) => ({ ...s, id: s.id || s._id })),
  };
}

export function normalizeBooking(b) {
  if (!b) return b;
  return { ...b, id: b.id || b._id };
}

export function normalizeReview(r) {
  if (!r) return r;
  return { ...r, id: r.id || r._id };
}

export function normalizeUser(u) {
  if (!u) return u;
  return { ...u, id: u.id || u._id };
}
