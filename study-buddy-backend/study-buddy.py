from flask import Flask, Response, request
from flask_cors import CORS
from flask_mysqldb import MySQL
import json
from datetime import datetime
import csv

app = Flask(__name__)
cors = CORS(app, supports_credentials=True)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'study-buddy'
app.config['MYSQL_DB'] = 'sys'

mysql = MySQL(app)

@app.route("/signup", methods=['POST'])
def signup():
    firstname = request.args.get('firstname')
    lastname = request.args.get('lastname')
    email = request.args.get('email')
    password = request.args.get('password')
    role = request.args.get('role')
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO user (firstname, lastname, email, password, role) VALUES (%s,%s,%s,%s,%s)", (firstname, lastname, email, password, role))
    mysql.connection.commit()
    cur.close()
    return "worked"


@app.route("/login", methods=['POST'])
def login():
    email = request.args.get('email')
    password = request.args.get('password')
    role = request.args.get('role')
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM user WHERE email = (%s)", (email,))    
    data = cur.fetchall()
    json_data = []
    finalData = json.dumps(json_data)
    for result in data:
        json_data.append(result)
    if len(json_data) != 0:
        if json_data[0][4] == password and json_data[0][3] == role:
            finalData = json.dumps(json_data)

    res = Response(finalData, status=200, mimetype='application/json')
    res.set_cookie('email', email, max_age=60*60*24*10)
    return res  


@app.route("/current", methods=['POST'])
def current():
    current_class = request.args.get('current_class')
    email = request.cookies.get('email')
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO studentTakes (email, CID) VALUES (%s, %s)", ((email, current_class)))
    mysql.connection.commit()
    cur.close()
    return "worked"

@app.route("/getListofClasses", methods=['GET'])
def getlist():
    cur = mysql.connection.cursor()
    email = request.cookies.get('email')
    cur.execute("SELECT * FROM studentTakes WHERE email = %s", (email,))
    data = cur.fetchall()
    json_data = []
    for result in data:
        json_data.append(result)
    return json.dumps(json_data)

@app.route("/getClasses", methods=['GET'])
def getclasses():
    cur = mysql.connection.cursor()
    email = request.cookies.get('email')
    cur.execute("SELECT * FROM tutorTakes WHERE email = %s", (email,))
    data = cur.fetchall()
    json_data = []
    for result in data:
        json_data.append(result)
    return json.dumps(json_data)

@app.route("/classes", methods=['POST'])
def classes():
    a_class = request.args.get('a_class')
    grade = request.args.get('grade')
    email = request.cookies.get('email')
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO tutorTakes (email, CID, grade) VALUES (%s, %s, %s)", (email, a_class, grade))
    mysql.connection.commit()
    cur.close()
    return "worked"

@app.route("/getTutorMatch", methods=['GET'])
def tutorMatch():
    cur = mysql.connection.cursor()
    email = request.cookies.get('email')
    cur.execute("SELECT user.firstname, user.lastname, tutorTakes.CID, tutorTakes.grade, user.email FROM studentTakes, tutorTakes, user WHERE tutorTakes.email = user.email AND studentTakes.email = %s AND studentTakes.CID = tutorTakes.CID", (email, ))
    data = cur.fetchall()
    mysql.connection.commit()
    cur.close()
    json_data = []
    for result in data:
        json_data.append(result)
    return json.dumps(json_data)

@app.route("/getStudentMatch", methods=['GET'])
def studentMatch():
    cur = mysql.connection.cursor()
    email = request.cookies.get('email')
    cur.execute("SELECT user.firstname, user.lastname, s2.CID, user.email FROM studentTakes as s1, studentTakes as s2, user WHERE s1.email = %s AND s1.CID = s2.CID AND s2.email = user.email AND s2.email != %s", (email, email, ))
    data = cur.fetchall()
    mysql.connection.commit()
    cur.close()
    json_data = []
    for result in data:
        json_data.append(result)
    return json.dumps(json_data)

@app.route('/userinfo', methods=['GET'])
def userinfo():
    cur = mysql.connection.cursor()
    email = request.cookies.get('email')
    cur.execute("SELECT * FROM user WHERE email = %s", (email,))
    data = cur.fetchall()
    json_data = []
    for result in data:
        json_data.append(result)
    return json.dumps(json_data)

@app.route('/studentclasses', methods=['GET'])
def studentclasses():
    cur = mysql.connection.cursor()
    email = request.cookies.get('email')
    cur.execute("SELECT * FROM studentTakes WHERE email = %s", (email, ))
    data = cur.fetchall()
    json_data = []
    for result in data:
        json_data.append(result)
    return json.dumps(json_data)

