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
JSON_LINE_CONFIG = {
	"linestyle": 'solid',
	"linewidth": 3,
	"marker": 'o',
	"markersize": 12
}

JSON_LD_LINE_CONFIG = {
	"linestyle": 'dashed',
	"linewidth": 3,
	"marker": '^',
	"markersize": 12
}

LEGEND_CONFIG = {
	"size": 22
}

params = {'axes.labelsize': 19,
          'axes.titlesize': 20}
plt.rcParams.update(params)



def plotMeanResults():
	FIG_X = 12
	FIG_Y = 7
	x_axis = [2, 4, 8, 16]
	y_axis_json = [np.mean(np.array(JSONresults["BN_2"])),
				   np.mean(np.array(JSONresults["BN_4"])),
			       np.mean(np.array(JSONresults["BN_8"])),
				   np.mean(np.array(JSONresults["BN_16"]))]


	y_axis_json_ld = [np.mean(np.array(JSONLDresults["BN_2"])),
					 np.mean(np.array(JSONLDresults["BN_4"])),
					 np.mean(np.array(JSONLDresults["BN_8"])),
					 np.mean(np.array(JSONLDresults["BN_16"]))]


	sds_json = [np.std(np.array(JSONresults["BN_2"])),
				np.std(np.array(JSONresults["BN_4"])),
				np.std(np.array(JSONresults["BN_8"])),
				np.std(np.array(JSONresults["BN_16"]))]

	sds_json_ld = [np.std(np.array(JSONLDresults["BN_2"])),
				  np.std(np.array(JSONLDresults["BN_4"])),
				  np.std(np.array(JSONLDresults["BN_8"])),
				  np.std(np.array(JSONLDresults["BN_16"]))]

	fig_total, ax_total = plt.subplots(figsize=(FIG_X, FIG_Y))

	ERR_BARS_CONFIG = {
		"ecolor": 'black',
		# "alpha": 0.9,
		"capsize": 5
	}

	ax_total.errorbar(x_axis, np.multiply(np.array(y_axis_json), 1000),
			yerr = np.multiply(np.array(sds_json), 1000),
			**ERR_BARS_CONFIG, 
			**JSON_LINE_CONFIG, 
			label="JCan")

	ax_total.errorbar(x_axis, np.multiply(np.array(y_axis_json_ld), 1000),
			yerr = np.multiply(np.array(sds_json_ld), 1000), 
			**ERR_BARS_CONFIG, 
			**JSON_LD_LINE_CONFIG, 
			label="URDNA")

	ax_total.set_xlabel('Number of nested objects')
	ax_total.set_ylabel('Mean time (msec)')
	plt.legend(prop = LEGEND_CONFIG)
	plt.xticks(fontsize = 16)
	plt.yticks(fontsize = 16)

	ax_total.set_title('Benchmarking Results', fontsize=22)

	plt.show()




def plotSeparateResults():
	FIG_X = 12
	FIG_Y = 8
	y_ticks_range = np.arange(0, 2.5, 0.5)

	# Plot the results
	fig, ax = plt.subplots(2, 2, sharex=True, sharey=True, figsize=(FIG_X, FIG_Y))

	ax[0,0].plot(CLAIMS, np.multiply(np.array(JSONresults["BN_2"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
	ax[0,0].plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_2"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

	ax[0,0].set(ylabel='msec',
	       title='Max Depth = 2. Blank Nodes = 2')
	ax[0,0].grid()


	ax[0, 1].plot(CLAIMS, np.multiply(np.array(JSONresults["BN_4"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
	ax[0, 1].plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_4"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

	ax[0, 1].set( # xlabel='Claims', ylabel='msec',
	       title='Max Depth = 4. Blank Nodes = 4')
	ax[0, 1].grid()


	ax[1, 0].plot(CLAIMS, np.multiply(np.array(JSONresults["BN_8"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
	ax[1, 0].plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_8"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

	ax[1, 0].set(xlabel='Claims', ylabel='msec',
	       title='Max Depth = 8. Blank Nodes = 8')
	ax[1, 0].grid()


	ax[1, 1].plot(CLAIMS, np.multiply(np.array(JSONresults["BN_16"]), 1000), **JSON_LINE_CONFIG, label = "JSON")
	ax[1, 1].plot(CLAIMS, np.multiply(np.array(JSONLDresults["BN_16"]), 1000), **JSON_LD_LINE_CONFIG, label = "JSON LD")

	ax[1, 1].set(xlabel='Claims',
	       title='Max Depth = 16. Blank Nodes = 16')
	ax[1, 1].grid()



	plt.legend(prop = LEGEND_CONFIG)
	plt.yticks(y_ticks_range)

	plt.show()


plotMeanResults()