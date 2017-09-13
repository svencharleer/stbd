import csv
import json

csvfile = open('generic_cse.csv', 'r')
jsonfile = open('generic_cse.json', 'w')

fieldnames = ("studentid","year","cse1","cse2", "cse3")

reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    for key, value in row.iteritems():
        if key == "studentid":
            try:
                row[key] = int(value)
            except ValueError:
                pass
        if key == "cse1":
            try:
                row[key] = int(value)
            except ValueError:
                pass
        elif key == "cse2":
            try:
                row[key] = int(value)
            except ValueError:
                pass
        elif key == "cse3":
            try:
                row[key] = int(value)
            except ValueError:
                pass

    # json.dump(row, jsonfile, sort_keys=True, indent=4, separators=(',', ':'))

    json.dump(row, jsonfile)

    # jsonfile.write(',')
    jsonfile.write('\n')
