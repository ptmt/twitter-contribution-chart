import Papa from "papaparse";
import { reduceTweets } from "./processData";

export function parseData(file, onUpdateProgress, onComplete, onError) {
  let parsedData: ContributionsByYear = {
    years: {},
    days: {}
  };
  let parsedTweets = 0;
  Papa.parse(file, {
    dynamicTyping: true,
    header: true,
    worker: false,
    step: (results, parser) => {
      // parser.pause();
      parsedTweets += results.data.length;
      parsedData = reduceTweets(parsedData, results.data);
      requestAnimationFrame(() =>
        onUpdateProgress(Math.round(results.meta.cursor / file.size * 100))
      );
    },
    complete: (results, file) => {
      onComplete(parsedTweets, parsedData);
    },
    error: onError
  });
}
