import csv
import os

csvfile = open('/Users/Martijn/Documents/Able/Data/Januari18/doorloop.csv', 'r+')
parsedcsvfile = open('/Users/Martijn/Documents/Able/Data/Januari18/parseddoorloop.csv', 'w')

fieldnames = ("Jaar X", "Student", "Student - Aanlognummer (Key)", "Generatiestudent ?", "Jaar X: Opleiding", "Jaar X: CSE", "Doorloop: Studieduur")
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    for key, value in row.iteritems():
        if key == "Jaar X: Opleiding":
            row[key].replace("ABA taal- & letterkunde (Leuv)", "ABA taal- en letterkunde (Leuv)" )
            row[key].replace("ABA biomedische wetenschappen (Leuv)", "ABA biomedische wetenschappen")
