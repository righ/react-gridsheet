import React from "react";
import styled from "styled-components";

import { y2r, x2c } from "../api/converters";
import { Context } from "../store";
import {
  setResizingPositionY,
  setResizingPositionX,
  setCellsOption,
} from "../store/actions";

import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  MIN_WIDTH,
  MIN_HEIGHT,
} from "../constants";
import { zoneToArea, makeSequence, between } from "../api/arrays";
import { CellsOptionType } from "../types";

const Line = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border: dotted 1px #0077ff;
  box-sizing: border-box;
`;

export const Resizing: React.FC = React.memo(() => {
  const { store, dispatch } = React.useContext(Context);
  const {
    resizingPositionY: posY,
    resizingPositionX: posX,
    cellsOption,
    horizontalHeadersSelecting,
    verticalHeadersSelecting,
    selectingZone,
    editorRef,
    sheetRef,
  } = store;

  const [y, startY, endY] = posY;
  const [x, startX, endX] = posX;
  if (y === -1 && x === -1) {
    return null;
  }
  const [resizingRowId, resizingColId] = [`${y2r(y)}`, x2c(x)];
  const { y: offsetY, x: offsetX } = sheetRef.current.getBoundingClientRect();

  const handleResizeEnd = () => {
    const selectingArea = zoneToArea(selectingZone);
    const [top, left, bottom, right] = selectingArea;
    const newCellsOption: CellsOptionType = {};
    if (x !== -1) {
      let width =
        (cellsOption[resizingColId]?.width || DEFAULT_WIDTH) + (endX - startX);
      if (width < MIN_WIDTH) {
        width = MIN_WIDTH;
      }
      let xs = [x];
      if (horizontalHeadersSelecting && between([left, right], x)) {
        xs = makeSequence(left, right + 1);
      }
      xs.map((x) => {
        newCellsOption[x2c(x)] = { ...cellsOption[x2c(x)], width };
      });
    }
    if (y !== -1) {
      let height =
        (cellsOption[resizingRowId]?.height || DEFAULT_HEIGHT) +
        (endY - startY);
      if (height < MIN_HEIGHT) {
        height = MIN_HEIGHT;
      }
      let ys = [y];
      if (verticalHeadersSelecting && between([top, bottom], y)) {
        ys = makeSequence(top, bottom + 1);
      }
      ys.map((y) => {
        newCellsOption[y2r(y)] = { ...cellsOption[y2r(y)], height };
      });
    }
    dispatch(setCellsOption(newCellsOption));
    dispatch(setResizingPositionY([-1, -1, -1]));
    dispatch(setResizingPositionX([-1, -1, -1]));
    editorRef.current?.focus();
  };
  const handleResizeMove = (e: React.MouseEvent) => {
    if (y !== -1 && endY !== e.clientY) {
      dispatch(setResizingPositionY([y, startY, e.clientY]));
    } else if (x !== -1 && endX !== e.clientX) {
      dispatch(setResizingPositionX([x, startX, e.clientX]));
    }
  };

  return (
    <div
      className="resizing"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgba(0, 127, 255, 0.08)",
        top: 0,
        left: 0,
        zIndex: 3,
      }}
      onMouseUp={handleResizeEnd}
      onMouseMove={handleResizeMove}
    >
      {x !== -1 && (
        <Line style={{ width: 1, height: "100%", left: endX - offsetX }} />
      )}
      {y !== -1 && (
        <Line style={{ width: "100%", height: 1, top: endY - offsetY }} />
      )}
    </div>
  );
});
