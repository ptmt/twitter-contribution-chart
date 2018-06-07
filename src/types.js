/* @flow */

export type Year = {
  year: string,
  total: number,
  range: {
    start: string,
    end: string
  }
};
export type DayContribution = {
  date: string,
  timestamp: number,
  count: number,
  color: string,
  intensity: number
};
export type CanvasData = {
  years: Array<Year>,
  contributions: Array<DayContribution>
};
export type ContributionsByYear = {
  years: {
    [string]: Year
  },
  days: {
    [string]: DayContribution
  },
  errors: Array<TweetRawLines>
};

export type TweetRawLines = {
  expanded_urls: ?string,
  in_reply_to_status_id: ?number,
  retweeted_status_id: ?number,
  retweeted_status_timestamp: ?number,
  retweeted_status_user_id: ?number,
  source: ?string,
  text: string,
  timestamp: string,
  tweet_id: number
};
