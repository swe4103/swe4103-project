# <p align="center">SWE4103 Project (To Be Named)</p>

<p align="center"><- We can come up with a fun product name if you guys want -></p>
<p align="center"><- Logo when we have one -></p>
<p align="center">A Development Team Dashboard, specifically suited for student team projects, to track team and team member productivity, and sentiment as they move through a course project. 
(More details to be added as feature are implemented)</p>

## 🧭 Table of Contents

- [SWE4103 Project](#swe4103-project)
  - [Table of Contents](#-table-of-contents)
  - [Team](#-team)
  - [Technologies & Architecture](#️-technologies--architecture)
  - [Directory Structure](#-directory-structure)
  - [Contributing](#-contributing)
  - [Local Run](#-local-run)
    - [Prerequisites](#prerequisites)
      - [Windows](#windows)
      - [macOS](#macos)
    - [Steps](#steps)

## 👥 Team

| Name                  | Roles                                             | Responsibilities                                                                                                                              |
| --------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Jacob Pembleton**   | Product Owner                                     | Defining product vision, managing the backlog, prioritizing features                                                                          |
| **Micheal Bridgland** | Scrum Master                                      | Facilitating Scrum process, ensuring adherence to Agile principles                                                                            |
| **Aiden Foster**      | Lead Developer                                    | Compiling documentation, answering questions, developing features                                                                             |
| **Alex Groom**        | Lead Developer                                    | Compiling documentation, answering questions, developing features                                                                             |
| **Eric Cuenat**       | Lead Developer, DevOps Engineer                   | Compiling documentation, answering questions, developing features, Building CICD pipeline and facilitating cloud architecture                 |
| **Matthew Collett**   | Lead Developer, DevOps Engineer                   | Compiling documentation, answering questions, developing features, Building CICD pipeline and facilitating cloud architecture                 |
| **Lucas Savoie**      | Developer, Integration Testing                    | Contributing documentation, developing features, fixing bugs, building test suites, validating unit tests                                     |
| **Jonathan Eddie**    | Developer, Integration Testing, Assurance Testing | Contributing documentation, developing features, fixing bugs, feature validation, demonstrations, building test suites, validating unit tests |
| **Lin Samman**        | Developer                                         | Contributing documentation, developing features, fixing bugs                                                                                  |
| **Gopika Shrivastav** | Developer                                         | Contributing documentation, developing features, fixing bugs                                                                                  |
| **Pierre Mebande**    | Developer                                         | Contributing documentation, developing features, fixing bugs                                                                                  |

## 🛠️ Technologies & Architecture

For details on technologies and architecture, please refer to [Technologies & Architecture](https://github.com/swe4103/swe4103-project/blob/main/docs/tech-arch.md)

## 🏗️ Directory Structure

- `.circleci/`
  - CircleCI config
- `.github/`
  - GitHub related config. For example the pull request template. If we end up using any GitHub Actions, they will also live in here.
- `.husky/`
  - Husky config for pre-commit hooks
- `api/`
  - Backend Express.js API Server. Created following [How to structure an Express.js REST API with best practices](https://blog.treblle.com/egergr/)
  - Refer to [`api/README.md`](https://github.com/swe4103/swe4103-project/blob/main/api/README.md)
- `assets/`
  - Global static assets like images
- `client/`
  - React js framework is used to build the UI, all front end code will be stored under this directory
  - Refer to [`client/README.md`](https://github.com/swe4103/swe4103-project/blob/main/client/README.md)
- `docs/`
  - Documentation related to project specification
- `.gitignore`
  - Files or directories that git ignores
- `.nvmrc`
  - Defines the Node.js version for a project
- `prettierrc.json`
  - Prettier config
- `CONTRIBUTING.md`
  - Document outlining contribution guidelines
- `docker-compose.yaml`
  - Docker compose file to define and run both containers
- `package.json`
  - Root level package.json file
  - Specific to Node.js and JavaScript projects, used to manage dependencies, scripts, and project metadata
  - Uses yarn workspaces and created following [Yarn Workspaces: Organize Your Project’s Codebase Like A Pro](https://www.smashingmagazine.com/2019/07/yarn-workspaces-organize-project-codebase-pro/)
- `README.md`
  - This :-)
- `yarn.lock`
  - Created by Yarn to ensure consistent dependency versions across environments

## ⛑️ Contributing

For guidlines and instructions on contributing, please refer to [CONTRIBUTING.md](https://github.com/swe4103/swe4103-project/blob/main/CONTRIBUTING.md)

## 🚀 Local Run

### Prerequisites

- **Node.js** and **Yarn** must be installed on your machine. You can verify if you have these by running the following commands

```bash
node -v
yarn -v
nvm -v  # For Windows, use 'nvm version'
```

#### Windows

- You can download Node.js from the official [Node.js website](https://nodejs.org/en)
- After installing Node.js, install Node Version Manager (`nvm`) by following [this guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)
- After installing Node.js, install Yarn by running

```bash
npm install -g yarn
```

#### macOS

- On macOS, you can install Node.js via Homebrew

```bash
brew install node
```

- To install Node Version Manager (`nvm`), also use Homebrew

```bash
brew install nvm
```

**Note**: I had some issues with nvm not being added to my path, so if after installing you still cannot run `nvm -v`, add it to your path and try again

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
```

- To install Yarn, also use Homebrew

```bash
brew install yarn
```

- If you do not have Homebrew on your mac, I would highly recommend installing it [here](https://brew.sh/).

### Steps

1. First, start by cloning this repository to your local machine

```bash
git clone https://github.com/swe4103/swe4103-project.git
```

2. Navigate into the project directory

```bash
cd swe4103-project
```

3. Install and use the version of node specified in the `.nvmrc` file by running the following commands

```bash
nvm install
nvm use
```

4. Install the necessary dependencies

```bash
yarn install
```

5. At this point, you can run either just the client (frontend React.js application), just the server (backend Express.js API), or you can run them concurrently, communicating with eachother

**Client**

```bash
yarn run client
```

Client application should be running at `http://localhost:5173`

**Server (API)**

```bash
yarn run api
```

API server application should be running at `http://localhost:3000`

**Both**

```bash
yarn run dev
```

This will run both the client and the API server concurrently communicating with eachother in the foreground.
