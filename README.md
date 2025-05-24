# Config Server

**English** | [Español](README.es.md)

Centralized configuration server that allows managing and distributing configuration files for different applications and environments.

## Table of Contents

### English
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Basic Authentication](#basic-authentication-configuration)
- [Execution](#execution)
- [Available Endpoints](#available-endpoints)
- [Repository Administration](#repository-administration)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Supported Configuration Formats](#supported-configuration-formats)

## Technologies Used

- **NestJS**: Node.js framework for building efficient and scalable server-side applications.
- **Bun**: Fast JavaScript runtime, v1.2.13.
- **TypeScript**: Typed programming language that compiles to JavaScript.
- **Git**: Version control system.
- **simple-git**: Library for handling Git operations from Node.js.
- **dotenv**: For loading environment variables from .env files.
- **env-var**: Environment variable validation and parsing.

## Installation

### Dependencies

To install project dependencies:

```bash
bun install
```

### Environment Variables

1. Copy the template file to a .env file:

```bash
cp .env.template .env
```

2. Edit the `.env` file with your values:

```dotenv
PORT=3000
PATH_SWAGGER=docs
BASIC_AUTH_USERNAME=admin
BASIC_AUTH_PASSWORD=password
BASE_REPOS_PATH=../repos
GITHUB_USERNAME=your_github_username
GITHUB_TOKEN=your_github_token
```

## Basic Authentication Configuration

The server uses basic authentication (Basic Auth) to protect endpoints. It's necessary to configure the credentials in the `.env` file:

```dotenv
BASIC_AUTH_USERNAME=admin
BASIC_AUTH_PASSWORD=admin
```

These credentials are used to authenticate requests to protected endpoints. When starting the server, an administrator user is automatically created with these credentials.

### How to use authentication in requests

To access protected endpoints, you must include basic authentication credentials in your HTTP requests:

```bash
# Using curl
curl -X GET "http://localhost:3000/directories" -u "admin:password"

# Using Postman
# 1. Select the "Authorization" tab
# 2. Select type "Basic Auth"
# 3. Enter the configured username and password
```

## Execution

To start the server:

```bash
bun run start
```

To run in development mode with automatic reload:

```bash
bun run start:dev
```

## Available Endpoints

### Get Configuration

Gets a configuration file for a specific application.

```
GET /?repo=REPO_NAME&application=APP_NAME&profile=PROFILE
```

**Parameters:**

- `repo`: Repository name (e.g.: test123, testjson)
- `application`: Application name (e.g.: myapp)
- `profile`: Configuration profile (e.g.: default, dev, prod)

**Example:**

```
GET /?repo=test123&application=myapp&profile=dev
```

**Authentication**: This endpoint requires basic authentication.

### List Directories

Lists all directories and files available in the repositories.

```
GET /directories
```

**Authentication**: This endpoint requires basic authentication.

### Synchronize Repositories

Forces the synchronization of all repositories.

```
POST /sync
```

**Authentication**: This endpoint requires basic authentication.

### API Documentation (Swagger)

Access the interactive API documentation through Swagger UI:

```
GET /{PATH_SWAGGER}
```

Where `PATH_SWAGGER` is the value configured in the `.env` file. By default it is `docs`.

Example:
```
GET /docs
```

## Repository Administration

### How to Add New Repositories

To add a new configuration repository:

**Configuration update**: Modify the `repository-manager.config.ts` file to include the new repository:

```typescript
export class RepositoryManagerConfig {
  public static readonly repositoryManager: RepositoryManager[] = [
    // Existing repositories
    {
      name: RepositoryType.GITHUB,
      host: 'github.com',
      protocol: 'https',
      organization: 'sorodriguezz',
      repository: 'testjson',
      branch: 'main',
      auth: {
        username: envs.GITHUB_USERNAME,
        token: envs.GITHUB_TOKEN,
      },
    },
    // Add the new repository
    {
      name: RepositoryType.GITLAB, // Available types are in RepositoryType
      host: 'gitlab.com',
      protocol: 'http',
      organization: 'user',
      repository: 'new-repo',
      branch: 'dev',
      // Optional: add authentication if it's a private repo
      auth: {
        username: envs.GITLAB_USERNAME,
        token: envs.GITLAB_TOKEN,
      },
    },
  ];
}
```

## Environment Variables Configuration

### .env File

The project uses a `.env` file to configure environment variables. The required variables are described below:

| Variable            | Description                                         | Required |
| ------------------- | --------------------------------------------------- | -------- |
| PORT                | Port on which the server will run                   | Yes      |
| BASE_REPOS_PATH     | Path for storing repositories                       | Yes      |
| PATH_SWAGGER        | Path to access Swagger documentation                | Yes      |
| BASIC_AUTH_USERNAME | Username for basic authentication                   | Yes      |
| BASIC_AUTH_PASSWORD | Password for basic authentication                   | Yes      |
| GITHUB_USERNAME     | Username to access GitHub repositories              | Yes      |
| GITHUB_TOKEN        | Personal access token for private GitHub repositories | Yes   |

### Adding or Modifying Environment Variables

To add or modify environment variables, you must:

1. Add the variable in the `.env` file:

```
NEW_VARIABLE=value
```

2. Update the `.env.template` file to document the new variable:

```
NEW_VARIABLE=
```

3. Modify the `src/config/envs.config.ts` file to include the new variable:

```typescript
export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  PATH_SWAGGER: get('PATH_SWAGGER').required().asString(),
  BASE_REPOS_PATH: get('BASE_REPOS_PATH').required().asString(),
  BASIC_AUTH_USERNAME: get('BASIC_AUTH_USERNAME').required().asString(),
  BASIC_AUTH_PASSWORD: get('BASIC_AUTH_PASSWORD').required().asString(),
  GITHUB_USERNAME: get('GITHUB_USERNAME').required().asString(),
  GITHUB_TOKEN: get('GITHUB_TOKEN').required().asString(),
  // Add the new variable
  NEW_VARIABLE: get('NEW_VARIABLE').required().asString(),
  // If the variable is not mandatory:
  OPTIONAL_VARIABLE: get('OPTIONAL_VARIABLE')
    .default('default_value')
    .asString(),
};
```
};
```

## Supported Configuration Formats

The server supports the following formats for configuration files:

- JSON (\*.json)
- Properties (\*.properties)
- YML (\*.yml)
- YAML (\*.yaml)

Files must follow the naming convention:
`<application-name>-<profile>.<extension>`

Examples:

- `myapp-default.json`
- `myapp-dev.yaml`
- `myapp-qa.yml`
- `myapp-prod.properties`
