import { convertToCode } from "./convertToCode";

describe("convertToCode", () => {
  it("brand 1 light mode", async () => {
    const result = await convertToCode([
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
});
