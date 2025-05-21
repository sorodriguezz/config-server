# Config Server

Servidor de configuración centralizado que permite gestionar y distribuir archivos de configuración para diferentes aplicaciones y entornos.

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
PORT=3000
GITHUB_USERNAME=tu_usuario_github
GITHUB_TOKEN=tu_token_github
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

### Listar Directorios

Lista todos los directorios y archivos disponibles en los repositorios.

```
GET /directories
```

### Sincronizar Repositorios

Fuerza la sincronización de todos los repositorios.

```
POST /config/sync
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
      name: RepositoryType.GITHUB,
      host: 'github.com',
      protocol: 'https',
      organization: 'usuario',
      repository: 'nuevo-repo',
      branch: 'main',
      // Opcional: agregar autenticación si es un repo privado
      auth: {
        username: envs.GITHUB_USERNAME,
        token: envs.GITHUB_TOKEN,
      },
    },
  ];
}
```

## Configuración de Variables de Entorno

### Archivo .env

El proyecto utiliza un archivo `.env` para configurar las variables de entorno. A continuación se describen las variables requeridas:

| Variable         | Descripción                                              | Obligatorio |
| --------------- | -------------------------------------------------------- | ----------- |
| PORT            | Puerto en el que se ejecutará el servidor                 | Sí          |
| GITHUB_USERNAME | Nombre de usuario para acceder a repositorios GitHub      | Sí          |
| GITHUB_TOKEN    | Token de acceso personal para repositorios GitHub privados| Sí          |

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
  GITHUB_USERNAME: get('GITHUB_USERNAME').required().asString(),
  GITHUB_TOKEN: get('GITHUB_TOKEN').required().asString(),
  // Agregar la nueva variable
  NUEVA_VARIABLE: get('NUEVA_VARIABLE').required().asString(),
  // Si la variable no es obligatoria:
  VARIABLE_OPCIONAL: get('VARIABLE_OPCIONAL').default('valor_predeterminado').asString(),
};
```

## Formatos de Configuración Soportados

El servidor admite los siguientes formatos para archivos de configuración:
- JSON (*.json)
- Properties (*.properties)

Los archivos deben seguir la convención de nombres:
`<nombre-aplicacion>-<perfil>.<extension>`

Ejemplos:
- `miapp-default.json`
- `miapp-dev.json`
- `miapp-prod.properties`
