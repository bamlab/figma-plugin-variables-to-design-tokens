import { transformBracesToVariables } from "./transformBracesToVariables";

describe("transformBracesToVariables", () => {
  const cases = [
    [`"{primitives.sizes.size-500}"`, `primitives['sizes']['size-500']`],
    [`"{primitives.color.blue.50}"`, `primitives['color']['blue']['50']`],
    [`"{oy.color.blue.700}"`, `oy['color']['blue']['700']`],
    [
      `"{some.object.with.decimal.300}"`,
      `some['object']['with']['decimal']['300']`,
    ],
    [
      `"{some.object.with.decimal.300}"\n\n"{some.object.with.decimal.300}"`,
      `some['object']['with']['decimal']['300']\n\nsome['object']['with']['decimal']['300']`,
    ],
  ];

  test.each(cases)("converts %s to %s", (input, expected) => {
    const output = transformBracesToVariables(input);
    expect(output).toEqual(expected);
  });
});
