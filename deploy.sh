#!/bin/sh

npm run build-server || exit 1
npm run build-client || exit 1
rsync -r cert dist taskmony.service taskmony:/taskmony/ || exit 1
rsync -r --delete client-web/dist/ taskmony:/taskmony/web || exit 1

ssh taskmony-new 'mkdir -p /taskmony'
ssh taskmony 'sudo cp -f /taskmony/taskmony.service /lib/systemd/system/taskmony.service'
ssh taskmony 'sudo systemctl daemon-reload'
ssh taskmony 'sudo systemctl enable taskmony'
ssh taskmony 'sudo systemctl restart taskmony'
ssh taskmony 'sudo systemctl status taskmony'
