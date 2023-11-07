## Dependencies

* Node (18.18.1)
* Typescript (5.2.2)
* NestJS (10.2.1)

## Description

The project has a backend using the [NestJS](nestjs.com) framework and a frontend part with React using the [Create React App](https://github.com/facebook/create-react-app).

## Architecture and design decisions

This is what I consider a production ready code, but with the following constraints:

* I don't have prior knowledge of NestJS and latest React eco-system.
* I have spend the minimum amount of time to get the code fully functional and adhere as best as possible to the specific framework practices.
* There are plenty of places that can be done better and more fit to the specific framework, but I have decided to stop there based on the previous two factors.

I have skipped a real end to end tests with Playwright or something similar, but I decided that it is OK to do so. 

The difference is only technical in the way how we would need to setup the backend app and it's data. The integration tests will be similar to the ones in the frontend, but with a real connection to the backend.

## Backend

Go to the `server` folder and run the following commands to start with the project:

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

It will start a web server on http://localhost:3000/.

You can check the max profit funtionality at: http://localhost:3000/api/max-profit?startTime=1672531200&endTime=1672531260

### Test

```bash
# all tests
$ npm run test:all

# e2e tests
$ npm run test:e2e

# module tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Frontend

Go to the `frontend` folder and run the following commands to start with the project:

### Installation

```bash
$ npm install
```

### Running the app 

```bash
$ npm run start
```

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

It is automatically configured to proxy all missing requests to http://localhost:3000 where the backend app runs by default.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Test

```bash
$ npm run test
```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.