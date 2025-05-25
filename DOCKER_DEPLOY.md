# Guía de Despliegue con Docker

## Despliegue con Docker Compose (recomendado)

Para ejecutar el proyecto usando Docker Compose:

1. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

2. Ejecuta el siguiente comando en el directorio raíz del proyecto:

```bash
docker-compose up -d
```

Esto construirá la imagen y ejecutará el contenedor con todas las configuraciones necesarias.

3. Para ver los logs del contenedor:

```bash
docker-compose logs -f
```

4. Para detener el contenedor:

```bash
docker-compose down
```

5. Accede a la aplicación en: http://localhost:8888

6. Para acceder a la documentación Swagger: http://localhost:8888/docs

## Despliegue con Docker (manual)

Si prefieres usar Docker directamente sin Docker Compose:

1. Construye la imagen Docker:

```bash
docker build -t config-server:latest .
```

2. Crea los directorios necesarios si no existen:

```bash
mkdir -p ./data ../repos
```

3. Ejecuta el contenedor:

```bash
docker run -d \
  --name config-server \
  -p 8888:8888 \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/../repos:/repos" \
  -e PORT=8888 \
  -e BASE_REPOS_PATH=/repos \
  -e PATH_SWAGGER=docs \
  -e BASIC_AUTH_USERNAME=admin \
  -e BASIC_AUTH_PASSWORD=admin \
  -e THROTTLER_TTL=10 \
  -e THROTTLER_LIMIT=5 \
  config-server:latest
```

4. Para ver los logs del contenedor:

```bash
docker logs -f config-server
```

5. Para detener y eliminar el contenedor:

```bash
docker stop config-server
docker rm config-server
```

## Notas Importantes

- La base de datos SQLite se guarda en el volumen montado `/app/data` para persistencia.
- Los repositorios se clonan en `/repos` dentro del contenedor.
- Las credenciales básicas por defecto son admin/admin, pero deberías cambiarlas en producción.
- Puedes ajustar las variables de entorno en `docker-compose.yml` o al ejecutar el contenedor.
