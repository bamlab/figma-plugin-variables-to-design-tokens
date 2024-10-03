import merge from "lodash.merge";
import { ConvertHandler, ModesType } from "../common/types";
import { arrayToNestedObject } from "./utils";
import { convertVariableValue } from "./variable-converters";

export const convertAllVariablesToJson = async (modes: ModesType) => {
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

  return jsonVariables;
};
