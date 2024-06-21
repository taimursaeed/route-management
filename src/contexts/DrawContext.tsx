import { createContext } from "react";
import { IInitialState, Modes } from "../types/types";

const initialState: IInitialState = {
  canvas: null,
  isDrawing: false,
  drawMode: Modes.CREATE,
  lines: [],
  selectedLine: null,
  currentLine: null,
  selectedEdge: false,
  isDragging: false,
};

const DrawContext = createContext<{
  state: IInitialState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export { DrawContext, initialState };
