import {
  handlePropsType,
  MatrixType,
  PositionType,
} from "../types";

import { cropMatrix, writeMatrix, spreadMatrix, superposeArea, slideArea, shape } from "./arrays";
import { convertArrayToTSV, convertTSVToArray} from "./converters";
import { undo, redo } from "./histories";

export const handleBlur = ({
  select,
  choose, choosing, setChoosingLast,
  colsSelect, rowsSelect,
}: handlePropsType) => {
  return () => {
    setChoosingLast(choosing);
    select([-1, -1, -1, -1]);
    choose([-1, -1]);
    colsSelect([-1, -1]);
    rowsSelect([-1, -1]);
  };
};

export const handleClear = ({
  x, y,
  history,
  matrix, setMatrix,
  selectingArea,
}: handlePropsType) => {
  return () => {
    const [top, left, bottom, right] = selectingArea;
    if (top === -1) {
      selectingArea = [y, x, y, x];
    }
    const after = spreadMatrix([[""]], bottom - top, right - left);
    history.append({
      command: "write",
      position: [top, left],
      before: cropMatrix(matrix, selectingArea),
      after,
    });
    matrix = writeMatrix(top, left, after, matrix);
    setMatrix([... matrix]);
  };
};

export const handleCopy = ({
  y, x,
  matrix,
  clipboardRef,
  select, selecting, selectingArea,
  copy,
  choose,
  setCutting,
}: handlePropsType) => {
  let area = selectingArea;
  if (area[0] === -1) {
    area = [y, x, y, x];
  }
  return (cutting=false) => {
    const input = clipboardRef.current;
    copy(area);
    const copyingRows = cropMatrix(matrix, area);
    const tsv = convertArrayToTSV(copyingRows);
    const selectingLast = selecting;
    if (input != null) {
      input.value = tsv;
      input.focus();
      input.select();
      document.execCommand("copy");
      input.value = "";
      input.blur();
      setTimeout(() => {
        choose([y, x]);
        select(selectingLast);
      }, 100); // refocus
    }
    setCutting(cutting);
  };
};

export const handleSelect = ({
  x, y,
  select, selecting,
  numRows, numCols,
}: handlePropsType) => {
  return (deltaY: number, deltaX: number) => {
    let [dragEndY, dragEndX] = [selecting[2] === -1 ? y : selecting[2], selecting[3] === -1 ? x : selecting[3]];
    let [nextY, nextX] = [dragEndY + deltaY, dragEndX + deltaX];
    if (nextY < 0 || numRows <= nextY || nextX < 0 || numCols <= nextX) {
      return;
    }
    y === nextY && x === nextX ? select([-1, -1, -1, -1]) : select([y, x, nextY, nextX]);
  };
}

export const handleSelectAll = ({
  select, 
  numRows, numCols,
}: handlePropsType) => {
  return () => {
    select([0, 0, numRows - 1, numCols - 1]);
  };
};

export const handleEscape = ({
  copy,
  setCutting,
}: handlePropsType) => {
  return () => {
    copy([-1, -1, -1, -1]);
    setCutting(false);
  };
};

export const handlePaste = ({
  x, y,
  history,
  matrix,
  selectingArea, copyingArea,
  cutting,
  select,
  copy,
  setMatrix,
  setCutting,
}: handlePropsType) => {
  const [selectingTop, selectingLeft] = selectingArea;
  const [copyingTop, copyingLeft] = copyingArea;
  const [selectingHeight, selectingWidth] = shape(selectingArea);
  const [copyingHeight, copyingWidth] = shape(copyingArea);

  return (text: string) => {
    let before: MatrixType = [];
    let after = cropMatrix(matrix, copyingArea);
    let height = copyingHeight;
    let width = copyingWidth;
    let position: PositionType = [y, x];
    if (cutting) {
      const blank = spreadMatrix([[""]], copyingHeight, copyingWidth);
      matrix = writeMatrix(copyingTop, copyingLeft, blank, matrix);
    }
    if (selectingTop === -1) { // unselecting destination
      if (copyingTop === -1) { // unselecting source
        after = convertTSVToArray(text);
        [height, width] = [after.length - 1, after[0].length - 1];
      }
      before = cropMatrix(matrix, [y, x, y + height, x + width]);
      matrix = writeMatrix(y, x, after, matrix);
      select([y, x, y + height, x + width]);
    } else { // selecting destination
      if (copyingTop === -1) { // unselecting source
        after = convertTSVToArray(text);
        [height, width] = superposeArea([0, 0, after.length - 1, after[0].length - 1], [0, 0, selectingHeight, selectingWidth]);
      } else { // selecting source
        [height, width] = superposeArea(copyingArea, selectingArea);
      }
      position = [selectingTop, selectingLeft];
      after = spreadMatrix(after, height, width);
      before = cropMatrix(matrix, slideArea([0, 0, height, width], ... position));
      matrix = writeMatrix(selectingTop, selectingLeft, after, matrix);
      select(slideArea([0, 0, height, width], ... position));
    }
    history.append({
      command: "write",
      position,
      cutting: cutting ? copyingArea : undefined,
      before,
      after,
    });
    setMatrix([... matrix]);
    setCutting(false);
    copy([-1, -1, -1, -1]);
  };
};

export const handleChoose = ({
  selectingArea,
  select,
  choose,
  colsSelect, rowsSelect,
  numRows, numCols,
}: handlePropsType) => {
  const [top, left, bottom, right] = selectingArea;

  return (nextY: number, nextX: number, breaking: boolean) => {
    if (breaking) {
      colsSelect([-1, -1]);
      rowsSelect([-1, -1]);
    }
    if (nextY < top && top !== -1 && !breaking) {
      nextY = bottom;
      nextX = nextX > left ? nextX - 1 : right;
    }
    if (nextY > bottom && bottom !== -1 && !breaking) {
      nextY = top;
      nextX = nextX < right ? nextX + 1 : left;
    }
    if (nextX < left && left !== -1 && !breaking) {
      nextX = right;
      nextY = nextY > top ? nextY - 1 : bottom;
    }
    if (nextX > right && right !== -1 && !breaking) {
      nextX = left;
      nextY = nextY < bottom ? nextY + 1 : top;
    }
    if (breaking) {
      select([-1, -1, -1, -1]);
    }
    if (nextY < 0 || numRows <= nextY || nextX < 0 || numCols <= nextX) {
      return;
    }
    choose([nextY, nextX]);
  };
};

export const handleWrite = ({
  y, x,
  history,
  matrix, setMatrix,
}: handlePropsType) => {
  return (value: string) => {
    history.append({
      command: "write",
      position: [y, x],
      before: [[matrix[y][x]]],
      after: [[value]],
    });
    matrix = writeMatrix(y, x, [[value]], matrix);
    setMatrix([... matrix]);
  };
};

export const handleUndo = ({
  history,
  matrix, setMatrix,
}: handlePropsType) => {
  return () => {
    const operation = history.prev();
    if (typeof operation === "undefined") {
      return;
    }
    undo(operation, matrix);
    setMatrix([... matrix]);
  };
};

export const handleRedo = ({
  history,
  matrix, setMatrix,
}: handlePropsType) => {
  return () => {
    const operation = history.next();
    if (typeof operation === "undefined") {
      return;
    }
    redo(operation, matrix);
    setMatrix([... matrix]);
  };
};