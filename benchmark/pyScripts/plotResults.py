import json
import matplotlib.pyplot as plt
import numpy as np

#CLAIMS = [16, 32, 48, 64, 80]
CLAIMS = [20, 40, 60, 80, 100]

# Read JSON results
with open('./benchmark/data/Results/JSONresults.json') as JSONresultFile:
	JSONdata = json.load(JSONresultFile)

JSONresults = {}
for BNlabel in JSONdata:
	JSONresults[BNlabel] = []
	for i in JSONdata[BNlabel]:
		JSONresults[BNlabel].append(JSONdata[BNlabel][i])

# Read JSONLD results
with open('./benchmark/data/Results/JSONLDresults.json') as JSONLDresultFile:
	JSONLDdata = json.load(JSONLDresultFile)

JSONLDresults = {}
for BNlabel in JSONLDdata:
	JSONLDresults[BNlabel] = []
	for i in JSONLDdata[BNlabel]:
		JSONLDresults[BNlabel].append(JSONLDdata[BNlabel][i])


# Global plot parameters
FIG_X = 12
FIG_Y = 10

JSON_LINE_CONFIG = {
	"linestyle": 'solid',
	"linewidth": 2,
	"marker": 'o',
	"markersize": 7.5
}

JSON_LD_LINE_CONFIG = {
	"linestyle": 'dashed',
	"linewidth": 2,
	"marker": '^',
	"markersize": 7.5
}

LEGEND_CONFIG = {
	"size": 15
}

params = {'axes.labelsize': 13,
          'axes.titlesize': 14}
plt.rcParams.update(params)

y_ticks_range = np.arange(0, 0.9, 0.1)
SAVE_TO = "C:/Users/Vasilis/Desktop/Thesis/Code/BbsJSONsignatures/Fast/benchmark/data/Results/figs"


# Plot the results
fig, ax = plt.subplots(2, 2, sharex=True, sharey=True, figsize=(FIG_X, FIG_Y))

# fig_BN2, ax_BN2 = plt.subplots(figsize=(FIG_X, FIG_Y))
# ax_BN2.plot(CLAIMS, np.multiply(np.array(JSONresults["BN_2"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
# ax_BN2.plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_2"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

# ax_BN2.set(xlabel='Claims', ylabel='msec',
#        title='Max Depth = 1. Blank Nodes = 2')
# ax_BN2.grid()
# plt.legend(prop = LEGEND_CONFIG)
# plt.yticks(y_ticks_range)
# plt.savefig(SAVE_TO+'/BN2.png')


ax[0,0].plot(CLAIMS, np.multiply(np.array(JSONresults["BN_2"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
ax[0,0].plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_2"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

ax[0,0].set(ylabel='msec',
       title='Max Depth = 2. Blank Nodes = 2')
ax[0,0].grid()



# fig_BN4, ax_BN4 = plt.subplots(figsize=(FIG_X, FIG_Y))
# ax_BN4.plot(CLAIMS, np.multiply(np.array(JSONresults["BN_4"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
# ax_BN4.plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_4"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

# ax_BN4.set(xlabel='Claims', ylabel='msec',
#        title='Max Depth = 2. Blank Nodes = 4')
# ax_BN4.grid()
# plt.legend(prop = LEGEND_CONFIG)
# plt.yticks(y_ticks_range)
# plt.savefig(SAVE_TO+'/BN4.png')


ax[0, 1].plot(CLAIMS, np.multiply(np.array(JSONresults["BN_4"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
ax[0, 1].plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_4"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

ax[0, 1].set( # xlabel='Claims', ylabel='msec',
       title='Max Depth = 4. Blank Nodes = 4')
ax[0, 1].grid()


# fig_BN8, ax_BN8 = plt.subplots(figsize=(FIG_X, FIG_Y))
# ax_BN8.plot(CLAIMS, np.multiply(np.array(JSONresults["BN_8"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
# ax_BN8.plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_8"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

# ax_BN8.set(xlabel='Claims', ylabel='msec',
#        title='Max Depth = 3. Blank Nodes = 8')
# ax_BN8.grid()
# plt.legend(prop = LEGEND_CONFIG)
# plt.yticks(y_ticks_range)
# plt.savefig(SAVE_TO+'/BN8.png')

ax[1, 0].plot(CLAIMS, np.multiply(np.array(JSONresults["BN_8"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
ax[1, 0].plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_8"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

ax[1, 0].set(xlabel='Claims', ylabel='msec',
       title='Max Depth = 8. Blank Nodes = 8')
ax[1, 0].grid()


# fig_BN16, ax_BN16 = plt.subplots(figsize=(FIG_X, FIG_Y))
# ax_BN16.plot(CLAIMS, np.multiply(np.array(JSONresults["BN_16"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
# ax_BN16.plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_16"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

# ax_BN16.set(xlabel='Claims', ylabel='msec',
#        title='Max Depth = 3. Blank Nodes = 16')
# ax_BN16.grid()
# plt.legend(prop = LEGEND_CONFIG)
# plt.yticks(y_ticks_range)
# plt.savefig(SAVE_TO+'/BN16.png')

ax[1, 1].plot(CLAIMS, np.multiply(np.array(JSONresults["BN_16"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
ax[1, 1].plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_16"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

ax[1, 1].set(xlabel='Claims',
       title='Max Depth = 16. Blank Nodes = 16')
ax[1, 1].grid()


plt.legend(prop = LEGEND_CONFIG)
plt.yticks(y_ticks_range)
plt.savefig(SAVE_TO+'/allBN_WorstCase.png')


plt.show()
