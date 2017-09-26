import plotly
import plotly.plotly as py
import plotly.figure_factory as ff
import os
import datetime

plotly.tools.set_credentials_file(username='martijn.millecamp', api_key='TYJyoUHlfhRpDa8CZUMU')
pathJasper = "/Users/martijn/Documents/Able/Data/evaluationJasper"
pathBart = "/Users/martijn/Documents/Able/Data/evaluationBart"

colors = {'Fact': 'rgb(255,237,160)',
          'Interpretative': 'rgb(254,178,76)',
          'Reflective': 'rgb(240,59,32)',
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


def writeToDict(startTime, endTime, name, resource):
    df.append(dict(Task=name, Start= startTime, Finish= endTime, Resource=resource))

def visualiseInsights(path, name):
    # Open file
    f = open(path, 'r')
    nbL1 = 0
    nbL2 = 0
    nbL3 = 0
    firstLine = f.readline()
    # get the first time and value
    [startSessionTime,insight] = parseLine(firstLine)
    for line in f:
        [time, insight] = parseLine(line)
        startTime = time - startSessionTime + 82800000
        endTime = startTime + 10000
        startTime = parseDate(startTime)
        endTime = parseDate(endTime)

        if insight == 1:
            writeToDict(startTime, endTime, name, "Fact")
            nbL1 += 1
        elif insight == 2:
            writeToDict(startTime, endTime, name, "Interpretative")
            nbL2 += 2
        elif insight == 3:
            writeToDict(startTime, endTime, name, "Reflective")
            nbL3 += 1


    endSessionTime = parseDate(time - startSessionTime + 82800000)
    endStopbar = parseDate(time - startSessionTime + 10000 + 82800000)
    df.append(dict(Task=name, Start= endSessionTime, Finish= endStopbar, Resource="Stop"))
    # print name
    # print nbL1
    # print nbL2
    # print nbL3



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
