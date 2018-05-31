/* This is the basic component. */
let component = ReasonReact.statelessComponent("Page");

let handleClick = (_event, _self) => Js.log("clicked!");

let handleChange = (_event, _self) => Js.log("picked!");

let make = (_children) => {
  ...component,
  render: self =>
    <div onClick=(self.handle(handleClick))>
    <input _type="file"
    onChange={self.handle(handleChange)}
    style=(ReactDOMRe.Style.make(~position="absolute", ~top="-99999px", ()))
  />
     (ReasonReact.string("Upload tweets.csv"))
    </div>,
};
