module.exports = {
    preset: "ts-jest/presets/default-esm",
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    testEnvironment: "node",
    detectOpenHandles: true, // Helps detect open handles
    verbose: true,
};