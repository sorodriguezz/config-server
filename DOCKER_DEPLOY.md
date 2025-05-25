# Guía de Despliegue con Docker y Fly.io

## Despliegue Local con Docker Compose

Para ejecutar el proyecto localmente usando Docker:

1. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

2. Ejecuta el siguiente comando en el directorio raíz del proyecto:

```bash
docker-compose up -d
```

Esto construirá la imagen y ejecutará el contenedor con todas las configuraciones necesarias.

3. Accede a la aplicación en: http://localhost:8888

4. Para acceder a la documentación Swagger: http://localhost:8888/docs

## Despliegue en Fly.io

Para desplegar en Fly.io:

1. Instala la CLI de Fly.io:

```bash
# macOS
brew install flyctl

# Otras plataformas, consulta: https://fly.io/docs/hands-on/install-flyctl/
```

2. Inicia sesión o regístrate en Fly.io:

```bash
fly auth login
```

3. Inicializa tu aplicación (si es la primera vez):

```bash
fly launch
```

O simplemente despliega usando la configuración existente:

```bash
fly deploy
```

4. Configura las variables de entorno sensibles (credenciales):

```bash
fly secrets set BASIC_AUTH_USERNAME=tu_usuario
fly secrets set BASIC_AUTH_PASSWORD=tu_contraseña
```

5. Crea el volumen para datos persistentes (si es la primera vez):

```bash
fly volumes create config_server_data --size 1
```

6. Una vez desplegado, obtén la URL pública:

```bash
fly open
```

## Notas Importantes

- La base de datos SQLite se guarda en el volumen montado `/app/data` para persistencia.
- Los repositorios se clonan en `/repos` dentro del contenedor.
- Las credenciales básicas por defecto son admin/admin, pero deberías cambiarlas en producción.
- Puedes ajustar las variables de entorno en `docker-compose.yml` (local) o usando `fly secrets set` (Fly.io).
