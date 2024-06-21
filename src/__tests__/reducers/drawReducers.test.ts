import { drawReducer } from "../../reducers/drawReducers";
import { DrawActions } from "../../reducers/actionTypes";
import { IInitialState, Modes } from "../../types/types";
import { describe, it, expect } from "vitest";
import { calculateLineLength } from "../../helpers/helpers";
describe("drawReducer", () => {
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

  it("should handle FINISH_LINE", () => {
    const currentLine = {
      id: 0,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      length: 0,
      angle: 0,
    };
    const newEnd = { x: 1, y: 1 };
    const newState = drawReducer(
      { ...initialState, currentLine },
      {
        type: DrawActions.FINISH_LINE,
        payload: {
          id: 1,
          end: newEnd,
          length: calculateLineLength(
            currentLine.start.x,
            currentLine.start.y,
            newEnd.x,
            newEnd.y
          ),
          angle: 45,
        },
      }
    );

    expect(newState.isDrawing).toBe(false);
    expect(newState.currentLine?.end).toEqual(newEnd);
    expect(newState.lines).toHaveLength(1);
    expect(newState.lines[0]).toEqual({
      id: 1,
      start: currentLine.start,
      end: newEnd,
      length: calculateLineLength(
        currentLine.start.x,
        currentLine.start.y,
        newEnd.x,
        newEnd.y
      ),
      angle: 45,
    });
  });

  it("should handle SELECT_LINE", () => {
    const line = {
      id: 1,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
      length: 1.41,
      angle: 45,
    };
    const stateWithLine = { ...initialState, lines: [line] };
    const newState = drawReducer(stateWithLine, {
      type: DrawActions.SELECT_LINE,
      payload: 1,
    });
    expect(newState.selectedLine).toEqual(line);
  });
});
