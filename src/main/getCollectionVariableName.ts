import { toCamelCaseVariable } from "./toVariableName";

export const getCollectionVariableName = async (collectionId: string): Promise<string> => {
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)

    if (!collection?.name) {
      throw new Error("A collection can't be found")
    }

    return toCamelCaseVariable(collection.name);
}
