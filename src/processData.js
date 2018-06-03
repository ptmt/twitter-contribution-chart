/* @flow */

import {
  type DayContribution,
  type ContributionsByYear,
  type CanvasData,
  type TweetRawLing,
  type Year
} from "./types";

// https://github.com/sallar/github-contributions-api/blob/master/src/fetch.js
const COLOR_MAP = [
  "#196127",
  "#239a3b",
  "#7bc96f",
  "#c6e48b",
  "#ebedf0"
].reverse();

function normalDistributionIntensity(maxInYear: number, count: number): number {
  if (count === 0) {
    return 0;
  }
  const quartile = maxInYear / 4;
  if (count > 0 && count <= quartile) {
    return 1;
  }
  if (count > quartile && count <= quartile * 2) {
    return 2;
  }
  if (count > quartile && count <= quartile * 3) {
    return 3;
  }
  return 4;
}

export function reduceTweets(
  data: ContributionsByYear,
  tweetsToProcess: Array<TweetRawLing>
): ContributionsByYear {
  const originalTweets = tweetsToProcess.filter(
    f => !f.retweeted_status_id && !f.in_reply_to_status_id && f.timestamp
  );
  return originalTweets.reduce((acc, tweet) => {
    const date = new Date(tweet.timestamp);
    const year = date.getFullYear().toString();
    const day = iso(date);
    if (!year) {
      console.log(tweet.timestamp);
    }
    return {
      years: {
        ...data.years,
        [year]: incrementYear(year, data.years[year])
      },
      days: {
        ...data.days,
        [day]: incrementDay(date, data.days[day] ? data.days[day] : null)
      }
    };
  }, data);
}

export function prepareToCanvasData(data: ContributionsByYear): CanvasData {
  const daysArray = Object.keys(data.days)
    .map(k => data.days[k])
    .sort((a, b) => a.timestamp - b.timestamp);
  const minDate = new Date(daysArray[0].timestamp);
  const maxDate = new Date(daysArray[daysArray.length - 1].timestamp);
  const maxContributionsByYear = daysArray.reduce((acc, day) => {
    const year = new Date(day.timestamp).getFullYear();
    // console.log(year, day.count, acc[year]);
    return {
      ...acc,
      [year]: day.count > (acc[year] || 0) ? day.count : acc[year]
    };
  }, {});
  console.log(maxContributionsByYear);
  return {
    years: Object.keys(data.years).map(k => ({
      ...data.years[k],
      range: {
        start:
          minDate.getFullYear() === k
            ? iso(minDate)
            : iso(new Date(parseInt(k), 0, 1)),
        end:
          maxDate.getFullYear() === k
            ? iso(maxDate)
            : iso(new Date(parseInt(k), 11, 31))
      }
    })),
    contributions: daysArray.map(day => {
      const intensity = normalDistributionIntensity(
        maxContributionsByYear[
          new Date(day.timestamp).getFullYear().toString()
        ],
        day.count
      );

      return {
        ...day,
        intensity,
        color: COLOR_MAP[intensity]
      };
    })
  };
}

function incrementDay(date: Date, previous: ?DayContribution) {
  var p = previous || { count: 0, date: iso(date), timestamp: date.getTime() };
  return {
    ...p,
    count: p.count + 1
  };
}

function incrementYear(year: string, previous: ?Year): Year {
  var y = previous || { total: 0, year };
  return {
    ...y,
    total: y.total + 1
  };
}

function iso(date: Date): string {
  return date.toISOString().split("T")[0];
  // return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
