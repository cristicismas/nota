#!/usr/bin/bash

rsync -avz -e "ssh -p 22 -i ~/.ssh/my_server" --exclude=.git/ --exclude=node_modules/ ./* cristi-server@webcc.uk:/home/cristi/docker/swag/nota

echo "Synced code changes to the server"

ssh cristi-server@webcc.uk 'cd /home/cristi/docker/swag && docker-compose up nota -d --build --remove-orphans'

echo "Sucessfully rebuilt the image"

