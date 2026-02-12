[![Build Status](https://img.shields.io/github/actions/workflow/status/jjs98/meter-reading/build.yml?branch=main&style=for-the-badge)](https://github.com/jjs98/meter-reading/actions/workflows/build.yml)
[![Codecov](https://img.shields.io/codecov/c/github/jjs98/meter-reading?style=for-the-badge)](https://codecov.io/gh/jjs98/meter-reading)

# Meter Reading

This is a simple project to track the meter readings of a house. You can add readings for electricity, gas and water and see the history of the readings. If you have multiple people living in the house, you can also share the readings with them, so that everyone can see the history of the readings. (For example the electricity readings for the house)

You can also see the usage of the utilities in a graph. This way you can see how much you are using and if you are using more or less than before.

Also you can download the readings in a .xlsx file, so that you can use the data in other applications or share them with your landlord.

## How to run the project

### Build the client

This project uses pnpm as the package manager.

- run `pnpm install` to install the dependencies.
- run `pnpm build` to build the client.
- run `pnpm start` to start the client.

### Build the server

The server uses .NET 10 so just open the Solution and run the project.

## Tests

### Client

The client uses Jest and playwright for testing.

- run `pnpm test` to run the tests.

### Server

The server uses TUnit for testing. Also TestContainers is used to run the tests in a real database.

## Shoutouts

- Thanks to [NGneers](https://github.com/NGneers) for [signal-translate](https://github.com/NGneers/signal-translate).
- Thanks to [MaSch0212](https://github.com/MaSch0212) for creating the [gOAst](https://github.com/MaSch0212/goast) tooling to create api code out of an openapi file.
