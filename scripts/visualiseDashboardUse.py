import plotly
import plotly.plotly as py
import plotly.figure_factory as ff
import os
import datetime

plotly.tools.set_credentials_file(username='martijn.millecamp', api_key='TYJyoUHlfhRpDa8CZUMU')
pathJasper = "/Users/martijn/Documents/Able/Data/evaluationJasper"
pathBart = "/Users/martijn/Documents/Able/Data/evaluationBart"

colors = {'Exp': 'rgb(239,138,98)',
          'Unexp': 'rgb(103,169,207)',
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
    df.append(dict(Task=name + '_' + resource, Start= startTime, Finish= endTime, Resource=resource))

def visualiseSession(path, name, resource):
    # Open file
    f = open(path, 'r')
    firstLine = f.readline()
    # get the first time and value
    [startSessionTime,value] = parseLine(firstLine)
    begin = False
    # startTime in ms as int
    startTime = parseDate(startSessionTime)
    totalTime = 0;
    for line in f:
        [time, value] = parseLine(line)
        if value == 'dbb' and not begin:
            begin = True
            startTime = time - startSessionTime + 82800000
            startTime = parseDate(startTime)
        elif value == 'dbe' and begin:
            endTime = time - startSessionTime + 82800000
            endTime = parseDate(endTime)
            elapsedTime = endTime - startTime
            diff = elapsedTime.total_seconds()
            totalTime += diff
            writeToDict(startTime, endTime, name, resource)
            begin = False
    # if i forgot the last dbe
    if begin:
        endTime = time - startSessionTime + 82800000
        endTime = parseDate(endTime)
        writeToDict(startTime, endTime, name, resource)
    endSessionTime = parseDate(time - startSessionTime + 82800000)
    endStopbar = parseDate(time - startSessionTime + 10000 + 82800000)
    df.append(dict(Task=name + '_' + resource, Start= endSessionTime, Finish= endStopbar, Resource="Stop"))
    totalSessionTime = endSessionTime - parseDate(82800000)
    totalSessionTimeS = totalSessionTime.total_seconds()
    timeUse.append(totalTime)
    percentageUse.append(round(totalTime/totalSessionTimeS,2))

df = []
timeUse = []
percentageUse = []
for file in os.listdir(pathJasper):
    if not file.startswith('.'):
        visualiseSession( pathJasper + '/'+ file, file, 'Exp')

for file in os.listdir(pathBart):
    if not file.startswith('.'):
        visualiseSession(pathBart + '/'+ file, file, 'Unexp')
fig = ff.create_gantt(df, colors=colors, index_col='Resource', show_colorbar=True, group_tasks=True)
plotly.offline.plot(fig)
# print timeUse
print percentageUse
