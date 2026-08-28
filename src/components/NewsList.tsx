import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { AIHOT_URL, fetchJson } from '../lib/data';

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  publishedAt?: string | null;
  discoveredAt?: string;
  source?: { name?: string };
  links?: { aihot?: string; original?: string };
}

interface NewsResponse {
  items?: NewsItem[];
}

function timelineOf(item: NewsItem): Date | null {
  const pub = item.publishedAt ? new Date(item.publishedAt) : null;
  const disc = item.discoveredAt ? new Date(item.discoveredAt) : null;
  if (!pub) return disc;
  if (!disc) return pub;
  return disc.getTime() - pub.getTime() > 72 * 3600 * 1000 ? pub : disc;
}

function fmtBeijing(d: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

function NewsListContent() {
  const query = useQuery({
    queryKey: ['aihot', 'selected', '24h'],
    queryFn: ({ signal }) => fetchJson<NewsResponse>(AIHOT_URL, signal),
  });

  if (query.isPending) {
    return <p className="news-status">正在拉取过去 24 小时的 AI 圈精选…</p>;
  }

  if (query.isError) {
    return (
      <p className="news-status">
        新闻接口暂时不可用 —— 直接访问 <a href="https://aihot.virxact.com">AI HOT</a> 查看当前热点。
      </p>
    );
  }

  const items = (query.data.items ?? []).slice(0, 8);
  if (items.length === 0) {
    return <p className="news-status">过去 24 小时暂无精选条目。</p>;
  }

  return (
    <ul className="news-list">
      {items.map((item) => {
        const time = timelineOf(item);
        return (
          <li className="news-item" key={item.id}>
            <a href={item.links?.aihot ?? 'https://aihot.virxact.com'} target="_blank" rel="noopener">
              {item.title}
            </a>
            {item.summary && <p className="news-item__summary">{item.summary}</p>}
            <div className="news-item__meta">
              {item.source?.name && <span className="news-item__source">{item.source.name}</span>}
              {time && <time>{fmtBeijing(time)} 北京</time>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function NewsList() {
  return (
    <QueryClientProvider client={queryClient}>
      <NewsListContent />
    </QueryClientProvider>
  );
}
