module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/G*.test.ts', '**/*.test.ts'], // Patrón de búsqueda para archivos de pruebas de TypeScript
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/mailman/'], // Ignorar archivos de pruebas en estas carpetas

};
