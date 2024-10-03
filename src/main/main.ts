import { emit, on, showUI } from "@create-figma-plugin/utilities";
import merge from "lodash.merge";
import rgbHex from "rgb-hex";
import { ConvertHandler } from "../common/types";

const arrayToNestedObject = (arr: string[], value: any) =>
  arr.reduceRight((acc, curr) => ({ [curr]: acc }), value);

const isVariableAlias = (variable: VariableValue): variable is VariableAlias =>
  (variable as VariableAlias).id !== undefined;

const isVariableRGB = (variable: VariableValue): variable is RGB =>
  (variable as RGB).r !== undefined;

const isVariableRGBA = (variable: VariableValue): variable is RGBA =>
  (variable as RGBA).a !== undefined;

const convertVariableValue = (variableValue: VariableValue) => {
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

export default async function () {
  on<ConvertHandler>("CONVERT_VARIABLES_TO_JSON", async (modes) => {
    const variables = await figma.variables.getLocalVariablesAsync();
    let jsonVariables = {};

    variables.forEach((variable) => {
      const path = [...variable.name.split("/"), "value"];
      const variableModes = Object.keys(variable.valuesByMode);
      const variableCollectionId = variable.variableCollectionId;

      const rawValue =
        variable.valuesByMode[
          modes.find((mode) => mode.collectionId === variableCollectionId)
            ?.modeId ?? variableModes[0]
        ];

      const object = arrayToNestedObject(path, convertVariableValue(rawValue));
      jsonVariables = merge(jsonVariables, object);
    });

    emit("CONVERSION_DONE", jsonVariables);
  });

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const uiCollections = collections.map(({ id, name, modes }) => ({
    id,
    name,
    modes: modes.map(({ modeId, name }) => ({ modeId, name })),
  }));

  showUI({ height: 1000, width: 1000 }, { collections: uiCollections });
}
