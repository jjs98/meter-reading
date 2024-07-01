import path from 'path';
import { OpenApiGenerator } from '@goast/core';
import {
  TypeScriptAngularServicesGenerator,
  TypeScriptEasyNetworkStubsGenerator,
  TypeScriptModelsGenerator,
  TypeScriptClientsGenerator,
} from '@goast/typescript';

export async function main(): Promise<void> {
  const x = await new OpenApiGenerator({
    outputDir: path.join(__dirname, '../src/app/api'),
  })
    .useType(TypeScriptModelsGenerator, {
      typeNameCasing: { casing: 'pascal' },
      immutableTypes: false      
    })
    .useType(TypeScriptAngularServicesGenerator, { provideKind: 'provide-fn' })
    .useType(TypeScriptEasyNetworkStubsGenerator)
    .useType(TypeScriptClientsGenerator, { clientFileKind: 'class-and-interface' })
    .parseAndGenerate(path.join(__dirname, '../../server/WebApi/WebApi.json'));
}

main();