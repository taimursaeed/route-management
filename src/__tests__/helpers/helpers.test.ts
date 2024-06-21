import { it, expect } from "vitest";
import { calculateLineLength } from "../../helpers/helpers";
it("calculateLineLength should return the correct length", () => {
  const length = calculateLineLength(0, 0, 3, 4);
  expect(length).toBe(5);
});
