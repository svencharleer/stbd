#!/bin/bash
#
# need to run this commamd first in stbd:
# meteor --settings --setting.json
#
# Then go to scripts folder and run this scripts
# first argument = absolute path to data
# second argument = test (1) or not (0)
#
# Example
# ./automated.sh /Users/name/Documents/Able/Data/ 1
#
echo "current working directory $PWD"
FILES=$1/*
echo $FILES
for f in $FILES
do
  echo "processing $f"
  mongoimport --host localhost:3001 --db meteor $f
done
# Only for test-purposes
if [ "$2" == 1 ]; then
  python insert_grades_try2.py
  python update_cse.py
fi
