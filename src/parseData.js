import Papa from "papaparse";
import { reduceTweets, prepareToCanvasData } from "./processData";

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
      // console.log("pause", results, this.state.parsingProgress);
      // parser.pause();
      parsedTweets += results.data.length;
      parsedData = reduceTweets(parsedData, results.data);
      requestAnimationFrame(() =>
        onUpdateProgress(Math.round(results.meta.cursor / file.size * 100))
      );
    },
    complete: (results, file) => {
      console.log(parsedData);
      onComplete(parsedTweets, parsedData);
    },
    error: onError
  });
}
