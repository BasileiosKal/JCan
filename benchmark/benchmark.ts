'use strict'

import { JSONcredentialSync } from "../src";
import { getBenchStats } from "./utils"
var Benchmark = require('benchmark');
const jsonld = require('jsonld');
const {toRDF: _toRDF} = require("../node_modules/jsonld/lib/toRDF")
const urdna = require("./URDNA2015lib/URDNA2015Sync");
const fs = require("fs");


function runBenchJSON (strCredential: string) {
  const VCJSON = new JSONcredentialSync(strCredential);
  const claims = VCJSON.claims();
};


const runBenchJSON_LD = (expandedCredential: any) => {
  const URDNA = new urdna();
  const RDFdataset = _toRDF(expandedCredential, {format: 'application/n-quads'});
  // console.log("RDF DATA SET = ", RDFdataset);
  const CanonClaims = URDNA.main(RDFdataset);
}


// Load benchmarking metadata (Number of nodes ber VC and claims per node)
const meta: any = require("./data/meta.json")
const BN_Claims_Map = meta["BN_to_Claims"]
const BNs = Object.keys(BN_Claims_Map)
var Claims:any = []

// ------------------------------------------------------------------------------------------------ //
//                                 Bench for JSON Credential                                        //
// ------------------------------------------------------------------------------------------------ //

// Bench data are set up before the benchmarking. The alternative will be to use the "setup" funvtion of 
// Benchmark.ts.
var PATH_PRFX: string = `C:/Users/Vasilis/Desktop/AUEB/Thesis/Code/BbsJSONsignatures/Fast/benchmark/data/JSON_Credentials`;


// ------------------------------------ Set Up Bench Data ----------------------------------------- //

var strVCtoJSON = {}

for (let BN_NUMBER of BNs){
  strVCtoJSON[BN_NUMBER] = {};
  
  const ClaimsRange: number[] = BN_Claims_Map[BN_NUMBER];
  Claims.push(ClaimsRange)

  ClaimsRange.forEach((perBNclaims) => {
    const Credential:object =  require(PATH_PRFX+`/BlankNodes_${BN_NUMBER}/${perBNclaims}_perBNclaims.json`);
    strVCtoJSON[BN_NUMBER][perBNclaims] = JSON.stringify(Credential, null, 2);
    })
}

