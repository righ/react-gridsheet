import React from "react";
import Component from "./index";

const data = [
  ["a", "b", "c", "d", "e"],
  ["f", "g", "h", "i", "j"],
  ["k", "l", "m", "n", "o"],
  ["p", "q", "r", "s", "t"],
  ["u", "v", "w", "x", "y"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
  ["1", "2", "3", "4", "5"],
];

export default {
  title: "index",
};

export const showIndex = () => (<Component 
  data={data}
  options={{
    // headerWidth: "50px",
    // headerHeight: "40px",
    cols: [
      { key: 1, label: "ビー", style: { fontWeight: "bold", color: "#ff0000", backgroundColor: "rgba(255, 200, 200, 0.5)"}},
      { key: 3, width: "300px"},
    ],
    rows: [
      { key: 1, label: "二", style: {borderBottom: "double 4px #000000"}},
      { key: 2, height: "100px"},
      { key: 3, label: "よん", height: "50px", verticalAlign: "bottom"},

    ],
  }}
/>);
