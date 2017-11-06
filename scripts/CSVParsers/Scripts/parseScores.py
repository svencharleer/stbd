import csv
import json
import sys
import os
import itertools
import re


# roep op vanaf terminal
# python parseScore /path/to/scores.txt
# python parseScores.py /Users/martijn/Documents/Able/Data/Lissa/ir/scores-20170913.txt
# txt_file = sys.argv[1]
txt_file = 'target.txt'

with open(txt_file, 'r') as in_file:
    stripped = (line.strip() for line in in_file)
    lines = (line.split(";") for line in stripped if line)
    with open('log.csv', 'w') as out_file:
        writer = csv.writer(out_file)
        # writer.writerow(('title', 'intro'))
        writer.writerows(lines)

# csvfile = open(csv_file, 'r')
# jsonfile = open('generic_grades.json', 'w')
#
# fieldnames = ("courseid","studentid","finalscore","generatiestudent","year", "grade_try1", "grade_try2")
# reader = csv.DictReader( csvfile, fieldnames)
# for row in reader:
#     print row
#     for key, value in row.iteritems():
#         if key == "studentid":
#             try:
#                 row[key] = int(value)
#             except ValueError:
#                 pass
#         if key == "finalscore":
#             try:
#                 row[key] = int(value)
#             except ValueError:
#                 pass
#         elif key == "grade_try1":
#             try:
#                 row[key] = int(value)
#             except ValueError:
#                 pass
#         elif key == "grade_try2":
#             try:
#                 row[key] = int(value)
#             except ValueError:
#                 pass
#
#     # json.dump(row, jsonfile, sort_keys=True, indent=4, separators=(',', ':'))
#
#     json.dump(row, jsonfile)
#
#     # jsonfile.write(',')
#     jsonfile.write('\n')
