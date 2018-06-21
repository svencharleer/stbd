from pymongo import MongoClient
import csv
import pprint

def find_failed_students(opleiding, boekingen, dictList):
    failed_values = ['00.0', '01.0', '02.0','03.0','04.0','05.0','06.0','07.0','08.0','09.0','NA','#']

    query_januari = { 'Scorejanuari' : {'$in': failed_values}}
    query_juni = { 'Scorejuni' : {'$in': failed_values}}
    query_resits = { '$and' : [ query_januari, query_juni]}
    query_opleiding = {'$and': [{ "Opleiding": opleiding }, { "Nieuwi/dopleiding": "J" }]}


    pipeline = [
        {'$match': query_opleiding},
        {'$match': query_resits},
        {'$match': { "Academiejaar": { '$ne': "2017-2018" } }},
        {'$group': {
            '_id': '$Student' ,
            "septemberScores": {"$push" : '$Scoreseptember'},
            }
        }
    ]
    # Filter all students on:
    # Opleiding
    # NIO
    # Failed score in Januari and Juni
    # Historic students
    # Push for each student his scores of september
    agg = list(boekingen.aggregate(pipeline))
    print len(agg)
    # Remove all students with all resits a '#' or all resits a 'NA'
    removelist = []
    for fail in agg:
        setScores = set(fail['septemberScores'])
        if (len(setScores) == 1):
            element = setScores.pop()
            if element == '#':
                removelist.append(fail)
            elif (element  == 'NA' ):
                removelist.append(fail)
    failed_students = [x for x in agg if x not in removelist]  
    # Get number of failed and passed exams
    print 'Nb of students: ' , len(failed_students)
    for student in failed_students:
        nb_failed =  len(student['septemberScores'])
        nb_passed_resits = find_nb_passed_resits(student['septemberScores'])
        if (nb_failed < 15):
            localDict = dictList[nb_failed - 1]
            localDict[nb_passed_resits] += 1

def find_nb_passed_resits(list):
    nb_passed = 0
    passed_values = ['10.0','11.0','12.0','13.0','14.0','15.0','16.0','17.0','18.0','19.0','20.0']
    for element in list:
        if element in passed_values:
            nb_passed += 1
    return nb_passed


def find_nb_failed_courses(studentId, opleiding, boekingen):
    # You already know that student is nio and in correct program
    failed_values = ['00.0', '01.0', '02.0','03.0','04.0','05.0','06.0','07.0','08.0','09.0','NA','#']

    query_januari = { 'Scorejanuari' : {'$in': failed_values}}
    query_juni = { 'Scorejuni' : {'$in': failed_values}}
    query_score = { '$and' : [ query_januari, query_juni]}
    query_opleiding = {'$and': [{ "Opleiding": opleiding }, { "Nieuwi/dopleiding": "J" }]}
    query_studentId = {'$and': [{ 'Student' : studentId},{ "Academiejaar": { '$ne': "2017-2018" } }]}
    query_total = { '$and' : [ query_studentId, query_opleiding, query_score]}
    
    failed_courses = boekingen.find(query_total)
    nb_failed_courses = failed_courses.count()
    return nb_failed_courses

def find_nb_passed_resits_old(studentId, opleiding, boekingen):
    # You already know that student is nio and in correct program
    failed_values = ['00.0', '01.0', '02.0','03.0','04.0','05.0','06.0','07.0','08.0','09.0','NA','#']
    passed_values = ['10.0','11.0','12.0','13.0','14.0','15.0','16.0','17.0','18.0','19.0','20.0']

    query_januari = { 'Scorejanuari' : {'$in': failed_values}}
    query_juni = { 'Scorejuni' : {'$in': failed_values}}
    query_september = {'Scoreseptember': {'$in': passed_values}}
    query_score = { '$and' : [ query_januari, query_juni, query_september]}
    query_opleiding = {'$and': [{ "Opleiding": opleiding }, { "Nieuwi/dopleiding": "J" }]}
    query_studentId = {'$and': [{ 'Student' : studentId},{ "Academiejaar": { '$ne': "2017-2018" } }]}
    query_total = { '$and' : [ query_studentId, query_score, query_opleiding]}
    
    passed_resits = boekingen.find(query_total)
    nb_passed_resits = passed_resits.count()
    return nb_passed_resits

def accumulateDict(dict):
    new_dict = {}
    values =  dict.values()
    new_dict['nb_failed'] = values[-1]
    accumulated_values = accumulateRow(values[:-1])
    for x in range(0,15):
        new_dict[x] = accumulated_values[x]
    print new_dict
    return new_dict
    

def accumulateRow(num_list):    
    summed=[]
    for index,value in enumerate(num_list):
        summed.append(sum(num_list[index:]))
    return summed

def main():
    # Connect to localhost mongodb
    client = MongoClient('localhost', 27017)
    dictOne = {'nb_failed': 1, 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictTwo = {'nb_failed': 2,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictThree = {'nb_failed': 3,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictFour = {'nb_failed': 4,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictFive = {'nb_failed': 5,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictSix = {'nb_failed': 6,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictSeven = {'nb_failed': 7,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictEight = {'nb_failed': 8,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictNine = {'nb_failed': 9,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictTen = {'nb_failed': 10,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictEleven = {'nb_failed': 11,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictTwelve = {'nb_failed': 12,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictThirteen = {'nb_failed': 13,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictFourteen = {'nb_failed': 14,0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}

    dictList = [dictOne, dictTwo, dictThree, dictFour, dictFive,
    dictSix, dictSeven, dictEight, dictNine, dictTen, dictEleven, dictTwelve, dictThirteen, dictFourteen]


    # Get the meteor database
    db = client.Lissa

    # # Get the collections
    boekingen = db.boekingen

    # opleiding = "ABA ingenieurswetenschappen (Leuv)"
    opleiding = "ABA chemie (Leuv)"

    

    # find all students
    all_nio_students = boekingen.find({ '$and' : [ 
        { "Opleiding":  opleiding},
        { "Nieuwi/dopleiding": "J" },
        { "Academiejaar": { '$ne': "2017-2018" } }
        ] }).distinct("Student")
    print "all students " , len(all_nio_students)

    find_failed_students(opleiding, boekingen, dictList)

    # Write raw values to csv
    with open('data.csv', 'w') as csvfile:
        fieldnames = ['nb_failed',0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for i in range(0,14):
            writer.writerow(dictList[i])
            print sum(dictList[i].values()) - i -1

    # Write accumulated values to csv
    with open('dataAccumulated.csv', 'w') as csvfile:
        fieldnames = ['nb_failed',0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for i in range(0,14):
            dictRow = dictList[i]
            accumulatedDictRow = accumulateDict(dictRow)
            writer.writerow(accumulatedDictRow)




main()