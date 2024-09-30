# Technologies & Architecture

This document outlines the technolgies used in this project, and the underlying architecture in which it is built upon.

## Technologies

- [**Node.js**](https://nodejs.org/en)
  - JavaScript runtime environment

### Frontend

- [**React.js**](https://react.dev/)
  - Frontend JavaScript library
- [**Bootstrap**](https://getbootstrap.com/)
  - CSS framework
  - Documentation on how it was setup within the app https://getbootstrap.com/docs/5.2/getting-started/vite/

### Backend

- [**Express.js**](https://expressjs.com/)
  - Backend web application framework
- [**SQLite**](https://www.sqlite.org/)
  - Embedded on-disk SQL database engine

### Development & Quality Tools

- [**ESLint**](https://eslint.org/)
  - JavaScript linting tool
- [**Prettier**](https://prettier.io/)
  - Opinionated code formatter
- [**Husky**](https://typicode.github.io/husky/)
  - Git hook manager
- [**Yarn**](https://yarnpkg.com/)
  - JavaScript package manager

### Deployment & Operations

- [**Docker**](https://www.docker.com/)
  - Container service provider for developing, shipping, and running applications
- [**Docker Compose**](https://docs.docker.com/compose/)
  - Tool for defining and running multi-container applications
- [**CircleCI**](https://circleci.com/)
  - Continuous integration and continuous delivery platform
- [**Amazon Web Services (AWS)**](https://aws.amazon.com/)

## Architecture

This project follows a 2-tier **(this may change to 3-tier if we ever decide to migrate to a cloud hosted DB)** client-server architecture. The React frontend handles the user interface and communicates with the Express backend API to manage data and server-side logic. This ensures a clear separation between the presentation and application layers.

<p align="center"><img width="500px" src="../assets/client-server-diagram.png" style="background-color: #ffffff; border-radius: 8px; padding: 24px;" /></p>