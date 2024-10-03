import camelCase from 'lodash.camelcase';
import { replaceSpecialCharacters } from './lib/replace-special-characters';

// Function to strip leading non-letter characters
const stripLeadingNonLetters = (str: string): string => {
  return str.replace(/^[^a-zA-Z]+/, '');
};

// Function to remove non-alphanumeric characters
const removeNonAlphanumeric = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9]+/g, '');
};

// Main function to process the string
export const toCamelCaseVariable = (input: string): string => {
  // Step 1: Strip leading characters that are not letters
  let processed = stripLeadingNonLetters(input);

  // Step 2: Replace special characters (e.g., é -> e)
  processed = replaceSpecialCharacters(processed);

  // Step 3: Convert to camelCase using lodash.camelcase
  processed = camelCase(processed);

  // Step 4: Remove any remaining non-alphanumeric characters
  processed = removeNonAlphanumeric(processed);

  return processed;
};

// // Example usage
// const inputString = "🙌Hello-éxample_string!👍";
// const camelCaseVariable = toCamelCaseVariable(inputString);

// console.log(camelCaseVariable); // Outputs: "helloExampleString"