// ------------------------------------- Run Benchmark -------------------------------------------- //
const BenchJSON = () => {

  const suite = new Benchmark.Suite;

  suite
    .on('start', () => {
      console.log('Benchmarking JSON canonization...');
    })
    .on('cycle', event => {
      console.log(String(event.target));
    })
    .on('complete', () => {
        console.log('Done.');
      })

    // TODO: Fix the hardcoding
    .add(`BN_${BNs[0]}/CL_${Claims[0][0]}`, function(){runBenchJSON(strVCtoJSON[BNs[0]][Claims[0][0]])})
    .add(`BN_${BNs[0]}/CL_${Claims[0][1]}`,  function(){runBenchJSON(strVCtoJSON[BNs[0]][Claims[0][1]])})
    .add(`BN_${BNs[0]}/CL_${Claims[0][2]}`,  function(){runBenchJSON(strVCtoJSON[BNs[0]][Claims[0][2]])})
    .add(`BN_${BNs[0]}/CL_${Claims[0][3]}`,  function(){runBenchJSON(strVCtoJSON[BNs[0]][Claims[0][3]])})
    .add(`BN_${BNs[0]}/CL_${Claims[0][4]}`,  function(){runBenchJSON(strVCtoJSON[BNs[0]][Claims[0][4]])})

    .add(`BN_${BNs[1]}/CL_${Claims[1][0]}`, function(){runBenchJSON(strVCtoJSON[BNs[1]][Claims[1][0]])})
    .add(`BN_${BNs[1]}/CL_${Claims[1][1]}`,  function(){runBenchJSON(strVCtoJSON[BNs[1]][Claims[1][1]])})
    .add(`BN_${BNs[1]}/CL_${Claims[1][2]}`,  function(){runBenchJSON(strVCtoJSON[BNs[1]][Claims[1][2]])})
    .add(`BN_${BNs[1]}/CL_${Claims[1][3]}`,  function(){runBenchJSON(strVCtoJSON[BNs[1]][Claims[1][3]])})
    .add(`BN_${BNs[1]}/CL_${Claims[1][4]}`,  function(){runBenchJSON(strVCtoJSON[BNs[1]][Claims[1][4]])})
    
    .add(`BN_${BNs[2]}/CL_${Claims[2][0]}`, function(){runBenchJSON(strVCtoJSON[BNs[2]][Claims[2][0]])})
    .add(`BN_${BNs[2]}/CL_${Claims[2][1]}`,  function(){runBenchJSON(strVCtoJSON[BNs[2]][Claims[2][1]])})
    .add(`BN_${BNs[2]}/CL_${Claims[2][2]}`,  function(){runBenchJSON(strVCtoJSON[BNs[2]][Claims[2][2]])})
    .add(`BN_${BNs[2]}/CL_${Claims[2][3]}`,  function(){runBenchJSON(strVCtoJSON[BNs[2]][Claims[2][3]])})
    .add(`BN_${BNs[2]}/CL_${Claims[2][4]}`,  function(){runBenchJSON(strVCtoJSON[BNs[2]][Claims[2][4]])})

    .add(`BN_${BNs[3]}/CL_${Claims[3][0]}`, function(){runBenchJSON(strVCtoJSON[BNs[3]][Claims[3][0]])})
    .add(`BN_${BNs[3]}/CL_${Claims[3][1]}`,  function(){runBenchJSON(strVCtoJSON[BNs[3]][Claims[3][1]])})
    .add(`BN_${BNs[3]}/CL_${Claims[3][2]}`,  function(){runBenchJSON(strVCtoJSON[BNs[3]][Claims[3][2]])})
    .add(`BN_${BNs[3]}/CL_${Claims[3][3]}`,  function(){runBenchJSON(strVCtoJSON[BNs[3]][Claims[3][3]])})
    .add(`BN_${BNs[3]}/CL_${Claims[3][4]}`,  function(){runBenchJSON(strVCtoJSON[BNs[3]][Claims[3][4]])})

    .run();

  getBenchStats(suite, "./benchmark/data/Results/JSONresults.json")
};



// ------------------------------------------------------------------------------------------------ //
//                            Bench for JSON LD Credential Canonize                                 //
// ------------------------------------------------------------------------------------------------ //

// ----------------------------------- Set Up Bench Data ------------------------------------------ //
const PATH_PRFX_LD: string = "C:/Users/Vasilis/Desktop/AUEB/Thesis/Code/BbsJSONsignatures/Fast/benchmark/data/JSON_LD_Credentials";

var strVCsJSON_LD = {}
for (let BN_NUMBER of BNs){
  strVCsJSON_LD[BN_NUMBER] = {};
  const ClaimsRange: number[] = BN_Claims_Map[BN_NUMBER];


  ClaimsRange.forEach((perBNclaims) => {
    const CredentialLD:object = require(PATH_PRFX_LD+`/BlankNodes_${BN_NUMBER}/${perBNclaims}_perBNclaims.json`);
    strVCsJSON_LD[BN_NUMBER][perBNclaims] = CredentialLD;
  })
}

