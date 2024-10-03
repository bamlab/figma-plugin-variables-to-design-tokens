import { emit, on, showUI } from "@create-figma-plugin/utilities";
import { ConvertHandler, ModesType } from "../common/types";
import { convertAllVariablesToJson } from "./convertVariablesToJson";

export default async function () {
  on<ConvertHandler>("CONVERT_VARIABLES_TO_JSON", async (modes) => {
    const jsonVariables = await convertAllVariablesToJson(modes)

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
