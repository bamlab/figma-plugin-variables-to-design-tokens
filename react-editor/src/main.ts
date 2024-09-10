import { emit, on, showUI } from "@create-figma-plugin/utilities";
import merge from "lodash.merge";
import rgbHex from "rgb-hex";

function arrayToNestedObject(arr: string[], value: any) {
  return arr.reduceRight((acc, curr) => ({ [curr]: acc }), value);
}

function isVariableAlias(variable: VariableValue): variable is VariableAlias {
  return (variable as VariableAlias).id !== undefined;
}

function isVariableRGB(variable: VariableValue): variable is RGB {
  return (variable as RGBA).a === undefined;
}

function isVariableRGBA(variable: VariableValue): variable is RGBA {
  return (variable as RGBA).a !== undefined;
}

function findVariableValue(
  variableValue: VariableValue,
  variables: Variable[]
) {
  let currentVariableValue = variableValue;
  while (isVariableAlias(currentVariableValue)) {
    const variableId = currentVariableValue.id;
    const variableFound = variables.find(
      (variable) => variable.id === variableId
    );
    if (!variableFound) {
      throw Error(`Variable ID ${variableId} was not found`);
    }

    currentVariableValue =
      variableFound.valuesByMode[Object.keys(variableFound.valuesByMode)[0]];
  }

  return currentVariableValue;
}

function convertVariableValue(variableValue: VariableValue) {
  if (typeof variableValue === "string") {
    return variableValue;
  }

  if (typeof variableValue === "number") {
    return variableValue;
  }

  if (typeof variableValue === "boolean") {
    return variableValue;
  }

  if (isVariableRGB(variableValue)) {
    return (
      "#" +
      rgbHex(
        variableValue.r * 255,
        variableValue.g * 255,
        variableValue.b * 255
      )
    );
  }

  if (isVariableRGBA(variableValue)) {
    return (
      "#" +
      rgbHex(
        variableValue.r * 255,
        variableValue.g * 255,
        variableValue.b * 255,
        variableValue.a
      )
    );
  }

  throw Error(`Variable value type not supported: ${variableValue}`);
}

export default function () {
  on("CONVERT_VARIABLES_TO_JSON", async () => {
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const variables = await figma.variables.getLocalVariablesAsync();
    let jsonVariables = {};

    variables.forEach((variable) => {
      const path = variable.name.split("/");
      // TODO: take the value depending on collections modes
      const rawValue =
        variable.valuesByMode[Object.keys(variable.valuesByMode)[0]];
      const variableValue = findVariableValue(rawValue, variables);
      console.log("variableValue", variableValue);
      console.log("path", path);

      const object = arrayToNestedObject(
        path,
        convertVariableValue(variableValue)
      );
      jsonVariables = merge(jsonVariables, object);
    });

    emit("CONVERTION_DONE", jsonVariables);
  });

  showUI({ height: 1000, width: 320, themeColors: false });
}
