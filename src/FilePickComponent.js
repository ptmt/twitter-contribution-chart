import React from "react";
import Dropzone from "react-dropzone";

export default class FilePickComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      accept: "",
      files: [],
      dropzoneActive: false
    };
  }

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(files) {
    this.setState({
      files,
      dropzoneActive: false
    });
    this.props.onFiles(files);
  }

  applyMimeTypes(event) {
    this.setState({
      accept: event.target.value
    });
  }

  render() {
    const { accept, files, dropzoneActive } = this.state;
    const overlayStyle = {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: "2.5em 0",
      background: "rgba(0,0,0,0.5)",
      textAlign: "center",
      color: "#fff"
    };
    return (
      <Dropzone
        accept={accept}
        onDrop={this.onDrop.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
      >
        {dropzoneActive && <div style={overlayStyle}>Drop files...</div>}
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flex: 1,
            height: "100%",
            alignItems: "center"
          }}
        >
          Drag'n'drop tweets.csv
        </div>
      </Dropzone>
    );
  }
}
