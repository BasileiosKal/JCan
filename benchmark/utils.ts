import { CredentialGenerator } from "./randVCgenerator";
const fs = require('fs');
const spawn = require("child_process").spawnSync;
const path = require('path');



/**
 * Helping function. Given the number of blank nodes in the VCs (which specifies the path of the 
 * VCs, e.g "./benchmark/data/JSON_Credentials/BlankNodes_3/") and a range of claims to add in each blank
 * node, populates the credentials with that many (random) claims per BN.
 * 
 * @param BN_NUMBER The number of blank nodes that each credential will have
 * @param range The range of the claims to add to each blank node
 * @param dataPath the path of the data files (defaults to "./benchmark/data". see the createBenchData function bellow)
 * @param expand If true, expand the VC before saving to file (used to create JSON-LD data for benchmarking).
 */
const _BenchData = async (BN_NUMBER:string, range: number[], dataPath:string, expand: boolean = false) => {
  const VCgenerator = new CredentialGenerator()
  const path:string = dataPath + `/${(expand)? "JSON_LD_Credentials": "JSON_Credentials"}/BlankNodes_${BN_NUMBER}`;

  await VCgenerator.createRandCredentials(path, range, expand)
  
  console.log(`DONE: Generating random ${(expand)? "JSON LD" : "JSON"} credentials with ${BN_NUMBER} BNs`)
};



/**
 * Creates random VCs with different number of blank nodes(BNs) (2, 4, 8 and 16 BNs)
 * and claims per blank node.
 * 
 * @param dataPath Relative path to save the data for the benchmarking. Defaults to ./benchmark/data
 * @param claimsRange The number of claims to add to each blank node in a VC. 
 * @param expand If true, expand the VC before saving to file (used to create JSON-LD data for benchmarking).
 */
export const createBenchData = async (
  dataPath:string|null = null, 
  claimsRange: any, 
  expand: boolean = false) => {
    
    const BNs = Object.keys(claimsRange);

    const JSONorJSONLD = `${(expand)? "JSON_LD_Credentials": "JSON_Credentials"}` 
    console.log(`Creating ${JSONorJSONLD} bench data`)

    var absDataPath: string
    if (!dataPath){
        absDataPath = path.resolve("./benchmark/data");
    } else {absDataPath = path.resolve(dataPath)}

    // Python process that creates the files where the random JSON LD Credentials
    // will be saved.
    const createFolders = spawn("python", [
      "./benchmark/pyScripts/createFolders.py",
       absDataPath+`/${JSONorJSONLD}`])

    // Populate the files created by the python process with random credentials with different
    // numbers of blank nodes and claims. 
    _BenchData(BNs[0], claimsRange[BNs[0]], absDataPath, expand).catch((err) => {console.log(err.message)})
    _BenchData(BNs[1], claimsRange[BNs[1]], absDataPath, expand).catch((err) => {console.log(err.message)})
    _BenchData(BNs[2], claimsRange[BNs[2]], absDataPath, expand).catch((err) => {console.log(err.message)})
    _BenchData(BNs[3], claimsRange[BNs[3]], absDataPath, expand).catch((err) => {console.log(err.message)})
};



/**
 * Save the mean duration (in sec) of each benchmark to a specified .json file.
 * 
 * @param suite Benchmark suite 
 * @param saveTo Path to save the results
 */
export const getBenchStats = async (suite:any, saveTo: string|null) => {
    var resultsMap: any = {};
    suite.forEach(ell => {
      const BenchName = ell.name;
      
      const [BN_label, Claims_label] = BenchName.split("/");
      
      if (typeof resultsMap[BN_label] == "undefined") {
        resultsMap[BN_label] = {};
        resultsMap[BN_label][Claims_label] = ell.stats.mean;
      } else {
        resultsMap[BN_label][Claims_label] = ell.stats.mean;
      }
    })
  
    console.log("resultsMap = ", resultsMap);

    if (saveTo){
      fs.writeFile(saveTo, JSON.stringify(resultsMap, null, 2), (err)=>{
        if(err){console.log("ERROR while writing results to file.\n", err)}
      })
    }
};



export function range (from: number, to: number, step: number): number[]{
    return [...Array(Math.floor((to - from) / step) + 1)].map(
      (v, k) => from + k * step
    );
}

