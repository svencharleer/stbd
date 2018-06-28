# -*- coding: utf-8 -*-

from pymongo import MongoClient
import csv
import pprint
import re


def find_failed_students(opleiding, boekingen, dictList):
    failed_values = ['00.0', '01.0', '02.0','03.0','04.0','05.0','06.0','07.0','08.0','09.0','NA','#']

    query_januari = { 'Scorejanuari' : {'$in': failed_values}}
    query_juni = { 'Scorejuni' : {'$in': failed_values}}
    query_resits = { '$and' : [ query_januari, query_juni]}
    query_opleiding = make_query_program(opleiding)
    
    
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
    print 'Nb in' , opleiding , ': ' , len(failed_students)

    for student in failed_students:
        nb_failed =  len(student['septemberScores'])
        nb_passed_resits = find_nb_passed_resits(student['septemberScores'])
        if (nb_failed < 15):
            localDict = dictList[nb_failed - 1]
            localDict[nb_passed_resits] += 1

def make_query_program(opleiding):
    regex_industria_ABA = re.compile("^(ABA industri|ABA biowetenschappen)", re.IGNORECASE)
    regex_industria_SMA = re.compile("^(S MA industri|S MA biowetenschappen|S MA I2W)", re.IGNORECASE)

    regex_archi = re.compile("^(ABA architectuur)", re.IGNORECASE)
    regex_interieur = re.compile("^(ABA interieurarchitectuur)", re.IGNORECASE)

    regex_tew = re.compile("^(ABA TEW)", re.IGNORECASE)



    if regex_industria_ABA.match(opleiding):
        query_opleiding = {'$and': [{ "Opleiding": regex_industria_ABA }, { "Nieuwi/dopleiding": "J" }]}
    
    elif regex_industria_SMA.match(opleiding):
        query_opleiding = {'$and': [{ "Opleiding": regex_industria_SMA }, { "Nieuwi/dopleiding": "J" }]}

    elif regex_archi.match(opleiding):
        query_opleiding = {'$and': [{ "Opleiding": regex_archi }, { "Nieuwi/dopleiding": "J" }]}

    elif regex_interieur.match(opleiding):
        query_opleiding = {'$and': [{ "Opleiding": regex_interieur }, { "Nieuwi/dopleiding": "J" }]}

    elif regex_tew.match(opleiding):
        query_opleiding = {'$and': [{ "Opleiding": regex_tew }, { "Nieuwi/dopleiding": "J" }]}

    
    else:
        query_opleiding = {'$and': [{ "Opleiding": opleiding }, { "Nieuwi/dopleiding": "J" }]}
    return query_opleiding

def find_nb_passed_resits(list):
    nb_passed = 0
    passed_values = ['10.0','11.0','12.0','13.0','14.0','15.0','16.0','17.0','18.0','19.0','20.0']
    for element in list:
        if element in passed_values:
            nb_passed += 1
    return nb_passed


def percentageDict(dict):
    acc_dict = accumulateDict(dict)
    new_dict = {}
    values =  acc_dict.values()
    total = values[0]
    nb_values = len(values)
    for x in range(0,nb_values):
        if (total != 0 ):
            new_dict[x] = int(round(values[x] / float(total) * 100))
        else:
            new_dict[x] = values[x]
    return new_dict

def accumulateDict(dict):
    new_dict = {}
    values =  dict.values()
    accumulated_values = accumulateRow(values[:-1])
    nb_values = len(accumulated_values)
    for x in range(0,nb_values):
        new_dict[x] = accumulated_values[x]
    return new_dict
    
# Used in accumulateDict
def accumulateRow(num_list):    
    summed=[]
    for index,value in enumerate(num_list):
        summed.append(sum(num_list[index:]))
    return summed

def createTotalRow(opleiding,dictList):
    totalRow = {}
    totalRow['program'] =  opleiding
    nb_values = len(dictList)
    for x in range(0,nb_values):
        local_dict = dictList[x]
        percentage = percentageDict(local_dict)
        totalRow[x] = percentage.values()
    return totalRow

