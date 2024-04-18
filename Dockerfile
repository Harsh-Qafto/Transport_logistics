# 1. build the front-end
FROM node:18-slim
RUN mkdir /temp-build
WORKDIR /temp-build
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm update qaftoplaygroundnew
RUN npm run build

# 3. run this web-application
EXPOSE 5000
ENV NODE_ENV production

CMD [ "npm","start" ]