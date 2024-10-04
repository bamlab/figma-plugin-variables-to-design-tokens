import { emit, on, showUI } from "@create-figma-plugin/utilities";
import { ConvertHandler, ModesType } from "../common/types";
import { convertToCode } from "./transformation/convertToCode";

export default async function () {
  on<ConvertHandler>("CONVERT_VARIABLES_TO_JSON", async (modes) => {
    const code = await convertToCode(modes)

    emit("CONVERSION_DONE", code);
  });

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const uiCollections = collections.map(({ id, name, modes }) => ({
    id,
    name,
    modes: modes.map(({ modeId, name }) => ({ modeId, name })),
  }));

  showUI({ height: 500, width: 800 }, { collections: uiCollections });
}
