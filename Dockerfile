FROM oven/bun:1.0 as build

WORKDIR /app

# Copiar los archivos de dependencias
COPY package.json bun.lock ./

# Instalar dependencias
RUN bun install

# Copiar el resto de los archivos del proyecto
COPY . .

# Etapa de producción
FROM oven/bun:1.0-slim

# Instalar Git
RUN apt-get update && apt-get install -y git && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar node_modules y archivos de la etapa de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/nest-cli.json ./nest-cli.json
COPY --from=build /app/.env ./.env

# Crear el directorio data si no existe y dar permisos
RUN mkdir -p ./data
RUN chmod -R 777 ./data

# Exponer el puerto configurado en .env (por defecto 8888)
ENV PORT=8888
EXPOSE 8888

# Crear el directorio de repos si no existe
RUN mkdir -p /repos

# Comando para iniciar la aplicación
CMD ["bun", "run", "src/main.ts"]
