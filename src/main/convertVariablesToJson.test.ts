import { convertAllVariablesToJson } from "./convertVariablesToJson";

describe("convertVariablesToJson", () => {
  it("brand 1 light mode", async () => {
    const result = await convertAllVariablesToJson([
      {
        collectionId: "VariableCollectionId:1:41",
        modeId: "1:0",
        modeName: "brand",
      },
      {
        collectionId: "VariableCollectionId:6:527",
        modeId: "6:0",
        modeName: "brand 1 - light-mode",
      },
      {
        collectionId: "VariableCollectionId:18:890",
        modeId: "18:0",
        modeName: "brand 1",
      },
      {
        collectionId: "VariableCollectionId:178:1251",
        modeId: "178:0",
        modeName: "brand 1",
      },
    ]);

    expect(result).toMatchSnapshot();
  });

  it("brand 1 dark mode", async () => {
    const result = await convertAllVariablesToJson([
      {
        collectionId: "VariableCollectionId:1:41",
        modeId: "1:0",
        modeName: "brand",
      },
      {
        collectionId: "VariableCollectionId:6:527",
        modeId: "638:0",
        modeName: "brand 1 - dark-mode",
      },
      {
        collectionId: "VariableCollectionId:18:890",
        modeId: "18:0",
        modeName: "brand 1",
      },
      {
        collectionId: "VariableCollectionId:178:1251",
        modeId: "178:0",
        modeName: "brand 1",
      },
    ]);

    expect(result).toMatchSnapshot();
  });

  it("brand 2 light mode", async () => {
    const result = await convertAllVariablesToJson([
      {
        collectionId: "VariableCollectionId:1:41",
        modeId: "1:0",
        modeName: "brand",
      },
      {
        collectionId: "VariableCollectionId:6:527",
        modeId: "2079:1",
        modeName: "brand 2 - light-mode",
      },
      {
        collectionId: "VariableCollectionId:18:890",
        modeId: "2079:3",
        modeName: "brand 2",
      },
      {
        collectionId: "VariableCollectionId:178:1251",
        modeId: "2079:4",
        modeName: "brand 2",
      },
    ]);

    expect(result).toMatchSnapshot();
  });

  it("brand 2 dark mode", async () => {
    const result = await convertAllVariablesToJson([
      {
        collectionId: "VariableCollectionId:1:41",
        modeId: "1:0",
        modeName: "brand",
      },
      {
        collectionId: "VariableCollectionId:6:527",
        modeId: "2079:2",
        modeName: "brand 2 - dark-mode",
      },
      {
        collectionId: "VariableCollectionId:18:890",
        modeId: "2079:3",
        modeName: "brand 2",
      },
      {
        collectionId: "VariableCollectionId:178:1251",
        modeId: "2079:4",
        modeName: "brand 2",
      },
    ]);

    expect(result).toMatchSnapshot();
  });
});
