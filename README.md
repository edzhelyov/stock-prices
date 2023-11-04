## Dependencies

* Node (18.18.1)
* Typescript (5.2.2)
* NestJS (10.2.1)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Architecture and design decisions

All design decisions are influenced by the following two factors: I don't have any prior NestJS knowledge and I don't want to spend a lot of time on the task. With that in mind, I will try to understand the minimal context required to implement a basic NestJS, but some techniques might not be the best practices in the framework.
Regardless, I want this code to be production ready, so it will follow proper separation of concerns.

At the moment I use only e2e testing which gives us the best confidence the application is working and enable easy refactoring.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
