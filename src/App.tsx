import React, { useEffect, useReducer } from "react";
import { DrawContext, initialState } from "./contexts/DrawContext";
import { DrawActions } from "./reducers/actionTypes";
import { drawReducer } from "./reducers/drawReducers";
import "./App.css";
import Line from "./components/Line";
import { initCanvas, handleMouseUp, handleMouseDown } from "./helpers/helpers";
import Circle from "./components/Circle";
import Text from "./components/Text";
import { Modes } from "./types/types";

const App: React.FC = () => {
  const [state, dispatch] = useReducer(drawReducer, initialState);

  useEffect(() => {
    const canvas = initCanvas();
    dispatch({ type: DrawActions.INIT_CANVAS, payload: canvas });
  }, []);

  useEffect(() => {
    const handleMouseUpWrapper = (event: MouseEvent) =>
      handleMouseUp(event, state, dispatch);
    const handleMouseDownWrapper = () => handleMouseDown(state, dispatch);

    if (state.canvas) {
      state.canvas.on("mouseup", handleMouseUpWrapper);
      state.canvas.on("mousedown", handleMouseDownWrapper);
    }

    return () => {
      if (state.canvas) {
        state.canvas.off("mouseup", handleMouseUpWrapper);
        state.canvas.off("mousedown", handleMouseDownWrapper);
      }
    };
  }, [state, dispatch]);

  return (
    <DrawContext.Provider value={{ state, dispatch }}>
      <div style={{ width: "100%", height: "100vh" }}>
        <svg id="canvas" style={{ width: "100%", height: "100%" }} />
        {state.currentLine?.start && state.drawMode !== Modes.CREATE && (
          <>
            <Circle
              key={`circle-start-${state.currentLine.id}`}
              x={state.currentLine.start.x}
              y={state.currentLine.start.y}
            />
            <Text
              key={`text-start-${state.currentLine.id}`}
              x={state.currentLine.start.x}
              y={state.currentLine.start.y}
              label="A"
            />
          </>
        )}
        {state?.selectedLine?.end && state.drawMode !== Modes.CREATE && (
          <>
            <Circle
              key={`circle-end-${state.selectedLine.id}`}
              x={state.selectedLine.end.x}
              y={state.selectedLine.end.y}
            />
            <Text
              key={`text-end-${state.selectedLine.id}`}
              x={state.selectedLine.end.x}
              y={state.selectedLine.end.y}
              label="B"
            />
          </>
        )}
        {state.lines.map((line) => (
          <Line
            key={`line-${line.id}`}
            id={line.id}
            start={line.start}
            end={line.end}
          />
        ))}
        {state.selectedLine && (
          <ul className="line-data">
            <li>
              Line <div>{state.selectedLine.id}</div>
            </li>
            <li>
              Length <div>{state.selectedLine.length} CM</div>
            </li>
            <li>
              Angle{" "}
              <div>
                {state.selectedLine.angle} <sup>0</sup>
              </div>
            </li>
          </ul>
        )}
      </div>
    </DrawContext.Provider>
  );
};

export default App;
