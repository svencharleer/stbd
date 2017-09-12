#!/bin/bash
#
# run as :
# bash deployLissa nameofprogram
# preconditie: bundle is on server

echo "Name of program: $1"
cd $1
echo "current working directory $PWD"
SETTINGS="$1.json"
echo "move settings $SETTINGS"
mv $SETTINGS ..
cd ..
echo "current working directory $PWD"
echo "remove folder $1"
rm -rf $1
echo "current working directory $PWD"
echo "copy bundle to $1"
cp -r bundle $1
mv $SETTINGS $1
cd $1
(cd programs/server/ && npm install)
echo "done"
