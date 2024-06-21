import React, { useEffect, useContext } from "react";
import { Text as SvgText } from "@svgdotjs/svg.js";
import { DrawContext } from "../contexts/DrawContext";
import { Text as TextType } from "../types/types";

const Text: React.FC<TextType> = ({ x, y, label }) => {
  const { state } = useContext(DrawContext);

  useEffect(() => {
    let text: SvgText | null = null;
    if (state.canvas) {
      text = state.canvas
        .text(label)
        .fill("#000")
        .move(x - 10, y - 30);
    }

    return () => {
      if (text) {
        text.remove();
      }
    };
  }, [x, y, label, state.canvas]);

  return null;
};

export default Text;
