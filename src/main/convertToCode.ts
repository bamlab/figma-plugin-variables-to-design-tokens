import * as prettier from "prettier";
import { ModesType } from "../common/types";
import { convertAllVariablesToJsonCollections } from "./convertVariablesToJsonWithCollections";
import { transformBracesToVariables } from "./transformBracesToVariables";

export const convertToCode = async (modes: ModesType) => {
  const wholeObject = await convertAllVariablesToJsonCollections(modes);

  const allVariables = Object.keys(wholeObject).map((key) => {
    // @ts-expect-error
    return `export const ${key} = ${JSON.stringify(wholeObject[key])}`;
  });

  const variablesSplittedWithLineSkip = allVariables.join("\n\n")
  const code = transformBracesToVariables(variablesSplittedWithLineSkip);

  return prettier.format(code, { parser: "babel" });
};
