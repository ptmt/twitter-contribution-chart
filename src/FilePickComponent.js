/* @flow */
import React from "react";
import Dropzone from "react-dropzone";

type Props = {
  children: any,
  disableClick: boolean,
  onFiles: (Array<File>) => void
};
type State = {
  accept: string,
  files: Array<File>,
  dropzoneActive: boolean
};
export default class FilePickComponent extends React.Component<Props, State> {
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

  onDrop(files: Array<File>) {
    this.setState({
      files,
      dropzoneActive: false
    });
    this.props.onFiles(files);
  }

  applyMimeTypes(event: any) {
    this.setState({
      accept: event.target.value
    });
  }

  render() {
    const { accept, dropzoneActive } = this.state;
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
        disableClick={this.props.disableClick}
        style={{ position: "relative" }}
        accept={accept}
        onDrop={this.onDrop.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
      >
        {dropzoneActive && <div style={overlayStyle}>Drop files...</div>}
        {this.props.children}
      </Dropzone>
    );
  }
}
