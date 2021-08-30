import {createBenchData, range } from "./utils"

const CLAIMS1 = [[8, 16, 24, 32, 40],
                 [8, 16, 24, 32, 40],
                 [8, 16, 24, 32, 40],
                 [8, 16, 24, 32, 40]];

const CLAIMS2 = [[20, 40, 60, 80, 100],
                 [10, 20, 30, 40, 50],
                 [5, 10, 15, 20, 25],
                 [4, 8, 12, 16, 20]];

const Range1 = 
    [range(8, 40, 8),
     range(4, 20, 4),
     range(2, 10, 2),
     range(1, 5, 1)];

const meta: any = require("./data/meta.json")
const BN_Claims_Map = meta["BN_to_Claims"];

(async ()=>{
    await createBenchData(null, BN_Claims_Map);
    await createBenchData(null, BN_Claims_Map, true);
})()