import React, { Component } from "react";
import FilePickComponent from "./FilePickComponent";
import ProgressBar from "react-progress-bar-plus";
import { drawContributions } from "twitter-contributions-canvas";
import { prepareToCanvasData } from "./processData";
import { parseData } from "./parseData";
import "./App.css";
import "./entireframework.min.css";
import "react-progress-bar-plus/lib/progress-bar.css";

class App extends Component {
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
    parsingProgress: -1,
    theme: "standard",
    username: "",
    rawTweetsFile: null
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
    this.setState({ progress: 10, error: null, parsedData: null }, () => {
      setTimeout(
        () =>
          parseData(
            this.state.rawTweetsFile,
            parsingProgress => {
              this.setState({ parsingProgress });
            },
            (parsedTweetsNumber, parsedData) => {
              this.setState(
                {
                  parsingProgress: -1,
                  parsedData,
                  previewStats: `${parsedTweetsNumber} tweets parsed.`
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
    const canvasData: CanvasData = prepareToCanvasData(this.state.parsedData);
    drawContributions(this.canvas.current, {
      data: canvasData,
      username: this.state.username,
      themeName: this.state.theme,
      footerText: "Made by @sallar for GitHub, converted by @ptmt"
    });
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
      <FilePickComponent onFiles={this.onAcceptedFiles} disableClick>
        <div className="wrapper">
          <ProgressBar percent={this.state.progress} onTop />
          <div className="container">
            <div className="hero">
              <h1>Twitter Contribution Chart Generator</h1>

              <p>
                <a href="https://twitter.com/settings/account">
                  Request Twitter Timeline
                </a>{" "}
                your profile, wait for email, and extract tweets.csv from .zip.
              </p>

              <div className="msg">
                <strong>Privacy disclaimer: </strong> This page processes all
                data locally within your browser, nothing is sent to or stored
                on the server. You can disable network at all or just{" "}
                <a href="https://github.com/ptmt/twitter-contribution-chart">
                  run your own local copy
                </a>.
              </div>

              <div style={{ margin: "1em 0" }}>
                <FilePickComponent onFiles={this.onAcceptedFiles}>
                  <button className="btn btn-a">
                    Upload tweets.csv (or drag'n'drop)
                  </button>
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
                <button
                  className="smallbtn"
                  onClick={() => this.downloadCanvas()}
                  type="button"
                >
                  Download the Image
                </button>

                <canvas ref={this.canvas} />
              </div>
            )}
          </div>
        </div>
      </FilePickComponent>
    );
  }

  _handleThemeChange = e => {
    this.setState({ theme: e.target.value });
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
              placeholder="Your GitHub Username"
              onChange={this.handleUsernameChange}
              value={this.state.username}
              id="username"
            />
          </div>
        )}
        {this.state.username.length > 0 &&
          this.state.rawTweetsFile && (
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
