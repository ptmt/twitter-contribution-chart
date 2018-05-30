/* This is the basic component. */
let component = ReasonReact.statelessComponent("Page");

let handleClick = (_event, _self) => Js.log("clicked!");

let make = (_children) => {
  ...component,
  render: self =>
    <div onClick=(self.handle(handleClick))>
     (ReasonReact.string("Upload tweets.csv"))
    </div>,
};
