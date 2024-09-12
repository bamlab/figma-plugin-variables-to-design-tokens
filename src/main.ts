import { emit, on, showUI } from "@create-figma-plugin/utilities";
import merge from "lodash.merge";
import rgbHex from "rgb-hex";
import { ConvertHandler } from "./types";

function arrayToNestedObject(arr: string[], value: any) {
  return arr.reduceRight((acc, curr) => ({ [curr]: acc }), value);
}

function isVariableAlias(variable: VariableValue): variable is VariableAlias {
  return (variable as VariableAlias).id !== undefined;
}

function isVariableRGB(variable: VariableValue): variable is RGB {
  return (variable as RGB).r !== undefined;
}

function isVariableRGBA(variable: VariableValue): variable is RGBA {
  return (variable as RGBA).a !== undefined;
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

  if (isVariableAlias(variableValue)) {
    const variable = figma.variables.getVariableById(variableValue.id);
    return `{${variable?.name.replaceAll("/", ".")}}`;
  }

  throw Error(`Variable value type not supported: ${variableValue}`);
}

export default async function () {
  on<ConvertHandler>("CONVERT_VARIABLES_TO_JSON", async (modes) => {
    console.log("modes", modes);
    const variables = await figma.variables.getLocalVariablesAsync();
    let jsonVariables = {};

    variables.forEach((variable) => {
      const path = variable.name.split("/");
      const variableModes = Object.keys(variable.valuesByMode);
      const variableCollectionId = variable.variableCollectionId;
      path.push("value");
      let object = {};
      const rawValue =
        variable.valuesByMode[
          modes.find((mode) => mode.collectionId == variableCollectionId)
            ?.modeId ?? variableModes[0]
        ];
      object = arrayToNestedObject(path, convertVariableValue(rawValue));

      jsonVariables = merge(jsonVariables, object);
    });

    emit("CONVERTION_DONE", jsonVariables);
  });

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const uiCollections = collections.map((collection) => {
    return {
      id: collection.id,
      name: collection.name,
      modes: collection.modes.map((mode) => {
        return {
          modeId: mode.modeId,
          name: mode.name,
        };
      }),
    };
  });
  showUI({ height: 1000, width: 1000 }, { collections: uiCollections });
}
