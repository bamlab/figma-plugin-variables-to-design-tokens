/**
 * Given ['radio-button', 'padding', 'value'] and 123, returns { 'radio-button': { padding: { value: 123 } } }
 */
export const arrayToNestedObject = (arr: string[], value: any) =>
  arr.reduceRight((acc, curr) => ({ [curr]: acc }), value);
