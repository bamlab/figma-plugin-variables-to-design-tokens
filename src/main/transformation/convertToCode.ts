import { transformBracesToVariables } from "./transformBracesToVariables";
import { convertAllVariablesToJsonCollections } from "../convertVariablesToJsonWithCollections";
import { ModesType } from "../../common/types";
import { formatCode } from "./formatter";

export const convertToCode = async (modes: ModesType) => {
  const wholeObject = await convertAllVariablesToJsonCollections(modes);

  const allVariables = Object.keys(wholeObject).map((key) => {
    // @ts-expect-error
    return `export const ${key} = ${JSON.stringify(wholeObject[key])} as const`;
  });

  const variablesSplittedWithLineSkip = allVariables.join("\n\n")
  const code = transformBracesToVariables(variablesSplittedWithLineSkip);

  return formatCode(code);
};
