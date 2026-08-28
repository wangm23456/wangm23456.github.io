import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { fetchLaunches, type Launch } from '../../lib/data';
import { queryClient } from '../../lib/queryClient';
import { useEffect, useState } from 'react';
type Variant = 'compact' | 'full';

interface Props {
  variant: Variant;
}

function formatUtc(value?: string | Date | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date).replace(',', ' /');
}

function providerName(launch: Launch): string {
  return launch.launch_service_provider?.name || launch.mission?.orbit?.name || 'Provider not listed';
}

function padName(launch: Launch): string {
  const pad = launch.pad?.name;
  const location = launch.pad?.location?.name;
  return [pad, location].filter(Boolean).join(' / ') || 'Launch site not listed';
}

function vehicleName(launch: Launch): string {
  return launch.rocket?.configuration?.full_name || launch.rocket?.configuration?.name || 'Vehicle not listed';
}

function statusName(launch: Launch): string {
  return launch.status?.abbrev || launch.status?.name || 'TBD';
}

function safeUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function useCountdown(value?: string | null): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!value) return '--:--:--';
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return '--:--:--';
  const remaining = target - now;
  if (remaining <= 0) return 'T−00:00:00';

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days ? `${days}D ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function LaunchCard({
  launch,
  compact,
  isPending,
  isError,
}: {
  launch?: Launch;
  compact: boolean;
  isPending: boolean;
  isError: boolean;
}) {
  const countdown = useCountdown(launch?.window_start);
  const noLaunchLabel = isError ? 'Launch data offline' : isPending ? 'Loading launch manifest…' : 'No upcoming launch found';
  const providerLabel = isError ? 'Open Space Now to retry the feed' : 'Launch Library 2';
  const countdownLabel = countdown === 'T−00:00:00'
    ? 'Window reached · monitor for updates'
    : launch?.window_start
      ? 'Until scheduled window start · UTC'
      : 'Launch time not listed';

  return (
    <article className="space-primary-card">
      <div className="space-card-head">
        <span>{compact ? 'SPACE NOW / NEXT LAUNCH' : 'NEXT LAUNCH / PRIMARY TARGET'}</span>
        <span className="space-live-mark">
          <i />
          {isPending ? 'SYNC' : isError ? 'OFFLINE' : 'LIVE'}
        </span>
      </div>
      <div className="space-primary-layout">
        <div className="space-primary-copy">
          <p className="space-label">MISSION IDENTIFIER</p>
          <h2>{launch?.name || noLaunchLabel}</h2>
          <p className="space-provider">{launch ? `${providerName(launch)} · ${statusName(launch)}` : providerLabel}</p>
          <dl className="space-metadata">
            <div>
              <dt>WINDOW</dt>
              <dd>{formatUtc(launch?.window_start)}</dd>
            </div>
            <div>
              <dt>PAD / SITE</dt>
              <dd>{launch ? padName(launch) : '—'}</dd>
            </div>
            <div>
              <dt>VEHICLE</dt>
              <dd>{launch ? vehicleName(launch) : '—'}</dd>
            </div>
          </dl>
          <div className="space-countdown" aria-live="polite">
            <span>COUNTDOWN</span>
            <strong>{countdown}</strong>
            <small>{countdownLabel}</small>
          </div>
          {compact && <span className="home-space-card__cta">OPEN MISSION CONTROL <span aria-hidden="true">↗</span></span>}
        </div>
      </div>
    </article>
  );
}

function LaunchList({ launches, isPending, isError }: { launches: Launch[]; isPending: boolean; isError: boolean }) {
  if (isPending) return <ol className="space-launch-list"><li className="space-empty">Reading the launch manifest…</li></ol>;
  if (isError || launches.length === 0) {
    return (
      <ol className="space-launch-list">
        <li className="space-empty">
          <strong>{isError ? 'Launch feed unavailable.' : 'No upcoming launches in this window.'}</strong>
          <span>{isError ? 'Use REFRESH FEED to try the connection again.' : 'The public manifest returned no scheduled targets.'}</span>
        </li>
      </ol>
    );
  }

  return (
    <ol className="space-launch-list">
      {launches.map((launch, index) => {
        const href = safeUrl(launch.url);
        const title = <strong>{launch.name || 'Unnamed mission'}</strong>;
        return (
          <li className="space-launch-item" key={launch.id || `${launch.name}-${index}`}>
            <span className="space-launch-index">{String(index + 1).padStart(2, '0')}</span>
            <div className="space-launch-main">
              {href ? <a href={href} target="_blank" rel="noopener">{title}</a> : title}
              <span>{providerName(launch)} · {padName(launch)}</span>
              <p>{launch.mission?.description || launch.mission?.name || 'Mission details not listed'}</p>
            </div>
            <div className="space-launch-time">
              <time dateTime={launch.window_start || undefined}>{formatUtc(launch.window_start)}</time>
              <span>{statusName(launch)}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SpaceLaunchWidgetContent({ variant }: Props) {
  const query = useQuery({
    queryKey: ['space-launches', '7-days'],
    queryFn: ({ signal }) => fetchLaunches(signal),
  });
  const launches = query.data ?? [];
  const primary = launches[0];

  if (variant === 'compact') {
    return <LaunchCard launch={primary} compact isPending={query.isPending} isError={query.isError} />;
  }

  return (
    <div className="space-page">
      <header className="space-intro">
        <div>
          <p className="space-kicker">LAUNCH LIBRARY 2 / LIVE MANIFEST</p>
          <h1>Space<br /><em>Now.</em></h1>
        </div>
        <div className="space-feed-status" data-state={query.isPending ? 'connecting' : query.isError ? 'error' : 'online'} aria-live="polite">
          <span className="space-feed-status__label">FEED STATUS</span>
          <strong>{query.isPending ? 'CONNECTING' : query.isError ? 'OFFLINE' : 'ONLINE'}</strong>
          <time>{query.dataUpdatedAt ? `UPDATED ${formatUtc(new Date(query.dataUpdatedAt))} UTC` : 'WAITING FOR RESPONSE'}</time>
          <button type="button" onClick={() => query.refetch()} disabled={query.isFetching}>
            {query.isFetching ? 'SYNCING…' : 'REFRESH FEED'}
          </button>
        </div>
      </header>

      <section className="space-command-grid" aria-label="Space Now mission control">
        <LaunchCard launch={primary} compact={false} isPending={query.isPending} isError={query.isError} />
      </section>

      <section className="space-upcoming-section" aria-labelledby="upcoming-heading">
        <div className="space-section-head">
          <div>
            <p className="space-kicker">UPCOMING MANIFEST</p>
            <h2 id="upcoming-heading">Next in line</h2>
          </div>
          <span className="space-section-count">
            {query.isPending ? 'LOADING / 07 DAYS' : query.isError ? 'OFFLINE / RETRY AVAILABLE' : `${launches.length} TARGETS / LIVE / 07 DAYS`}
          </span>
        </div>
        <LaunchList launches={launches.slice(1)} isPending={query.isPending} isError={query.isError} />
      </section>

      <footer className="space-source">
        <span>SOURCE: <a href="https://thespacedevs.com/llapi" target="_blank" rel="noopener">LAUNCH LIBRARY 2</a></span>
        <span>PUBLIC DATA · WINDOWS ARE SUBJECT TO CHANGE</span>
      </footer>
    </div>
  );
}

export default function SpaceLaunchWidget(props: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <SpaceLaunchWidgetContent {...props} />
    </QueryClientProvider>
  );
}
