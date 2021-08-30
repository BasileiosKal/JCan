import json

PATH_PRFX = "C:/Users/Vasilis/Desktop/Thesis/Code/BbsJSONsignatures/Fast/benchmark"

# Read JSON results
with open(PATH_PRFX+'/data/Results/JSONresults.json') as JSONresultFile:
	JSONdata = json.load(JSONresultFile)

JSONresults = {}
for BNlabel in JSONdata:
	JSONresults[BNlabel] = []
	for i in JSONdata[BNlabel]:
		JSONresults[BNlabel].append(JSONdata[BNlabel][i])

# Read JSONLD results
with open(PATH_PRFX+'/data/Results/JSONLDresults.json') as JSONLDresultFile:
	JSONLDdata = json.load(JSONLDresultFile)

JSONLDresults = {}
for BNlabel in JSONLDdata:
	JSONLDresults[BNlabel] = []
	for i in JSONLDdata[BNlabel]:
		JSONLDresults[BNlabel].append(JSONLDdata[BNlabel][i])


pers = {}

for key in JSONresults:
	pers[key] = {}
	for i in range(0, 5):
		pers[key][i] = (JSONLDresults[key][i])/JSONresults[key][i]

print(pers)
