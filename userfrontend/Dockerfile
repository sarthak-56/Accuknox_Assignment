FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN  npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# Docker run command = docker run -p 3000:3000 cbbea5002c95 (Imagecode)