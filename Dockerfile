#  $ docker build -t urlmgr .
#  $ docker start NUM
#  $ docker run -d -p 3000-3005:3000-3005 -p 5858:5858 -v /Users/dfberry/repos/urlmgr:/home/docker urlmgr tail -f /dev/null
#  $ docker exec -it NUM /bin/bash


FROM node:latest 
 
# linux install sw
RUN apt-get update && \
    apt-get install -y apt-utils && \
    apt-get install -y sudo && \
    apt-get install -y nano && \
    apt-get install net-tools

# create user, permissions, folders
# user aka 'docker'' has sudo permissions
RUN useradd -m docker && \
    echo "docker:docker" | chpasswd && \
    adduser docker sudo 

# install npm sw (as admin)
RUN npm install http-server -g && \
    npm install gulp -g && \
    npm install tslint -g && \
    npm install jslint -g && \
    npm install typescript -g 

WORKDIR /home/docker

# web - 3000, 3001 - dashboard
# web - 3005 - api
EXPOSE 3000-3005:3000-3005

# vscode port attach
EXPOSE 5858

USER docker 

# nothing is running by default
# need to 'run' with 'tail -f /dev/null'