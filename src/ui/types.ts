export type ModeType = { modeId: string; name: string };

export type CollectionType = {
  id: string;
  name: string;
  modes: ModeType[];
};
