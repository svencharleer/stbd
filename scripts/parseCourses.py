import csv
import json

csvfile = open('generic_courses.csv', 'r')
jsonfile = open('generic_courses.json', 'w')

fieldnames = ("courseid","credits","coursename","semester","phase","block")

reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    for key, value in row.iteritems():
        if key == "credits":
            try:
                row[key] = int(value)
            except ValueError:
                pass
        if key == "semester":
            try:
                row[key] = int(value)
            except ValueError:
                pass
        elif key == "phase":
            try:
                row[key] = int(value)
            except ValueError:
                pass
        

    # json.dump(row, jsonfile, sort_keys=True, indent=4, separators=(',', ':'))

    json.dump(row, jsonfile)

    # jsonfile.write(',')
    jsonfile.write('\n')
