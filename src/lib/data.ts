export const AIHOT_URL =
  'https://aihot.virxact.com/api/v1/items?mode=selected&window=24h&limit=8';
export const LAUNCHES_URL = 'https://ll.thespacedevs.com/2.2.0/launch/';

export interface Launch {
  id?: string;
  name?: string;
  url?: string;
  window_start?: string | null;
  status?: { abbrev?: string; name?: string };
  launch_service_provider?: { name?: string };
  mission?: { description?: string; name?: string; orbit?: { name?: string } };
  pad?: { name?: string; location?: { name?: string } };
  rocket?: { configuration?: { full_name?: string; name?: string } };
}

export interface LaunchResponse {
  results?: Launch[];
}

export async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
    cache: 'default',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as T;
}

export async function fetchLaunches(signal?: AbortSignal): Promise<Launch[]> {
  const start = new Date();
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    limit: '9',
    ordering: 'window_start',
    window_start__gte: start.toISOString(),
    window_start__lte: end.toISOString(),
  });
  const data = await fetchJson<LaunchResponse>(`${LAUNCHES_URL}?${params}`, signal);
  return Array.isArray(data.results) ? data.results.filter((launch) => launch.window_start) : [];
}
