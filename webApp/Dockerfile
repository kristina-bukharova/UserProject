FROM node:9-slim
 
WORKDIR /webApp
 
COPY package.json /webApp
 
RUN npm install
 
COPY . /webApp
 
RUN npm run build

CMD ["npm","start"]