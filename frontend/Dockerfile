FROM node:23
WORKDIR /frontend
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]