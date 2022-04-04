import json
import os
import glob
import sys

JSON_FILE_NAME = "_perBNclaims.json"  #NOTE: An index will be added as a prefix to each file name.

"""Delets all existing json files in path"""
def deleteFiles(path):
	files = glob.glob(path+'/*.json')
	for f in files:
	    os.remove(f)

"""Creates the files where the credentials for the
benchmarking will be saved. The files will have names: {per_bn_claims}_claims.json"""
def createFolders(path, JSON_to_write, indexes):
	for index in indexes:
		VCfile = open(path+"/{i}".format(i = index)+JSON_FILE_NAME, "w")
		json.dump(JSON_to_write, VCfile)
		VCfile.close()
	print("Done")



# ------------------------------------------------------------------------------- #
# Create all the files.
# NOTE: the different number of fils allong with the different steps or
#       maxes in range has to do with the fact that in the end i want all
#       the credentials to have the same number of max claims (60 in this case)
#       no matter the number of blank nodes.
# ------------------------------------------------------------------------------- #

# TODO: accept the path from the user as a CLI argument

args = sys.argv
if len(args) == 1:
	raise  TypeError("The path for the data must be specified as an argument.")
elif len(args) > 2:
	raise TypeError("Expected 1 argument, got {d}".format(d=len(args)))
else:
	path = args[1] + "/BlankNodes_{BN_number}"

with open(path+"/../../meta.json") as meta:
	 metadata = json.load(meta)

BN_to_Claims = metadata["BN_to_Claims"]
BNs = list(BN_to_Claims.keys())
corePath = metadata["coresPath"]
print("BNs = ", BNs)

# For credentials with 2 blank nodea
BLANK_NODES = BNs[0]

with open(path+corePath+"/VC_core_1.json") as core:
	JSON_to_write = json.load(core)

print("Creating json files with {bn} blank node...".format(bn=BLANK_NODES), end="")
deleteFiles(path.format(BN_number = BLANK_NODES))
# createFolders(path.format(BN_number = BLANK_NODES), JSON_to_write, range(8, 41, 8))
createFolders(path.format(BN_number = BLANK_NODES), JSON_to_write, BN_to_Claims[BLANK_NODES])



# For credentials with 4 blank node
BLANK_NODES = BNs[1]

with open(path+corePath+"/VC_core_2.json") as core:
	JSON_to_write = json.load(core)

print("Creating json files with {bn} blank nodes...".format(bn=BLANK_NODES), end="")
deleteFiles(path.format(BN_number = BLANK_NODES))
# createFolders(path.format(BN_number = BLANK_NODES), JSON_to_write, range(4, 21, 4))
createFolders(path.format(BN_number = BLANK_NODES), JSON_to_write, BN_to_Claims[BLANK_NODES])



# For credentials with 8 blank node
BLANK_NODES = BNs[2]

with open(path+corePath+"/VC_core_3.json") as core:
	JSON_to_write = json.load(core)

print("Creating json files with {bn} blank nodes...".format(bn=BLANK_NODES), end="")
deleteFiles(path.format(BN_number = BLANK_NODES))
# createFolders(path.format(BN_number = BLANK_NODES), JSON_to_write, range(2, 11, 2))
createFolders(path.format(BN_number = BLANK_NODES), JSON_to_write, BN_to_Claims[BLANK_NODES])



# For credentials with 16 blank node
BLANK_NODES = BNs[3]

with open(path+corePath+"/VC_core_4.json") as core:
	JSON_to_write = json.load(core)

print("Creating json files with {bn} blank nodes...".format(bn=BLANK_NODES), end="")
deleteFiles(path.format(BN_number = BLANK_NODES))
# createFolders(path.format(BN_number = BLANK_NODES), JSON_to_write, range(1, 6, 1))
createFolders(path.format(BN_number = BLANK_NODES), JSON_to_write, BN_to_Claims[BLANK_NODES])