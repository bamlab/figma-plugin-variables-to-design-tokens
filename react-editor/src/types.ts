import { EventHandler } from "@create-figma-plugin/utilities";

export interface ConvertionDoneHandler extends EventHandler {
  name: "CONVERTION_DONE";
  handler: (data: string) => void;
}
