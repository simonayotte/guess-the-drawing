# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## To be able to run electron
npm install electron@11.2.1 --save-dev
npm install electron@11.2.1 -g
npm install --save-dev electron-packager
npm install -g electron-packager
npm install hammerjs --save
npm install @types/hammerjs --save-dev

## Commands with electron

npm run start:electron --> to open electron app
npm run build:electron --> to create windows application
npm run build:electron-linux --> to create linux application
npm run build:electron-mac --> to create mac application