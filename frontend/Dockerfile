FROM node:20-alpine
WORKDIR /app
COPY package.json /app/
RUN npm install --frozen-lockfile || npm install
COPY . /app
EXPOSE 3000
CMD ["npm", "run", "dev"]