@app.route('/tutorclasses', methods=['GET'])
def tutorclasses():
    cur = mysql.connection.cursor()
    email = request.cookies.get('email')
    cur.execute("SELECT * FROM tutorTakes WHERE email = %s", (email, ))
    data = cur.fetchall()
    json_data = []
    for result in data:
        json_data.append(result)
    return json.dumps(json_data)

@app.route('/messages', methods=['POST'])
def message():
    content = request.args.get('message')
    receiver = request.args.get('receiver')
    sender = request.cookies.get('email')
    clock = datetime.now()
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO messaging VALUES (%s, %s, %s, %s)", (sender, receiver, content, clock))
    mysql.connection.commit()
    cur.close()
    return "worked"

@app.route('/getmessage', methods=['GET'])
def getMsg():
    receiver = request.args.get('receiver')
    email = request.cookies.get('email')
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM messaging WHERE (sender = %s AND receiver = %s) OR (sender = %s AND receiver = %s) ORDER BY time", (email, receiver, receiver, email))
    data = cur.fetchall()
    json_data = []
    for result in data:
        row = []
        row.append(result[0])
        row.append(result[1])
        row.append(result[2])
        timestamp = result[3]
        strtime = timestamp.strftime('%F %r')
        row.append(strtime)
        json_data.append(row)
    return json.dumps(json_data)

@app.route('/sendrequest', methods=['POST'])
def sendreq():
    receiver = request.args.get('receiver')
    sender = request.cookies.get('email')
    content = request.args.get('content')
    accepted = 0
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO requests VALUES (%s, %s, %s, %s)", (sender, receiver, content, accepted))
    mysql.connection.commit()
    cur.close()
    return "worked"

@app.route('/updateRequest', methods=['POST'])
def updateRequest():
    receiver = request.args.get('receiver')
    sender = request.cookies.get('email')
    accepted = 1
    cur = mysql.connection.cursor()
    cur.execute("UPDATE requests SET accepted = %s WHERE toemail = %s AND fromemail= %s ", (accepted, sender, receiver))
    mysql.connection.commit()
    cur.close()
    return "worked"

@app.route('/getrequests', methods=['GET'])
def getreq():
    cur = mysql.connection.cursor()
    email = request.cookies.get('email')
    cur.execute("SELECT fromemail, toemail, message, accepted, firstname, lastname FROM requests, user WHERE user.email = fromemail AND toemail = %s AND accepted = '0'", (email, ))
    data = cur.fetchall()
    json_data = []
    for result in data:
        json_data.append(result)
    return json.dumps(json_data)

@app.route('/getAcceptedRequests', methods=['GET'])
def getAcceptedRequests():
    cur = mysql.connection.cursor()
    email = request.cookies.get('email')
    cur.execute("SELECT email, firstname, lastname FROM requests, user WHERE ((user.email = toemail AND fromemail = %s) OR (user.email = fromemail AND toemail = %s)) AND accepted = '1'", (email, email))
    data = cur.fetchall()
    json_data = []
    for result in data:
        json_data.append(result)
    return json.dumps(json_data)

@app.route('/deletestudentclass', methods=['DELETE'])
def delstudentclass():
    course = request.args.get('course')
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM studentTakes WHERE CID = %s", (course,))
    mysql.connection.commit()
    cur.close()
    return "worked"

@app.route('/deletetutorclass', methods=['DELETE'])
def deltutorclass():
    course = request.args.get('course')
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM tutorTakes WHERE CID = %s", (course,))
    mysql.connection.commit()
    cur.close()
    return "worked"

@app.route('/deleterequest', methods=['DELETE'])
def deletereq():
    cur = mysql.connection.cursor()
    receiver = request.args.get('receiver')
    profile = request.cookies.get('email')
    cur.execute("DELETE FROM requests WHERE toemail = %s AND fromemail= %s", (profile, receiver))
    mysql.connection.commit()
    cur.close()
    return "worked"

@app.route('/logout', methods=['POST'])
def logout():
    json_data = []
    finalData = json.dumps(json_data)
    res = Response(finalData, status=200, mimetype='application/json')
    res.set_cookie('email', "", max_age=0)
    return res  

@app.route('/dropdown', methods=['GET'])
def dropdown():
    options = []
    with open('classes.txt', mode='r') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            options.append(row[0])
    finalData = json.dumps(options)
    return finalData

if __name__ == "__main__":
    app.run(debug=True)
