import { emit, on, showUI } from "@create-figma-plugin/utilities";
import merge from "lodash.merge";

function arrayToNestedObject(arr: string[]) {
  return arr.reduceRight((acc, curr) => ({ [curr]: acc }), {});
}

export default function () {
  on("CONVERT_VARIABLES_TO_JSON", async () => {
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const variables = await figma.variables.getLocalVariablesAsync();
    let jsonVariables = {};

    variables.forEach((variable) => {
      const path = variable.name.split("/");

      const object = arrayToNestedObject(path);
      jsonVariables = merge(jsonVariables, object);
    });

    emit("CONVERTION_DONE", jsonVariables);
  });

  showUI({ height: 240, width: 320, themeColors: false });
}
