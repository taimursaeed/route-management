import React, { useEffect, useContext, useRef } from "react";
import { Line as SvgLine } from "@svgdotjs/svg.js";
import { DrawContext } from "../contexts/DrawContext";
import { Line, Modes } from "../types/types";
import { DrawActions } from "../reducers/actionTypes";
import { calculateLineAngle, calculateLineLength } from "../helpers/helpers";

const LineComponent: React.FC<Line> = ({ id, start, end }) => {
  const { state, dispatch } = useContext(DrawContext);
  const selectedLineRef = useRef(state.selectedLine);
  const EDGE_THRESHOLD = 20;

  useEffect(() => {
    selectedLineRef.current = state.selectedLine;
  }, [state.selectedLine]);

  useEffect(() => {
    let line: SvgLine;
    if (state.canvas) {
      line = state.canvas
        .line(start.x, start.y, end.x, end.y)
        .stroke({ color: "#0F92E7", width: 4 })
        .id(`line-${id}`)
        .addClass("user-drawn");

      line.on("mousedown", (event: Event) => {
        const mouseEvent = event as MouseEvent;
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();

        dispatch({ type: DrawActions.SELECT_LINE, payload: id });
        dispatch({ type: DrawActions.CHANGE_MODE, payload: Modes.DRAG });

        const { clientX: clickX, clientY: clickY } = mouseEvent;

        //if click was made within the threshold area of start or end edges
        const isOnStartEdge =
          clickX >= start.x - EDGE_THRESHOLD &&
          clickX <= start.x + EDGE_THRESHOLD &&
          clickY >= start.y - EDGE_THRESHOLD &&
          clickY <= start.y + EDGE_THRESHOLD;

        const isOnEndEdge =
          clickX >= end.x - EDGE_THRESHOLD &&
          clickX <= end.x + EDGE_THRESHOLD &&
          clickY >= end.y - EDGE_THRESHOLD &&
          clickY <= end.y + EDGE_THRESHOLD;

        const isOnTheLine = !isOnStartEdge && !isOnEndEdge;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const { clientX: nextX, clientY: nextY } = moveEvent;

          let newStart = start;
          let newEnd = end;

          if (isOnStartEdge) {
            // makes end edge as basis for rotation
            newStart = { x: nextX, y: nextY };
          } else if (isOnEndEdge) {
            // makes start edge as basis for rotation
            newEnd = { x: nextX, y: nextY };
          } else if (isOnTheLine) {
            //update both edges values for dragging
            const dx = nextX - clickX;
            const dy = nextY - clickY;
            newStart = { x: start.x + dx, y: start.y + dy };
            newEnd = { x: end.x + dx, y: end.y + dy };
          }

          const length = calculateLineLength(
            newStart.x,
            newStart.y,
            newEnd.x,
            newEnd.y
          );
          const angle = calculateLineAngle(
            newStart.x,
            newStart.y,
            newEnd.x,
            newEnd.y
          );

          line.plot(newStart.x, newStart.y, newEnd.x, newEnd.y);

          dispatch({
            type: DrawActions.UPDATE_SELECTED_LINE,
            payload: {
              ...selectedLineRef.current,
              start: newStart,
              end: newEnd,
              length,
              angle,
            },
          });

          // Update the current line to correctly show the label A for the new selected line
          dispatch({
            type: DrawActions.UPDATE_CURRENT_LINE,
            payload: {
              ...selectedLineRef.current,
              start: newStart,
              end: newEnd,
              length,
              angle,
            },
          });

          dispatch({
            type: DrawActions.UPDATE_LINE,
            payload: selectedLineRef.current,
          });
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      });
    }

    return () => {
      if (line) {
        line.remove();
      }
    };
  }, [start, end, state.canvas, id, dispatch]);

  return null;
};

export default LineComponent;
