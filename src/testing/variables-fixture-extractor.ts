/**
 * Use this function to print the values of variables
 * It might get handy again as I didn't export all the variable properties
 * 
 * Without this function, all properties except for the id are omitted :'(
 */
export const convertVariablesToCopiableString = (variables: Variable[]) => {
  const converted = variables.map((variable) => {
    return {
      id: variable.id,
      name: variable.name,
      valuesByMode: variable.valuesByMode,
    };
  });

  console.log("converted", JSON.stringify(converted));
};
