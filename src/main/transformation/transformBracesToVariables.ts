export function transformBracesToVariables(input: string): string {
  return input.replaceAll(/"{(.*?)}"/g, (_, match) => {
    return match.split('.').map((part: string, index: number) => {
      return index === 0 ? part : `['${part}']`;
    }).join('');
  });
}