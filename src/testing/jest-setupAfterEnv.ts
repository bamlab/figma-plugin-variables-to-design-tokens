import { variablesFixtures } from "./variables-fixtures";

// @ts-expect-error
global.figma = {
    ui: {
        onmessage: () => {}
    },
    variables: {
        getLocalVariablesAsync: async () => variablesFixtures,
        getLocalVariableCollectionsAsync: async () => [],
        getVariableById: (id: string) => variablesFixtures.find(variable => variable.id === id),
    }
}