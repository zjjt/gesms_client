# Stage 1
#FROM node
#WORKDIR /app
#COPY . ./
#RUN yarn
#RUN yarn build

# Stage 2 - the production environment
##FROM nginx:1.15
##RUN cd /usr/share/nginx/html && ls
##COPY  build /usr/share/nginx/html
##COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 80
#CMD [“nginx”, “-g”, “daemon off;”]

FROM tiagostutz/create-react-app-ngnix