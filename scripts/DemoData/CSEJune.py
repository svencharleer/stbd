from pymongo import MongoClient
import csv

def find_nb_failed_courses(studentId, opleiding, boekingen):
    # You already know that student is nio and in correct program
    failed_values = ['00.0', '01.0', '02.0','03.0','04.0','05.0','06.0','07.0','08.0','09.0','NA','#']

    query_januari = { 'Scorejanuari' : {'$in': failed_values}}
    query_juni = { 'Scorejuni' : {'$in': failed_values}}
    query_score = { '$and' : [ query_januari, query_juni]}
    query_studentId = {'$and': [{ 'Student' : studentId},{ "Opleiding": opleiding }, { "Nieuwi/dopleiding": "J" }]}
    query_total = { '$and' : [ query_studentId, query_score]}
    
    failed_courses = boekingen.find(query_total)
    nb_failed_courses = failed_courses.count()
    return nb_failed_courses

def find_nb_passed_resits(studentId, opleiding, boekingen):
    # You already know that student is nio and in correct program
    failed_values = ['00.0', '01.0', '02.0','03.0','04.0','05.0','06.0','07.0','08.0','09.0','NA','#']
    passed_values = ['10.0','11.0','12.0','13.0','14.0','15.0','16.0','17.0','18.0','19.0','20.0']

    query_januari = { 'Scorejanuari' : {'$in': failed_values}}
    query_juni = { 'Scorejuni' : {'$in': failed_values}}
    query_september = {'Scoreseptember': {'$in': passed_values}}
    query_score = { '$and' : [ query_januari, query_juni, query_september]}
    query_studentId = {'$and': [{ 'Student' : studentId},{ "Opleiding": opleiding }, { "Nieuwi/dopleiding": "J" }]}
    query_total = { '$and' : [ query_studentId, query_score]}
    
    passed_resits = boekingen.find(query_total)
    nb_passed_resits = passed_resits.count()
    return nb_passed_resits


def main():
    # Connect to localhost mongodb
    client = MongoClient('localhost', 27017)
    dictOne = {'nb_failed': 1, 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictTwo = {'nb_failed': 2,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictThree = {'nb_failed': 3,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictFour = {'nb_failed': 4,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictFive = {'nb_failed': 5,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictSix = {'nb_failed': 6,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictSeven = {'nb_failed': 7,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictEight = {'nb_failed': 8,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictNine = {'nb_failed': 9,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictTen = {'nb_failed': 10,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictEleven = {'nb_failed': 11,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictTwelve = {'nb_failed': 12,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictThirteen = {'nb_failed': 13,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictFourteen = {'nb_failed': 14,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
    dictFifteen = {'nb_failed': 15,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}

    dictList = [dictOne, dictTwo, dictThree, dictFour, dictFive,
    dictSix, dictSeven, dictEight, dictNine, dictTen, dictEleven, dictTwelve]


    # Get the meteor database
    db = client.Lissa

    # # Get the collections
    boekingen = db.boekingen

    opleiding = "ABA ingenieurswetenschappen (Leuv)"
    # find all failed students
    failed_students = boekingen.find({ '$and' : [ { "Opleiding":  opleiding}, { "Nieuwi/dopleiding": "J" }, { '$or': [ { "CSEJanuari": { '$ne': 100 } }, { "CSEJuni": { '$ne': 100} } ] } ] })
    students = failed_students.distinct("Student")
    print len(students)
    for x in range(0,100):
        nb_failed = find_nb_failed_courses(students[x], opleiding, boekingen)
        nb_passed_resits = find_nb_passed_resits(students[x], opleiding, boekingen)
        if (nb_failed < 12):
            print nb_failed
            localDict = dictList[nb_failed -1]
            localDict[nb_passed_resits] += 1

    with open('data.csv', 'w') as csvfile:
        fieldnames = ['nb_failed',0,1,2,3,4,5,6,7,8,9,10,11,12]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for i in range(0,12):
            writer.writerow(dictList[i])
    print dictList 



main()