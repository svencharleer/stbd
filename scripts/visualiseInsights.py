import plotly
import plotly.plotly as py
import plotly.figure_factory as ff
import os
import datetime

pathJasper = "/Users/martijn/Documents/Able/Data/evaluationJasper"
pathBart = "/Users/martijn/Documents/Able/Data/evaluationBart"

colors = {'Fact': 'rgb(215,48,39)',
          'Interpretative': 'rgb(254,224,144)',
          'Reflective': 'rgb(69,117,180)',
          'Stop': 'rgb(153,153,153)'}

def parseDate(ms):
    ms = int(ms)
    date = datetime.datetime.fromtimestamp(ms/1000)
    return date

def parseLine(line):
    # return ms as int and the value of my comment
    values = line.split()
    insights =  line.strip().split(';')
    if len(insights) > 1 and insights != '':
        insight = insights[1].strip()
    else:
        insight = 0
    return [int(values[3]), int(insight)]

def getEndTimeMS(path):
    f = open(path, 'r')
    for line in f:
        [time, value] = parseLine(line)
    return time

def getStartTimeMS(path):
    f = open(path, 'r')
    firstLine = f.readline()
    [startSessionTime,insight] = parseLine(firstLine)
    return startSessionTime

def writeToDict(startTime, endTime, name, resource):
    df.append(dict(Task=name, Start= startTime, Finish= endTime, Resource=resource))

def visualiseInsights(path, name):
    # Open file
    f = open(path, 'r')
    nbL1 = 0
    nbL2 = 0
    nbL3 = 0
    startSessionTimeMS = getStartTimeMS(path)
    startSessionTime = parseDate(0)
    endSessionTimeMS = getEndTimeMS(path)
    endSessionTime = parseDate(endSessionTimeMS - startSessionTimeMS)
    totalSessionTime = endSessionTime - startSessionTime
    totalSessionTimeS = totalSessionTime.total_seconds()
    print totalSessionTimeS

    for line in f:
        [time, insight] = parseLine(line)
        startTime = (time - startSessionTimeMS)
        startTime = startTime / totalSessionTimeS
        print startTime
        endTime = startTime +5
        startTime = parseDate(startTime*5000)
        endTime = parseDate(endTime*5000)

        if insight == 1:
            writeToDict(startTime, endTime, name, "Fact")
            nbL1 += 1
        elif insight == 2:
            writeToDict(startTime, endTime, name, "Interpretative")
            nbL2 += 2
        elif insight == 3:
            writeToDict(startTime, endTime, name, "Reflective")
            nbL3 += 1



df = []
for file in os.listdir(pathJasper):
    if not file.startswith('.'):
        visualiseInsights( pathJasper + '/'+ file, file + "SA1")

for file in os.listdir(pathBart):
    if not file.startswith('.'):
        # visualiseStudent(pathBart + '/'+ file, file + "SA2")
        visualiseInsights(pathBart + '/'+ file, file + "SA2")


fig = ff.create_gantt(df, colors=colors, index_col='Resource', show_colorbar=True, group_tasks=True)
plotly.offline.plot(fig)
