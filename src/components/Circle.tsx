import React, { useEffect, useContext } from "react";
import { Circle as SvgCircle } from "@svgdotjs/svg.js";
import { DrawContext } from "../contexts/DrawContext"; // Import your context
import { Circle } from "../types/types";

const CircleComponent: React.FC<Circle> = ({ x, y }) => {
  const { state } = useContext(DrawContext);

  useEffect(() => {
    let circle: SvgCircle | null = null;
    if (state.canvas) {
      circle = state.canvas
        .circle(10)
        .fill("#0F92E7")
        .move(x - 10, y - 5);
    }

    return () => {
      if (circle) {
        circle.remove();
      }
    };
  }, [x, y, state.canvas]);

  return null;
};

export default CircleComponent;