def writeProgram(program, boekingen):
    dictOne = { 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictTwo = { 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictThree = { 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictFour = { 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictFive = { 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictSix = { 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictSeven = { 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictEight = { 0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictNine = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictTen = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictEleven = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictTwelve = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictThirteen = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictFourteen = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}
    dictFifteen = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0}


    dictList = [dictOne, dictTwo, dictThree, dictFour, dictFive,
    dictSix, dictSeven, dictEight, dictNine, dictTen, dictEleven, dictTwelve, dictThirteen, dictFourteen, dictFifteen]    

    find_failed_students(program, boekingen, dictList)

    row = createTotalRow(program,dictList)

    # Write percentage values to csv
    with open('dataPercentage.csv', 'a') as csvfile:
        fieldnames = ['program',0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writerow(row)



def main():
    # Connect to localhost mongodb
    client = MongoClient('localhost', 27017)

    # Get the meteor database
    db = client.Lissa

    # # Get the collections
    boekingen = db.boekingen
    

    # Write percentage values to csv
    with open('dataPercentage.csv', 'a') as csvfile:
        fieldnames = ['program',0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

    programList = ["ABA biochemie en biotechnologie (Leuv)", "ABA biologie (Leuv)", "ABA chemie (Leuv)", "ABA fysica (Leuv)", "ABA geografie (Leuv)", "ABA geologie (Leuv)", "ABA informatica (Leuv)",
    "ABA wiskunde (Leuv)", "ABA bio-ingenieurswetenschappen (Leuv)", "ABA ingenieurswetenschappen (Leuv)", "ABA ingenieurswetenschappen: architectuur (Leuv)", "ABA biowetenschappen (Geel)", "ABA industriële wetenschappen (Geel)",
    "ABA industriële wetenschappen (Aals)", "ABA industriële wetenschappen (Diepenbeek)", "ABA industriële wetenschappen (Leuv)", "ABA industriële wetenschappen (Brug/Oost)", "ABA industriële wetenschappen (StKa)", 
    "ABA industriële wetenschappen (Gent)",  "S MA biowetenschappen (Geel)", "S MA industriële wetenschappen (Geel)", "S MA industriële wetenschappen (Aals)", "S MA industriële wetenschappen (Diepenbeek)", "S MA industriële wetenschappen (Leuv)", 
    "S MA industriële wetenschappen (Brug/Oost)", "S MA industriële wetenschappen (StKa)", "ABA architectuur (Gent)", "ABA architectuur (Brus)", "ABA interieurarchitectuur (Gent)",  "ABA interieurarchitectuur (Brus)", 
    "ABA geneeskunde (Leuv)", "ABA tandheelkunde (Leuv)", "ABA biomedische wetenschappen (Leuv)",  "ABA logopedische en audiologische wetenschappen (Leuv)",  "ABA farmaceutische wetenschappen (Leuv)", 
     "ABA geschiedenis (Leuv)", "ABA taal- & letterkunde (Leuv)", "S MA verpleegkunde en vroedkunde (Leuv ea)", "ABA TEW: handelsingenieur (Leuv)", "ABA TEW: handelsingenieur beleidsinformatica (Leuv)" ]
    for program in programList:
        writeProgram(program, boekingen)

    regex_industria = re.compile("^(ABA architectuur|ABA interieurarchitectuur)", re.IGNORECASE)
    print regex_industria.match("ABA architectuur (Gent)")
    print regex_industria.match("ABA interieurarchitectuur (Gent)")

    

    

    # # Write raw values to csv
    # with open('data.csv', 'w') as csvfile:
    #     fieldnames = ['program',0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
    #     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    #     writer.writeheader()
    #     for i in range(0,14):
    #         writer.writerow(dictList[i])
    #         print sum(dictList[i].values()) - i -1

    # # Write accumulated values to csv
    # with open('dataAccumulated.csv', 'w') as csvfile:
    #     fieldnames = ['nb_failed',0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
    #     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    #     writer.writeheader()
    #     for i in range(0,14):
    #         dictRow = dictList[i]
    #         accumulatedDictRow = accumulateDict(dictRow)
    #         percentageDict(dictRow)
    #         writer.writerow(accumulatedDictRow)

    




main()