FROM node:10.14-slim
ADD . /app
WORKDIR /app
RUN npm install --production
CMD ["node", "app.js"]
