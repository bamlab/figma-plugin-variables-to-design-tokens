import { EventHandler } from "@create-figma-plugin/utilities";

export interface ConvertionDoneHandler extends EventHandler {
  name: "CONVERTION_DONE";
  handler: (data: string) => void;
}

export interface ConvertHandler extends EventHandler {
  name: "CONVERT_VARIABLES_TO_JSON";
  handler: (
    modes: { collectionId: string; modeId: string; modeName: string }[]
  ) => void;
}
