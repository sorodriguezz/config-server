# Config Server

[English](README.md) | **Español**

Servidor de configuración centralizado que permite gestionar y distribuir archivos de configuración para diferentes aplicaciones y entornos.

## Tabla de Contenidos

### Español

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Autenticación Básica](#configuración-de-autenticación-básica)
- [Ejecución](#ejecución)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Administración de Repositorios](#administración-de-repositorios)
- [Variables de Entorno](#configuración-de-variables-de-entorno)
- [Formatos Soportados](#formatos-de-configuración-soportados)

## Tecnologías Utilizadas

- **NestJS**: Framework de Node.js para construir aplicaciones del lado del servidor eficientes y escalables.
- **Bun**: Entorno de ejecución JavaScript rápido, v1.2.13.
- **TypeScript**: Lenguaje de programación tipado que se compila a JavaScript.
- **Git**: Sistema de control de versiones.
- **simple-git**: Librería para manejar operaciones Git desde Node.js.
- **dotenv**: Para cargar variables de entorno desde archivos .env.
- **env-var**: Validación y parseo de variables de entorno.

## Instalación

### Dependencias

Para instalar las dependencias del proyecto:

```bash
bun install
```

### Variables de Entorno

1. Copia el archivo template a un archivo .env:

```bash
cp .env.template .env
```

2. Edita el archivo `.env` con tus valores:

```dotenv
PORT=8888
BASE_REPOS_PATH=../repos

PATH_SWAGGER=docs

BASIC_AUTH_USERNAME=admin
BASIC_AUTH_PASSWORD=admin

THROTTLER_TTL=10
THROTTLER_LIMIT=5
```

## Configuración de Autenticación Básica

El servidor utiliza autenticación básica (Basic Auth) para proteger los endpoints. Es necesario configurar las credenciales en el archivo `.env`:

```dotenv
BASIC_AUTH_USERNAME=admin
BASIC_AUTH_PASSWORD=admin
```

Estas credenciales se utilizan para autenticar las solicitudes a los endpoints protegidos. Al iniciar el servidor, se crea automáticamente un usuario administrador con estas credenciales.

### Cómo usar la autenticación en las solicitudes

Para acceder a los endpoints protegidos, debes incluir las credenciales de autenticación básica en tus solicitudes HTTP:

```bash
# Utilizando curl
curl -X GET "http://localhost:3000/directories" -u "admin:password"

# Utilizando Postman
# 1. Selecciona la pestaña "Authorization"
# 2. Selecciona el tipo "Basic Auth"
# 3. Ingresa el username y password configurados
```

## Ejecución

Para iniciar el servidor:

```bash
bun run start
```

Para ejecutar en modo desarrollo con recarga automática:

```bash
bun run start:dev
```

## Endpoints Disponibles

### Obtener Configuración

Obtiene un archivo de configuración para una aplicación específica.

```
GET /?repo=REPO_NAME&application=APP_NAME&profile=PROFILE
```

**Parámetros:**

- `repo`: Nombre del repositorio (ej: test123, testjson)
- `application`: Nombre de la aplicación (ej: miapp)
- `profile`: Perfil de configuración (ej: default, dev, prod)

**Ejemplo:**

```
GET /?repo=test123&application=miapp&profile=dev
```

**Autenticación**: Este endpoint requiere autenticación básica.

### Listar Directorios

Lista todos los directorios y archivos disponibles en los repositorios.

```
GET /directories
```

**Autenticación**: Este endpoint requiere autenticación básica.

### Sincronizar Repositorios

Fuerza la sincronización de todos los repositorios.

```
POST /sync
```

**Autenticación**: Este endpoint requiere autenticación básica.

### Documentación API (Swagger)

Accede a la documentación interactiva de la API mediante Swagger UI:

```
GET /{PATH_SWAGGER}
```

Donde `PATH_SWAGGER` es el valor configurado en el archivo `.env`. Por defecto es `docs`.

Ejemplo:

```
GET /docs
```

## Administración de Repositorios

### Cómo Agregar Nuevos Repositorios

Para agregar un nuevo repositorio de configuración:

**Actualización de configuración**: Modificar el archivo `repository-manager.config.ts` para incluir el nuevo repositorio:

```typescript
export class RepositoryManagerConfig {
  public static readonly repositoryManager: RepositoryManager[] = [
    // Repositorios existentes
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
    // Agregar el nuevo repositorio
    {
      name: RepositoryType.GITLAB, // En RepositoryType estan los disponibles
      host: 'gitlab.com',
      protocol: 'http',
      organization: 'usuario',
      repository: 'nuevo-repo',
      branch: 'dev',
      // Opcional: agregar autenticación si es un repo privado
      auth: {
        username: envs.GITLAB_USERNAME,
        token: envs.GITLAB_TOKEN,
      },
    },
  ];
}
```

## Configuración de Variables de Entorno

### Archivo .env

El proyecto utiliza un archivo `.env` para configurar las variables de entorno. A continuación se describen las variables requeridas:

| Variable            | Descripción                                     | Obligatorio |
| ------------------- | ----------------------------------------------- | ----------- |
| PORT                | Puerto en el que se ejecutará el servidor       | Sí          |
| BASE_REPOS_PATH     | Ruta para guardado de los repositorios          | Sí          |
| PATH_SWAGGER        | Ruta para acceder a la documentación de Swagger | Sí          |
| BASIC_AUTH_USERNAME | Nombre de usuario para la autenticación básica  | Sí          |
| BASIC_AUTH_PASSWORD | Contraseña para la autenticación básica         | Sí          |

### Agregar o Modificar Variables de Entorno

Para agregar o modificar las variables de entorno, debes:

1. Agregar la variable en el archivo `.env`:

```
NUEVA_VARIABLE=valor
```

2. Actualizar el archivo `.env.template` para documentar la nueva variable:

```
NUEVA_VARIABLE=
```

3. Modificar el archivo `src/config/envs.config.ts` para incluir la nueva variable:

```typescript
export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  PATH_SWAGGER: get('PATH_SWAGGER').required().asString(),
  BASE_REPOS_PATH: get('BASE_REPOS_PATH').required().asString(),
  BASIC_AUTH_USERNAME: get('BASIC_AUTH_USERNAME').required().asString(),
  // Agregar la nueva variable
  NUEVA_VARIABLE: get('NUEVA_VARIABLE').required().asString(),
  // Si la variable no es obligatoria:
  VARIABLE_OPCIONAL: get('VARIABLE_OPCIONAL')
    .default('valor_predeterminado')
    .asString(),
};
```

## Formatos de Configuración Soportados

El servidor admite los siguientes formatos para archivos de configuración:

- JSON (\*.json)
- Properties (\*.properties)
- YML (\*.yml)
- YAML (\*.yaml)

Los archivos deben seguir la convención de nombres:
`<nombre-aplicacion>-<perfil>.<extension>`

Ejemplos:

- `miapp-default.json`
- `miapp-dev.yaml`
- `miapp-qa.yml`
- `miapp-prod.properties`

## Cliente de Configuración

Para una fácil integración con tus aplicaciones, puedes utilizar el cliente oficial de configuración:

### @sorodriguez/config-client

Una biblioteca cliente dedicada para simplificar la conexión a este servidor de configuración y la obtención de configuraciones.

**Paquete NPM**: [https://www.npmjs.com/package/@sorodriguez/config-client](https://www.npmjs.com/package/@sorodriguez/config-client)

**Repositorio GitHub**: [https://github.com/sorodriguezz/config-client.git](https://github.com/sorodriguezz/config-client.git)

El cliente proporciona una interfaz sencilla para obtener configuraciones y se integra perfectamente con esta implementación del servidor de configuración. Consulta la documentación del cliente para obtener instrucciones de instalación y ejemplos de uso.
