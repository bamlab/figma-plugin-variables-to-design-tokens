/**
 * Use this function to print the values of variables
 * It might get handy again as I didn't export all the variable properties
 * 
 * Without this function, all properties except for the id are omitted :'(
 */
export const convertCollectionsToCopiableString = (collections: VariableCollection[]) => {
    const converted = collections.map((collection) => {
      return {
        id: collection.id,
        name: collection.name,
        defaultModeId: collection.defaultModeId,
        modes: collection.modes,
      };
    });
  
    console.log("converted", JSON.stringify(converted));
  };
  