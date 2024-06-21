/* eslint-disable @typescript-eslint/no-explicit-any */
import { IInitialState, Line } from "../types/types";
import { DrawActions } from "./actionTypes";

function drawReducer(
  state: IInitialState,
  action: { type: DrawActions; payload?: any }
): IInitialState {
  switch (action.type) {
    case DrawActions.INIT_CANVAS:
      return { ...state, canvas: action.payload };
    case DrawActions.SELECT_LINE: {
      const foundLine = state.lines.find(
        (line: Line) => line.id === action.payload
      );
      return {
        ...state,
        selectedLine: foundLine,
      };
    }
    case DrawActions.DESELECT_LINE: {
      return {
        ...state,
        selectedLine: null,
        currentLine: null,
      };
    }
    case DrawActions.CHANGE_MODE:
      return { ...state, drawMode: action.payload };

    case DrawActions.START_LINE:
      return {
        ...state,
        isDrawing: true,
        currentLine: {
          id: 0,
          start: action.payload,
          length: 0,
          angle: 0,
        },
      };
    case DrawActions.FINISH_LINE:
      return {
        ...state,
        isDrawing: false,
        // @ts-expect-error lookup later
        currentLine: { ...state.currentLine, end: action.payload.end },
        lines: [
          ...state.lines,
          {
            id: action.payload.id,
            // @ts-expect-error lookup later
            start: state.currentLine.start,
            end: action.payload.end,
            length: action.payload.length,
            angle: action.payload.angle,
          },
        ],
      };

    case DrawActions.UPDATE_SELECTED_LINE:
      return {
        ...state,
        selectedLine: action.payload,
      };
    case DrawActions.UPDATE_CURRENT_LINE:
      return {
        ...state,
        currentLine: action.payload,
      };
    case DrawActions.UPDATE_LINE:
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.id === action.payload.id ? action.payload : line
        ),
      };
    default:
      throw new Error("Unknown action type");
  }
}

export { drawReducer };
