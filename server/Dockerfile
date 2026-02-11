FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Bootstrap/Bootstrap.csproj Bootstrap/
COPY Presentation/Presentation.csproj Presentation/
COPY Application/Application.csproj Application/
COPY Domain/Domain.csproj Domain/
COPY Infrastructure/Infrastructure.csproj Infrastructure/

RUN dotnet restore Bootstrap/Bootstrap.csproj
RUN dotnet restore Presentation/Presentation.csproj
RUN dotnet restore Application/Application.csproj
RUN dotnet restore Domain/Domain.csproj
RUN dotnet restore Infrastructure/Infrastructure.csproj

COPY . .

WORKDIR /src/Bootstrap
RUN dotnet publish -c release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Bootstrap.dll"]