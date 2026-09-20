// Durations, not calendar-day boundaries: 24h / 48h in the viewer's local timezone.
export function collectedTime(value, now = Date.now()) {
  if (value == null || value === '') return null;
  const date = new Date(value), timestamp = date.getTime();
  if (!Number.isFinite(timestamp)) return null;
  const p = n => String(n).padStart(2, '0');
  const absolute = `${date.getFullYear()}.${p(date.getMonth() + 1)}.${p(date.getDate())}`;
  const clock = `${p(date.getHours())}:${p(date.getMinutes())}`;
  const age = Number(now) - timestamp;
  const label = age >= 0 && age < 86400000 ? clock : age >= 86400000 && age < 172800000 ? '1일 전' : absolute;
  return {label, iso: date.toISOString(), exact: `${absolute} ${clock}`};
}
