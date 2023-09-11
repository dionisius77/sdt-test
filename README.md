## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm i -g @nest/cli
$ npm install
```

## Creating new service

```bash
$ nest generate app {{service_name}}
```

## Creating new shared library

```bash
$ nest generate library {{library_name}}
```

## Running the app

Please following step by step
```bash
# development
$ nest start {{service_name}} --watch
```
Then open http://localhost:3001/api-docs

## Running the app with docker compose

Please following step by step
```bash
$ docker compose up -d
```
Then open http://localhost:3001/api-docs

## Insert Timezone
Copy from constants/timezone.json
Paste to Post Timezone in api swagger docs

## License

Nest is [MIT licensed](LICENSE).
