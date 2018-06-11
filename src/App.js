/* @flow */
import React, { Component } from "react";
import FilePickComponent from "./FilePickComponent";
import ProgressBar from "react-progress-bar-plus";
import { drawContributions } from "twitter-contributions-canvas";
import { prepareToCanvasData } from "./processData";
import { parseData } from "./parseData";
import { type ContributionsByYear, type CanvasData } from "./types";
import "./App.css";
import "./entireframework.min.css";
import "react-progress-bar-plus/lib/progress-bar.css";

type State = {
  error: ?string,
  progress: number,
  theme: string,
  username: string,
  rawTweetsFile: ?File,
  parsedData: ?ContributionsByYear,
  previewStats: ?string
};

class App extends Component<{}, State> {
  availableThemes = {
    standard: "GitHub",
    halloween: "Halloween",
    teal: "Teal",
    leftPad: "@left_pad",
    dracula: "Dracula",
    blue: "Blue",
    panda: "Panda 🐼",
    sunny: "Sunny"
  };
  state = {
    error: null,
    progress: -1,
    theme: "standard",
    username: "",
    rawTweetsFile: null,
    parsedData: null,
    previewStats: null
  };

  canvas = React.createRef();
  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.rawTweetsFile) {
      this.setState({ error: "Upload file to begin" });
      return;
    }
    this.setState({ progress: 1, error: null, parsedData: null }, () => {
      setTimeout(
        () =>
          parseData(
            this.state.rawTweetsFile,
            (progress, resume) => {
              this.setState({ progress }, resume);
            },
            (parsedTweetsNumber, parsedData) => {
              console.log("Malformed tweets", parsedData.errors);
              this.setState(
                {
                  progress: -1,
                  parsedData,
                  previewStats: `${parsedTweetsNumber} tweets parsed, ${
                    parsedData.errors.length
                  } malformed`
                },
                () => this.drawCanvas()
              );
            },
            err => this.setState({ error: "Error while parsing csv" })
          ),
        300
      );
    });
  };
  onAcceptedFiles = (acceptedFiles: Array<File>) => {
    const rawTweetsFile = acceptedFiles.find(
      file => file.name.indexOf("tweets.csv") > -1
    );
    if (!rawTweetsFile) {
      this.setState({ error: "Can't find tweets.csv" });
    } else {
      this.setState({ rawTweetsFile });
    }
  };

  drawCanvas() {
    if (this.state.parsedData) {
      const canvasData: CanvasData = prepareToCanvasData(this.state.parsedData);
      drawContributions(this.canvas.current, {
        data: canvasData,
        username: this.state.username,
        themeName: this.state.theme,
        footerText: "Made by @sallar for GitHub, converted by @ptmt"
      });
    } else {
      this.setState({ error: "Data is not parsed" });
    }
  }
  downloadCanvas() {
    try {
      const dataUrl = this.canvas.current.toDataURL();
      const a = document.createElement("a");
      document.body.insertAdjacentElement("beforeend", a);
      a.download = "contributions.png";
      a.href = dataUrl;
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    return (
      <React.Fragment>
        <ProgressBar percent={this.state.progress} onTop />,
        <FilePickComponent onFiles={this.onAcceptedFiles} disableClick>
          <div className="wrapper">
            <div className="container">
              <div className="hero">
                <h1>Twitter Contribution Chart Generator</h1>

                <div className="msg">
                  <strong>Privacy disclaimer: </strong> All data is processed
                  locally within your browser, no cookies or 3rd party server,
                  nothing is stored or sent to the server. Check the source code
                  on{" "}
                  <a href="https://github.com/ptmt/twitter-contribution-chart">
                    GitHub
                  </a>{" "}
                  or run your own local copy.
                </div>

                <p>
                  Request Twitter Archive from your profile here{" "}
                  <a href="https://twitter.com/settings/account">
                    https://twitter.com/settings/account
                  </a>, wait for an email from Twitter with .zip file attached,
                  extract tweets.csv and dran'd'drop it to this page.
                </p>

                <div style={{ margin: "1em 0" }}>
                  <FilePickComponent onFiles={this.onAcceptedFiles}>
                    <button className="btn btn-a">Open tweets.csv</button>
                    {this.state.rawTweetsFile && (
                      <p>
                        Found {this.state.rawTweetsFile.name}, ready to proceed
                      </p>
                    )}
                  </FilePickComponent>
                </div>

                {this._renderForm()}
              </div>

              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}

              {this.state.parsedData && (
                <div className="Results">
                  <h3>{this.state.previewStats}</h3>
                  <div className="panel">
                    <label>
                      Theme:
                      <select
                        value={this.state.theme}
                        onChange={this._handleThemeChange}
                      >
                        {Object.keys(this.availableThemes).map(theme => (
                          <option key={theme} value={theme}>
                            {this.availableThemes[theme]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="smallbtn"
                      onClick={() => this.downloadCanvas()}
                      type="button"
                    >
                      Download the Image
                    </button>
                  </div>

                  <canvas ref={this.canvas} />
                </div>
              )}
            </div>
          </div>
        </FilePickComponent>
      </React.Fragment>
    );
  }

  _handleThemeChange = e => {
    this.setState({ theme: e.target.value }, () => this.drawCanvas());
  };

  _renderForm = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.rawTweetsFile && (
          <div>
            <span className="addon">@</span>
            <input
              ref={ref => {
                this.inputRef = ref;
              }}
              className="smooth"
              placeholder="Your Twitter"
              onChange={this.handleUsernameChange}
              value={this.state.username}
              id="username"
            />
          </div>
        )}

        {this.state.username.length > 0 &&
          this.state.rawTweetsFile && (
            <button
              type="submit"
              className="btn btn-b"
              disabled={
                this.state.username.length <= 0 || !this.state.rawTweetsFile
              }
            >
              Generate!
            </button>
          )}
      </form>
    );
  };
}

export default App;
