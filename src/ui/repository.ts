import { ModeType } from "./types";

export const findModeId = (modes: ModeType[], modeName: string) => {
  const result = modes.find((mode) => mode.name === modeName)?.modeId;
  if (!result) {
    throw new Error("Mode not found");
  }

  return result
};

