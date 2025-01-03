#!/bin/sh

npm run build-server || exit 1
npm run build-client || exit 1
rsync -r auth cashmony.cjs cashmony.service cashmony:/cashmony/ || exit 1
rsync -r --delete client-web/dist/ cashmony:/cashmony/web || exit 1

ssh follower 'sudo cp -f /cashmony/cashmony.service /lib/systemd/system/cashmony.service'
ssh follower 'sudo systemctl daemon-reload'
ssh follower 'sudo systemctl restart cashmony'
ssh follower 'sudo systemctl status cashmony'
