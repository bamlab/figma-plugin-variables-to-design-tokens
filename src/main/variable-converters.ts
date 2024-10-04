import rgbHex from "rgb-hex";
import { getCollectionVariableName } from "./getCollectionVariableName";

const isVariableAlias = (variable: VariableValue): variable is VariableAlias =>
  (variable as VariableAlias).id !== undefined;

const isVariableRGB = (variable: VariableValue): variable is RGB =>
  (variable as RGB).r !== undefined;

const isVariableRGBA = (variable: VariableValue): variable is RGBA =>
  (variable as RGBA).a !== undefined;


export const convertVariableValueWithPrefix = async (variableValue: VariableValue) => {
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

    if (!variable?.variableCollectionId) {
      throw new Error("Variable collection id not found");
    }

    const prefix = await getCollectionVariableName(variable?.variableCollectionId);

    return `{${prefix}.${variable?.name.replaceAll("/", ".")}}`;
  }

  throw new Error(`Variable value type not supported: ${variableValue}`);
};