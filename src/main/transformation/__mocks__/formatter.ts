import * as prettier from "prettier";

export const formatCode = (inputCode: string): string => prettier.format(inputCode, { parser: "typescript" });
;
