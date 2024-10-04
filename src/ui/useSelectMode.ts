import { useState } from "preact/hooks";
import { CollectionType } from "./types";

interface HandleChangeParams {
  name: string;
  collectionId: string;
  modeId: string;
}

export const useModesSelection = (collections: CollectionType[]) => {
  const [selectedModes, rawSetSelectedModes] = useState<{
    [key: string]: { modeId: string; name: string };
  }>(
    collections.reduce(
      (acc, { id, modes }) => ({
        ...acc,
        [id]: { modeId: modes[0].modeId, name: modes[0].name },
      }),
      {}
    )
  );

  const setSelectedModes = ({
    name,
    collectionId,
    modeId,
  }: HandleChangeParams) => {
    rawSetSelectedModes((prev) => ({
      ...prev,
      [collectionId]: { modeId, name },
    }));
  };

  return { selectedModes, setSelectedModes };
};