const BenchJSONLD = () => {

// ------------------------------------- Run Benchmark -------------------------------------------- //
const suite = new Benchmark.Suite;

  suite
    .on('start', () => {
      console.log('Benchmarking JSON LD canonization...');
    })
    .on('cycle', event => {
      console.log(String(event.target));
    })
    .on('complete', () => {
        console.log('Done.');
      })

    // TODO: Fix the hardcoding   
    .add(`BN_${BNs[0]}/CL_${Claims[0][0]}`, function(){runBenchJSON_LD(strVCsJSON_LD[BNs[0]][Claims[0][0]])})
    .add(`BN_${BNs[0]}/CL_${Claims[0][1]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[0]][Claims[0][1]])})
    .add(`BN_${BNs[0]}/CL_${Claims[0][2]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[0]][Claims[0][2]])})
    .add(`BN_${BNs[0]}/CL_${Claims[0][3]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[0]][Claims[0][3]])})
    .add(`BN_${BNs[0]}/CL_${Claims[0][4]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[0]][Claims[0][4]])})

    .add(`BN_${BNs[1]}/CL_${Claims[1][0]}`, function(){runBenchJSON_LD(strVCsJSON_LD[BNs[1]][Claims[1][0]])})
    .add(`BN_${BNs[1]}/CL_${Claims[1][1]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[1]][Claims[1][1]])})
    .add(`BN_${BNs[1]}/CL_${Claims[1][2]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[1]][Claims[1][2]])})
    .add(`BN_${BNs[1]}/CL_${Claims[1][3]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[1]][Claims[1][3]])})
    .add(`BN_${BNs[1]}/CL_${Claims[1][4]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[1]][Claims[1][4]])})
    
    .add(`BN_${BNs[2]}/CL_${Claims[2][0]}`, function(){runBenchJSON_LD(strVCsJSON_LD[BNs[2]][Claims[2][0]])})
    .add(`BN_${BNs[2]}/CL_${Claims[2][1]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[2]][Claims[2][1]])})
    .add(`BN_${BNs[2]}/CL_${Claims[2][2]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[2]][Claims[2][2]])})
    .add(`BN_${BNs[2]}/CL_${Claims[2][3]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[2]][Claims[2][3]])})
    .add(`BN_${BNs[2]}/CL_${Claims[2][4]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[2]][Claims[2][4]])})

    .add(`BN_${BNs[3]}/CL_${Claims[3][0]}`, function(){runBenchJSON_LD(strVCsJSON_LD[BNs[3]][Claims[3][0]])})
    .add(`BN_${BNs[3]}/CL_${Claims[3][1]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[3]][Claims[3][1]])})
    .add(`BN_${BNs[3]}/CL_${Claims[3][2]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[3]][Claims[3][2]])})
    .add(`BN_${BNs[3]}/CL_${Claims[3][3]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[3]][Claims[3][3]])})
    .add(`BN_${BNs[3]}/CL_${Claims[3][4]}`,  function(){runBenchJSON_LD(strVCsJSON_LD[BNs[3]][Claims[3][4]])})

    .run();

  getBenchStats(suite, "./benchmark/data/Results/JSONLDresults.json")
};




// ------------------------------------------------------------------------------------------------ //
//                             Bench for JSON LD Credential Expand                                  //
// ------------------------------------------------------------------------------------------------ //
const BenchJSONLDexpand = () => {
  const ExpSuite = new Benchmark.Suite;

  ExpSuite    
  .on('start', () => {
    console.log('Benchmarking JSON LD Expand...');
  })
  .on('cycle', event => {
    const s = event.target.stats;
    console.log(String(event.target));
    console.log(`  deviation:${s.deviation} mean:${s.mean}`);
  })
  .on('complete', () => {
      console.log('Done.');
      
    })
  .add({
    name: `BN_${BNs[3]}/CL_${Claims[3][0]}`,
    defer: true,
    fn: function(deferred){
      jsonld.expand(JSON.parse(strVCtoJSON[BNs[3]][Claims[3][0]])).then(() => deferred.resolve());
    }
  })
  .add({
    name: `BN_${BNs[3]}/CL_${Claims[3][1]}`,
    defer: true,
    fn: function(deferred){
      jsonld.expand(JSON.parse(strVCtoJSON[BNs[3]][Claims[3][1]])).then(() => deferred.resolve());
    }
  })
  .add({
    name: `BN_${BNs[3]}/CL_${Claims[3][2]}`,
    defer: true,
    fn: function(deferred){
      jsonld.expand(JSON.parse(strVCtoJSON[BNs[3]][Claims[3][2]])).then(() => deferred.resolve());
    }
  })
  .add({
    name: `BN_${BNs[3]}/CL_${Claims[3][3]}`,
    defer: true,
    fn: function(deferred){
      jsonld.expand(JSON.parse(strVCtoJSON[BNs[3]][Claims[3][3]])).then(() => deferred.resolve());
    }
  })
  .add({
    name: `BN_${BNs[3]}/CL_${Claims[3][4]}`,
    defer: true,
    fn: function(deferred){
      jsonld.expand(JSON.parse(strVCtoJSON[BNs[3]][Claims[3][4]])).then(() => deferred.resolve());
    }
  })
  .run({async: true})

}

BenchJSON();
BenchJSONLD();
// BenchJSONLDexpand();

// runBenchJSON_LD(strVCsJSON_LD[BNs[0]][Claims[0][0]]);