import csv
import json

csvfile = open('generic_grades.csv', 'r')
jsonfile = open('generic_grades.json', 'w')

fieldnames = ("courseid","studentid","finalscore","generatiestudent","year", "grade_try1", "grade_try2")
fieldfixers = {
    'finalscore': int,
    'grade_try1': int,
    'grade_try2': int,
    # 'studentid': int,
}
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    print row
    for key, value in row.iteritems():
        if key == "studentid":
            try:
                row[key] = int(value)
            except ValueError:
                pass
        if key == "finalscore":
            try:
                row[key] = int(value)
            except ValueError:
                pass
        elif key == "grade_try1":
            try:
                row[key] = int(value)
            except ValueError:
                pass
        elif key == "grade_try2":
            try:
                row[key] = int(value)
            except ValueError:
                pass

    # json.dump(row, jsonfile, sort_keys=True, indent=4, separators=(',', ':'))

    json.dump(row, jsonfile)

    # jsonfile.write(',')
    jsonfile.write('\n')
