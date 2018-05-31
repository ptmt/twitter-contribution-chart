import React, { Component } from "react";
import FilePickComponent from "./FilePickComponent";
import Papa from "papaparse";
import ProgressBar from "react-progress-bar-plus";
import "./App.css";
import "react-progress-bar-plus/lib/progress-bar.css";

class App extends Component {
  state = {
    error: null,
    parsingProgress: 0
  };
  onAcceptedFiles = (acceptedFiles: Array<File>) => {
    this.setState({
      parsingProgress: 1
    });
    const rawTweetsFile = acceptedFiles.find(
      file => file.name.indexOf("tweets.csv") > -1
    );
    console.log(acceptedFiles, rawTweetsFile);
    if (!rawTweetsFile) {
      this.setState({ error: "Can't find tweets.csv" });
    }
    let parsedData = [];

    const s = Papa.parse(rawTweetsFile, {
      // skipEmptyLines: true,
      dynamicTyping: true,
      header: true,
      webWorker: true,
      step: (results, parser) => {
        parsedData = parsedData.concat(results.data);
        this.setState({
          parsingProgress: Math.round(
            results.meta.cursor / rawTweetsFile.size * 100
          )
        });
      },
      complete: (results, file) => {
        console.log("Parsing complete:", file, results, parsedData[0]);
        this.setState({
          parsingProgress: 100,
          previewStats: `${parsedData.length} records parsed`
        });
      },
      error: err => this.setState({ error: "Error while parsing csv" })
    });
  };
  render() {
    console.log(this.state);
    return (
      <div className="container">
        {this.state.parsingProgress > 0 &&
          this.state.parsingProgress < 100 && (
            <ProgressBar percent={this.state.parsingProgress} onTop />
          )}
        <div className="hero">
          <h1>Twitter Contribution Chart Generator</h1>
          <p>
            Inspired by&nbsp;
            <a href="https://github-contributions.now.sh/">
              https://github-contributions.now.sh
            </a>
          </p>

          <p>
            1. Request Twitter Timeline https://twitter.com/settings/account
            "Request your archive"
          </p>
          <p>2. You should receieve .zip file from Twitter</p>
          <p>3. Download, extract and</p>
          <FilePickComponent onFiles={this.onAcceptedFiles} />

          <p>{this.state.previewStats}</p>

          {this.state.error && <div className="error">{this.state.error}</div>}
          <p>
            We don't upload or store anything, all data is processed in your
            browser page
          </p>
        </div>
      </div>
    );
  }
}

export default App;
