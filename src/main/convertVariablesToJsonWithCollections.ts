import merge from "lodash.merge";
import { ModesType } from "../common/types";
import { arrayToNestedObject } from "./utils";
import { convertVariableValueWithPrefix } from "./figma-repository/variable-converters";
import { getCollectionVariableName } from "./figma-repository/collections";
import { findModeId } from "./figma-repository/modes";

export const convertAllVariablesToJsonCollections = async (modes: ModesType) => {
  const variables = await figma.variables.getLocalVariablesAsync();
  let jsonVariables = {};

  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i];
    const collectionName = await getCollectionVariableName(variable.variableCollectionId)

    const path = [collectionName, ...variable.name.split("/")];
    const variableModes = Object.keys(variable.valuesByMode);
    const variableCollectionId = variable.variableCollectionId;
  
    const modeId = findModeId(modes, variableCollectionId)
    const rawValue = variable.valuesByMode[modeId];

    const object = arrayToNestedObject(path, await convertVariableValueWithPrefix(rawValue));
    jsonVariables = merge(jsonVariables, object);
  }

  return jsonVariables;
};

