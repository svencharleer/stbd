#!/bin/bash
# need to run this commamd first in stbd:
# meteor --settings --setting.json
#
# first argument = path to data
# second argument = test (1) or not (0)
echo $PWD
cd ..
FILES=$1
for f in $FILES
do
  echo "processing $f"
  mongoimport --host localhost:3001 --db meteor f
done
# Only for test-purposes
if [$2 == 1]; then
  python insert_grades_try2.py
fi
