enum Modes {
  CREATE = "Create",
  EDIT = "Edit",
  VIEW = "View",
  DRAG = "DRAG",
}

type Plot = {
  x: number;
  y: number;
};

type Line = {
  id: number;
  start: Plot;
  end?: Plot;
  length?: number;
  angle?: number;
};
type Text = {
  x: number;
  y: number;
  label: string;
};
type Circle = {
  x: number;
  y: number;
};

interface IInitialState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas: any;
  isDrawing: boolean;
  drawMode: Modes;
  lines: Line[];
  selectedLine: Line | null | undefined;
  currentLine: Line | null | undefined;
  selectedEdge: boolean;
  isDragging: boolean;
}

export { Modes };
export type { Plot, Text, Circle, Line, IInitialState };
