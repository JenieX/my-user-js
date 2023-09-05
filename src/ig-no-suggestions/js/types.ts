export type OpenArgs = Parameters<XMLHttpRequest['open']> | [ method: string, url: URL | string ];

export type SendArgs = Parameters<XMLHttpRequest['send']>;

export interface PossibleTimeLineResponse {
  feed_items: {
    end_of_feed_demarcator?: unknown,
    explore_story?: unknown,
    media_or_ad?: unknown,
  }[],
}
