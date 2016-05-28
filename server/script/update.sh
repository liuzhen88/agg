#!/bin/sh


echo "======  START SYNCING 75 SERVER ========="

ssh root@121.43.57.75<<EOF
ls
cd /usr/local/nginx/html/agg/server
ls

git status
git branch
git checkout master
git pull origin master

pwd


EOF


echo "======  END OF SYNCING 75 SERVER ========="