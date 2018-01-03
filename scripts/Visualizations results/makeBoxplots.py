import pandas
import matplotlib.pyplot as plt


pathScores = "/Users/martijn/Documents/Able/Data/questionnaires.csv"
color = dict(boxes='DarkGreen', whiskers='DarkOrange',medians='DarkBlue', caps='Gray')
df = pandas.read_csv(pathScores, sep=',')
df.plot.box(vert=False, color=color, sym='r+', positions=[14,13,12,11,10,9,8,7,6,5,4,3,2,1])
plt.title('Scores of questionnaires', fontsize=20, fontweight='bold')

plt.xlabel('Scores')
xlabels = ['Strongly disagree','Disagree','Partially Agree','Agree','Strongly Agree']
x = [1,2,3,4,5]
plt.xticks(x, xlabels, rotation=0)

plt.ylabel('Questions')
ylabels = ['clarying & surveyable', 'my information correct', 'peer position reliable',
'insight in study', 'added value to conversation',
'provides insights', 'aware', 'future learning situation', 'reflect', 'stimulates', 'deliberate',
'planning', 'next key moment', 'consult on my own']
y = [14,13,12,11,10,9,8,7,6,5,4,3,2,1]
plt.yticks(y, ylabels)

plt.show()
