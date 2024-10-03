import { EventHandler } from "@create-figma-plugin/utilities";

export interface ConvertionDoneHandler extends EventHandler {
  name: "CONVERSION_DONE";
  handler: (data: string) => void;
}

export type ModesType = { collectionId: string; modeId: string; modeName: string }[]

export interface ConvertHandler extends EventHandler {
  name: "CONVERT_VARIABLES_TO_JSON";
  handler: (
    modes: ModesType
  ) => void;
}
