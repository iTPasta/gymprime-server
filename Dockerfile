FROM node:alpine
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY ./public ./public
COPY ./src ./src
COPY ./.env ./
COPY ./tsconfig.json ./
CMD ["npm", "run", "bstart"]