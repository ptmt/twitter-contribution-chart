/* @flow */
import Papa from "papaparse";
import { reduceTweets } from "./processData";
import { type ContributionsByYear } from "./types";

export function parseData(
  file: File,
  onUpdateProgress: (number, () => void) => void,
  onComplete: (number, ContributionsByYear) => void,
  onError: any => void
) {
  let parsedData: ContributionsByYear = {
    years: {},
    days: {},
    errors: []
  };
  let parsedTweets = 0;
  Papa.parse(file, {
    dynamicTyping: true,
    header: true,
    worker: false,
    chunkSize: 10000,
    chunk: (results, parser) => {
      parser.pause();
      parsedTweets += results.data.length;
      parsedData = reduceTweets(parsedData, results.data);
      setTimeout(() => {
        onUpdateProgress(
          Math.round(results.meta.cursor / file.size * 100),
          () => {
            parser.resume();
          }
        );
      }, 10);
    },
    complete: (results, file) => {
      onComplete(parsedTweets, parsedData);
    },
    error: onError
  });
}
