import React from "react";
import { GridSheet, Renderer, aa2oa } from ".";
// import { GridSheet, Renderer, aa2oa } from "../dist";

class KanjiRenderer extends Renderer {
  protected kanjiMap: {[s: string]: string} = {
    "0": "〇",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六",
    "7": "七",
    "8": "八",
    "9": "九",
  };
  number (value: number): string {
    let kanji = "";
    let str = "" + value;
    for (let i = 0; i < str.length; i++) {
      const j = str.length - i;
      if (j % 3 === 0 && i !== 0) {
        kanji += ',';
      }
      kanji += this.kanjiMap[str[i]];
    }
    return kanji;
  }
};


const data = [
//  ["a", "b", "c", "d", "e"],
//  ["a", "b", "c", "d", "e"],
//  ["a", "b", "c", "d", "e"],
[123456, "b", "c", "d", "e", "aa", "bb", "cc", [1,2,3], "ee"],
["a", "b", 789, "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
["a", "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
[true, "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
[false, "b", "c", "d", "e", "aa", "bb", "cc", "dd", "ee"],
];

export default {
  title: "grid sheet",
};

export const showIndex = () => (<GridSheet
  data={data}
  options={{
    // cellLabel: false,
    // headerWidth: "50px",
    // headerHeight: "40px",
    historySize: 100,
    mode: "dark",
    //stickyHeaders: "horizontal",
    cells: {
      "default": { style: { fontStyle: "italic" }},
      "A1": { style: { color: "#008888"}},
      "B": { label: "ビー" },
      "D": { width: "300px"},
      "2": { label: "二", style: {borderBottom: "double 4px #000000" }, renderer: "kanji" },
      "3": { height: "100px", style: { fontWeight: "bold", color: "#ff0000", backgroundColor: "rgba(255, 200, 200, 0.5)"}},
      "4": { label: "よん", height: "50px", verticalAlign: "bottom"},
    },
    onSave: (matrix, options) => {
      console.log("matrix on save:", aa2oa(matrix || [], ["A", "B", "C", "D", "E", "F"]));
    },
    onChange: (matrix, options) => {
      if (typeof matrix !== "undefined") {
        console.log("matrix on change:", matrix);
      }
      if (typeof options !== "undefined") {
        console.log("options on change", options);
      }
    },
    renderers: {
      kanji: KanjiRenderer,
    },
  }}
/>);

