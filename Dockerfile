FROM node:16-alpine AS development

WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

COPY tsconfig*.json ./
COPY package*.json ./

RUN npm install

COPY src/ src/

RUN chown -R node /app/node_modules

USER node

EXPOSE 4444

CMD CMD ["sh", "-c", "npx ts-node -r tsconfig-paths/register ./src/config/database.ts && npx ts-node src/app.ts"]


