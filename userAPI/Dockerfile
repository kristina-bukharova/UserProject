FROM node:9-slim
 
WORKDIR /userAPI
 
COPY package.json /userAPI
 
RUN npm install
 
COPY . /userAPI
 
RUN npm run build

CMD ["npm","start"]