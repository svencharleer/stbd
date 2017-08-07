#!/bin/bash
cd stbd
echo $PWD
meteor --settings settings.json
# This never stops, so nothing can be done after
# cd ..
# echo $PWD
# python insert_grades_try2.py
