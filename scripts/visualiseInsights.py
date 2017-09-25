import plotly
import plotly.plotly as py
import plotly.figure_factory as ff
import os

plotly.tools.set_credentials_file(username='martijn.millecamp', api_key='TYJyoUHlfhRpDa8CZUMU')
path = "/Users/martijn/Documents/Able/Data/evaluationJasper"
colors = {'Not Started': 'rgb(220, 0, 0)',
          'Incomplete': (1, 0.9, 0.16),
          'Complete': 'rgb(0, 255, 100)'}

def parseDate(date):
    date = date[:-1]
    date = date.replace('/', '-')
    [month,day,year] = date.split('-')
    return year + '-' + month + '-' + day

def parseLine(line):
    values = line.split()
    date = parseDate(values[0])
    date = '2017-01-01'
    return [date, values[1], values[4]]

def writeToDict(date, startTime, endTime, name):
    df.append(dict(Task="Session" + name, Start= date + ' ' + startTime, Finish= date + ' ' + endTime, Resource='Complete'))

def visualiseSession(path, name):
    f = open(path, 'r')

    firstLine = f.readline()
    [date, startTime,value] = parseLine(firstLine)
    begin = False
    beginSessionTime = startTime

    for line in f:
        [date, time, value] = parseLine(line)
        if value == 'dbb' and not begin:
            begin = True
            startTime = time
        elif value == 'dbe' and begin:
            endTime = time
            writeToDict(date, startTime, endTime, name)
            begin = False
    if begin:
        writeToDict(date, startTime, endTime, name)


df = []
for file in os.listdir(path):
    if not file.startswith('.'):
        print file
        visualiseSession(path + '/'+ file, file)
fig = ff.create_gantt(df, colors=colors, index_col='Resource', show_colorbar=True, group_tasks=True)
plotly.offline.plot(fig)


# df = [dict(Task="Job-1", Start='2017-01-01', Finish='2017-02-02', Resource='Complete'),
#       dict(Task="Job-1", Start='2017-02-15', Finish='2017-03-15', Resource='Incomplete'),
#       dict(Task="Job-2", Start='2017-01-17', Finish='2017-02-17', Resource='Not Started'),
#       dict(Task="Job-2", Start='2017-01-17', Finish='2017-02-17', Resource='Complete'),
#       dict(Task="Job-3", Start='2017-03-10', Finish='2017-03-20', Resource='Not Started'),
#       dict(Task="Job-3", Start='2017-04-01', Finish='2017-04-20', Resource='Not Started'),
#       dict(Task="Job-3", Start='2017-05-18', Finish='2017-06-18', Resource='Not Started'),
#       dict(Task="Job-4", Start='2017-01-14', Finish='2017-03-14', Resource='Complete')]
#
# colors = {'Not Started': 'rgb(220, 0, 0)',
#           'Incomplete': (1, 0.9, 0.16),
#           'Complete': 'rgb(0, 255, 100)'}
#
# fig = ff.create_gantt(df, colors=colors, index_col='Resource', show_colorbar=True, group_tasks=True)
# py.iplot(fig, filename='gantt-group-tasks-together', world_readable=True)
