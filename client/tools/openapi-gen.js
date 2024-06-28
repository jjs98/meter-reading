const path = require('path');

const { OpenApiGenerator } = require('@goast/core');
const {
  TypeScriptAngularServicesGenerator,
  TypeScriptEasyNetworkStubsGenerator,
  TypeScriptModelsGenerator,
  TypeScriptClientsGenerator,
} = require('@goast/typescript');

new OpenApiGenerator({ outputDir: path.join(__dirname, '../src/app/api') })
  .useType(TypeScriptModelsGenerator, {
    typeNameCasing: { casing: 'pascal', prefix: 'Api' },
  })
  .useType(TypeScriptAngularServicesGenerator, { provideKind: 'provide-fn' })
  .useType(TypeScriptEasyNetworkStubsGenerator)
  .useType(TypeScriptClientsGenerator)
  .parseAndGenerate(path.join(__dirname, '../../server/WebApi/WebApi.json'));
