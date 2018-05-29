import plotly
import plotly.plotly as py
import plotly.figure_factory as ff
import os
import datetime

plotly.tools.set_credentials_file(username='martijn.millecamp', api_key='TYJyoUHlfhRpDa8CZUMU')
pathJasper = "/Users/martijn/Documents/Able/Data/evaluationJasper"
pathBart = "/Users/martijn/Documents/Able/Data/evaluationBart"

colors = {'Student': 'rgb(239,138,98)',
          'SA': 'rgb(103,169,207)',
          'Stop': 'rgb(153,153,153)'}

def parseDate(ms):
    ms = int(ms)
    date = datetime.datetime.fromtimestamp(ms/1000)
    return date

def parseLine(line):
    # return ms as int and the value of my comment
    values = line.split()
    return [int(values[3]), values[4]]

def writeToDict(startTime, endTime, name, resource):
    df.append(dict(Task=name, Start= startTime, Finish= endTime, Resource=resource))

def visualiseStudent(path, name):
    # Open file
    f = open(path, 'r')
    firstLine = f.readline()
    # get the first time and value
    [startSessionTime,value] = parseLine(firstLine)
    student = False
    startTime = parseDate(startSessionTime)
    totalTime = 0
    for line in f:
        [time, value] = parseLine(line)
        if value == 's':
            if not student:
                student = True
                startTime = time - startSessionTime + 82800000
                startTime = parseDate(startTime)
        else:
            if student:
                endTime = time - startSessionTime + 82800000
                endTime = parseDate(endTime)
                writeToDict(startTime, endTime, name, "Student")
                elapsedTime = endTime - startTime
                diff = elapsedTime.total_seconds()
                totalTime += diff
                student = False


    endSessionTime = parseDate(time - startSessionTime +82800000)
    endStopbar = parseDate(time - startSessionTime + 10000 +82800000)
    df.append(dict(Task=name, Start= endSessionTime, Finish= endStopbar, Resource="Stop"))
    totalSessionTime = endSessionTime - parseDate(82800000)
    totalSessionTimeS = totalSessionTime.total_seconds()
    timeUse.append(totalTime)
    percentageUse.append(round(totalTime/totalSessionTimeS,2))


def visualiseSA(path, name):
    # Open file
    f = open(path, 'r')
    firstLine = f.readline()
    # get the first time and value
    [startSessionTime,value] = parseLine(firstLine)
    sa = False
    startTime = parseDate(startSessionTime)
    totalTime = 0
    for line in f:
        [time, value] = parseLine(line)
        if value == 'b' or value == 'j':
            if not sa:
                sa = True
                startTime = time - startSessionTime + 82800000
                startTime = parseDate(startTime)
        else:
            if sa:
                endTime = time - startSessionTime + 82800000
                endTime = parseDate(endTime)
                writeToDict(startTime, endTime, name, "SA")
                elapsedTime = endTime - startTime
                diff = elapsedTime.total_seconds()
                totalTime += diff
                sa = False
    totalSessionTime = endSessionTime - parseDate(82800000)
    totalSessionTimeS = totalSessionTime.total_seconds()
    timeUseSA.append(totalTime)
    percentageUseSA.append(round(totalTime/totalSessionTimeS,2))


df = []
timeUse = []
percentageUse = []
timeUseSA = []
percentageUseSA = []
for file in os.listdir(pathJasper):
    if not file.startswith('.'):
        visualiseStudent( pathJasper + '/'+ file, file + "SA1")
        # visualiseSA( pathJasper + '/'+ file, file + "SA1")

for file in os.listdir(pathBart):
    if not file.startswith('.'):
        visualiseStudent(pathBart + '/'+ file, file + "SA2")
        # visualiseSA(pathBart + '/'+ file, file + "SA2")


print percentageUse
fig = ff.create_gantt(df, colors=colors, index_col='Resource', show_colorbar=True, group_tasks=True)
plotly.offline.plot(fig)
