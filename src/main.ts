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
  return (variable as RGB).r !== undefined;
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
  on("CONVERT_VARIABLES_TO_JSON", async () => {
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const collectionsModes = collections.flatMap((collection) => {
      return collection.modes;
    }, []);
    const variables = await figma.variables.getLocalVariablesAsync();
    let jsonVariables = {};

    variables.forEach((variable) => {
      const path = variable.name.split("/");
      path.push("value");
      let object = {};
      // switch (Object.keys(variable.valuesByMode).length) {
      //   case 0:
      //     return;
      //   case 1:
      const rawValue =
        variable.valuesByMode[Object.keys(variable.valuesByMode)[0]];
      // const variableValue = findVariableValue(rawValue, variables);

      object = arrayToNestedObject(path, convertVariableValue(rawValue));
      jsonVariables = merge(jsonVariables, object);
      //     break;
      //   default:
      //     let objectByMode = {};
      //     Object.keys(variable.valuesByMode).forEach((modeId) => {
      //       const mode = collectionsModes.find(
      //         (mode) => mode.modeId === modeId
      //       );
      //       if (!mode) {
      //         return;
      //       }
      //       const rawValue = variable.valuesByMode[modeId];
      //       const variableValue = findVariableValue(rawValue, variables);
      //       objectByMode = merge(objectByMode, {
      //         [mode.name]: convertVariableValue(variableValue),
      //       });
      //     });
      //     object = arrayToNestedObject(path, objectByMode);
      //     jsonVariables = merge(jsonVariables, object);
      // }

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
