import rgbHex from "rgb-hex";

const isVariableAlias = (variable: VariableValue): variable is VariableAlias =>
  (variable as VariableAlias).id !== undefined;

const isVariableRGB = (variable: VariableValue): variable is RGB =>
  (variable as RGB).r !== undefined;

const isVariableRGBA = (variable: VariableValue): variable is RGBA =>
  (variable as RGBA).a !== undefined;

export const convertVariableValue = (variableValue: VariableValue) => {
  if (
    typeof variableValue === "string" ||
    typeof variableValue === "number" ||
    typeof variableValue === "boolean"
  ) {
    return variableValue;
  }

  if (isVariableRGBA(variableValue)) {
    return `#${rgbHex(
      variableValue.r * 255,
      variableValue.g * 255,
      variableValue.b * 255,
      variableValue.a
    )}`;
  }

  if (isVariableRGB(variableValue)) {
    return `#${rgbHex(
      variableValue.r * 255,
      variableValue.g * 255,
      variableValue.b * 255
    )}`;
  }

  if (isVariableAlias(variableValue)) {
    const variable = figma.variables.getVariableById(variableValue.id);
    return `{${variable?.name.replaceAll("/", ".")}}`;
  }

  throw new Error(`Variable value type not supported: ${variableValue}`);
};
