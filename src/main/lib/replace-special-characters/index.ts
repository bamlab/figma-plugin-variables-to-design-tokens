// Copy paste from https://github.com/robertosousa1/replace-special-characters
// Didn't work with esbuild
import diacritics from './diacritics'

export function replaceSpecialCharacters (text: string): string {
  const diacriticsMap = {}
  for (let i = 0; i < diacritics.length; i++) {
    const letters = diacritics[i].letters
    for (let j = 0; j < letters.length; j++) {
      // @ts-expect-error copy-pasted code
      diacriticsMap[letters[j]] = diacritics[i].base
    }
  }

  function replace (refinedText: string): string {
    if (refinedText) {
      return refinedText.replace(/[^\u0000-\u007E]/g, function (a) {
      // @ts-expect-error copy-pasted code
        return diacriticsMap[a] || a
      })
    }

    return refinedText
  }

  return replace(text)
}
