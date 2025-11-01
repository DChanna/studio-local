# ./app/Dockerfile
FROM node:20-bookworm-slim

WORKDIR /app

# (optional) common tools some setups expect
RUN apt-get update && apt-get install -y --no-install-recommends git \
  && rm -rf /var/lib/apt/lists/*

# deps (include optional so rollup's native binary is installed)
COPY package*.json ./
ENV npm_config_loglevel=info
RUN npm install --include=optional && npm cache clean --force

# app code
COPY . .

EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]
