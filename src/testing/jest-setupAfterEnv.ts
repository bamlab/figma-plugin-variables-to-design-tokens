import { collectionsFixtures } from "./collections-fixtures";
import { variablesFixtures } from "./variables-fixtures";

jest.mock('../main/transformation/formatter')

// @ts-expect-error
global.figma = {
    ui: {
        onmessage: () => {}
    },
    variables: {
        getLocalVariablesAsync: async () => variablesFixtures,
        getLocalVariableCollectionsAsync: async () => collectionsFixtures,
        getVariableCollectionByIdAsync: async (id: string) => collectionsFixtures.find(collection => collection.id === id),
        getVariableById: (id: string) => variablesFixtures.find(variable => variable.id === id),
    }
}