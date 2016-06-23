#!/bin/sh


echo "======  START SYNCING 53 SERVER ========="

ssh root@121.43.57.75<<EOF
ls
cd /usr/local/nginx/html/agg/server/staic/wapdev
ls

git status
git branch
git checkout master
git pull origin master

pwd


gulp

EOF


echo "======  END OF SYNCING 53 SERVER ========="