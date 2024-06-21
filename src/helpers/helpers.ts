/* eslint-disable @typescript-eslint/no-explicit-any */
import { SVG, Svg } from "@svgdotjs/svg.js";
import { DrawActions } from "../reducers/actionTypes";
import { IInitialState, Modes, Line } from "../types/types";

// Generate Line ID
export const generateLineID = (lines: Line[]) => {
  if (lines?.length > 0) {
    const lastLine = lines[lines.length - 1];
    if (lastLine) {
      return lastLine.id + 1;
    }
  }
  return 1;
};

// Calculate angle
export const calculateLineAngle = (
  cx: number,
  cy: number,
  ex: number,
  ey: number
) => {
  const dy = ey - cy;
  const dx = ex - cx;
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  return Math.round(theta);
};

export const calculateLineLength = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  const dx = endX - startX;
  const dy = endY - startY;
  return Math.round(Math.sqrt(dx * dx + dy * dy));
};
// Render canvas grid
const renderGrid = (canvas: Svg) => {
  const GRID_SIZE = 10;
  const canvasWidth: any = canvas.width();
  const canvasHeight: any = canvas.height();

  // Background
  canvas.rect(canvasWidth, canvasHeight).fill("#fafafa");

  // Grid lines
  for (let i = 0; i < canvasWidth / GRID_SIZE; i++) {
    canvas
      .line(i * GRID_SIZE, 0, i * GRID_SIZE, canvasHeight)
      .stroke({ color: "#e0e0e0", width: 0.5 });
  }
  for (let j = 0; j < canvasHeight / GRID_SIZE; j++) {
    canvas
      .line(0, j * GRID_SIZE, canvasWidth, j * GRID_SIZE)
      .stroke({ color: "#e0e0e0", width: 0.5 });
  }
};

// Initialize canvas
export const initCanvas = () => {
  const canvas = SVG()
    .addTo("#canvas")
    .size(document.body.clientWidth, document.body.clientHeight);

  // Render background and grid
  renderGrid(canvas);

  // Cursor circle
  const cursor = canvas.group();
  cursor.circle(20).fill("transparent").stroke("#f06").move(10, 15);
  cursor.circle(10).fill("#f06").move(15, 20);
  cursor.hide();

  canvas.on("mousemove", (event: any) => {
    cursor.show();
    cursor.move(event.clientX - 10, event.clientY - 10);
  });
  return canvas;
};

export const handleMouseDown = (
  state: IInitialState,
  dispatch: React.Dispatch<any>
) => {
  if (state.drawMode === Modes.VIEW) {
    return;
  }

  if (state.drawMode === Modes.DRAG) {
    dispatch({ type: DrawActions.DESELECT_LINE });
    dispatch({ type: DrawActions.CHANGE_MODE, payload: Modes.CREATE });
    return;
  }
};

export const handleMouseUp = (
  event: MouseEvent,
  state: IInitialState,
  dispatch: React.Dispatch<any>
) => {
  if (state.drawMode === Modes.VIEW && !state.isDrawing) {
    dispatch({ type: DrawActions.CHANGE_MODE, payload: Modes.CREATE });
    dispatch({ type: DrawActions.DESELECT_LINE });
  }
  if (state.drawMode === Modes.EDIT && state.isDrawing && state.currentLine) {
    const { clientX: x, clientY: y } = event;
    const { start } = state.currentLine;
    const lineId = generateLineID(state.lines);
    const angle = calculateLineAngle(start.x, start.y, x, y);
    const length = calculateLineLength(start.x, start.y, x, y);

    dispatch({
      type: DrawActions.FINISH_LINE,
      payload: {
        id: lineId,
        end: { x, y },
        length: length,
        angle: angle,
      },
    });

    dispatch({ type: DrawActions.SELECT_LINE, payload: lineId });
    dispatch({ type: DrawActions.CHANGE_MODE, payload: Modes.VIEW });
  }
  if (state.drawMode === Modes.CREATE && !state.isDrawing) {
    const { clientX: x, clientY: y } = event;
    dispatch({ type: DrawActions.CHANGE_MODE, payload: Modes.EDIT });

    dispatch({ type: DrawActions.START_LINE, payload: { x, y } });
  }
};
