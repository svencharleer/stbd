import random
from pymongo import MongoClient
import os


def update_grade_finalscore(document, grade_try2, collection):
    collection.update_one(
            {'_id': document['_id']},
            {
            "$set" : {"grade_try2": grade_try2,"finalscore": grade_try2}
            }
        )

def update_grade(document, grade_try2, collection):
    collection.update_one(
            {'_id': document['_id']},
            {
            "$set" : {"grade_try2": grade_try2}
            }
        )

def insert_grades(failed_exams, collection):
    # insert grade for a failed exam
    for failed_exam in failed_exams:
        insert_grade(failed_exam, collection)

def insert_grade(document, collection):
    # Insert grade into document + update finalscore

    # possibile scores
    possible_scores = [0,1,2,2,3,4,4,4,5,5,5,5,6,6,7,7,8,8,8,8,9,9,9,9,9,9,9,10,10,10,10,10,11,11,11,12,12,12,12,12,12,12,13,14,14,14,14,15,15,15,15,16,16,16,17,18,19,20,"NA","#", "GR"]

    grade_try1 = document['grade_try1']
    # Generate random score
    grade_try2 = random.choice(possible_scores)
    check = check_update_final_score(grade_try1, grade_try2)
    if check:
        update_grade_finalscore(document, grade_try2, collection)
    else:
        update_grade(document, grade_try2, collection)

def check_update_final_score(grade_try1, grade_try2):
    # Return true if finalscore needs to be updated
    result = True
    # grade_try2 = number
    if isinstance(grade_try2,  (int, long)):
        if isinstance(grade_try1, (int, long)):
            if grade_try2 > grade_try1:
                result = True
            else:
                result = False
        # grade_try1 = NA, # or GR
        else:
            result = True
    # grade_try2 = NA, # or GR
    else:
        result = False

    return result

def main():
    # Connect to localhost mongodb
    client = MongoClient('localhost', 3001)

    # Get the meteor database
    db = client.meteor

    # Get the collection of generic_grades
    collection = db.generic_grades

    # Find all failed exams
    failed_exams = collection.find({"finalscore" : { "$not": {"$gt":9} }})

    # Insert grade_try2 and update finalscore
    insert_grades(failed_exams, collection)
    print("Done inserting grades")

main()
