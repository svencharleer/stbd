from pymongo import MongoClient
import pprint

def update_cse3(cse_collection, document, cse3):
    cse_collection.update_one(
            {'_id': document['_id']},
            {
            "$set" : {"cse3": cse3}
            }
        )

def get_all_succeeded_courses_student(grades_collection, studentid):
    # find all courses a student succeeded
    courses_student = grades_collection.find({"$and":[{"studentid" : studentid},{"finalscore":{"$gt":9}}]}, {"courseid":1})
    courses_success = []
    for course in courses_student:
        courseid = course["courseid"]
        if courseid[0:3] != "TTT":
            courses_success.append(course["courseid"])
    return courses_success

def calculate_cse3_student(grades_collection, courses_collection, studentid, courses_success):
    # find all courses and number of credits
    courses_student = grades_collection.find({"studentid" : studentid}, {"courseid":1})
    credits_taken = []
    credits_earned = []
    for course in courses_student:
        courseid = course["courseid"]
        if courseid[0:3] != "TTT":
            credit = courses_collection.find_one({"courseid": courseid}, {"credits":1})
            credits_taken.append(credit["credits"])
        if courseid in courses_success:
            credits_earned.append(credit["credits"])
    cse = int(sum(credits_earned)/ float(sum(credits_taken))*100)
    return cse

def update_cse3_student(studentid, grades_collection, cse_collection, courses_collection):
    # Find id of succeeded courses
    courses_succes = get_all_succeeded_courses_student(grades_collection, studentid)
    # Calculate cse3 based on taken and earned credits
    cse3 = calculate_cse3_student(grades_collection, courses_collection, studentid, courses_succes)
    # Find cse_document
    cse_document = cse_collection.find_one({"studentid":studentid})
    # update_cse3
    update_cse3(cse_collection, cse_document, cse3)

def main():
    # Connect to localhost mongodb
    client = MongoClient('localhost', 3001)

    # Get the meteor database
    db = client.meteor

    # Get the collections
    grades_collection = db.generic_grades
    cse_collection = db.generic_cse
    student_collection = db.generic_students
    courses_collection = db.generic_courses

    # find all students
    students = student_collection.distinct("studentid")
    for studentid in students:
        update_cse3_student(studentid, grades_collection, cse_collection, courses_collection)




main()
