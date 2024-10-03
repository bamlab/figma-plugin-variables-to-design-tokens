import merge from "lodash.merge";
import { ModesType } from "../common/types";
import { arrayToNestedObject } from "./utils";
import { convertVariableValueWithPrefix } from "./variable-converters";
import { getCollectionVariableName } from "./getCollectionVariableName";

function findModeId(modes: ModesType, variableCollectionId: string, variableModes: string[]) {
  const foundMode = modes.find((mode) => mode.collectionId === variableCollectionId)

  if (!foundMode) {
    throw new Error('Mode not found for collection ' + variableCollectionId)
  }
  const modeId = foundMode.modeId;

  return modeId;
}

export const convertAllVariablesToJsonCollections = async (modes: ModesType) => {
  const variables = await figma.variables.getLocalVariablesAsync();
  let jsonVariables = {};

  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i];
    const collectionName = await getCollectionVariableName(variable.variableCollectionId)

    const path = [collectionName, ...variable.name.split("/")];
    const variableModes = Object.keys(variable.valuesByMode);
    const variableCollectionId = variable.variableCollectionId;
  
    const modeId = findModeId(modes, variableCollectionId, variableModes)
    const rawValue = variable.valuesByMode[modeId];

    const object = arrayToNestedObject(path, await convertVariableValueWithPrefix(rawValue));
    jsonVariables = merge(jsonVariables, object);
  }

  return jsonVariables;
};

