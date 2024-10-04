import { ModesType } from "../../common/types";

export function findModeId(modes: ModesType, variableCollectionId: string) {
  const foundMode = modes.find((mode) => mode.collectionId === variableCollectionId)

  if (!foundMode) {
    throw new Error('Mode not found for collection ' + variableCollectionId)
  }
  const modeId = foundMode.modeId;

  return modeId;
}