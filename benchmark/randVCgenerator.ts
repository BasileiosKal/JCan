import { randomBytes } from "crypto";
import fs from 'fs';
const jsonld = require('jsonld');


const KEY_VALUE_BYTES:number = 20;
const JSON_FILES_NAMES:string = "_perBNclaims.json";

export class CredentialGenerator {

    randKeyValuePair(
        sizeInBytes: number, 
        URL_PREFIX: string = "http://schema.org/"):string[]
        {
            const randKey:string = URL_PREFIX + randomBytes(sizeInBytes).toString('hex');
            const randValue:string =  randomBytes(sizeInBytes).toString('hex');
            return [randKey, randValue]
        };


    /**
     * Deletes all values in a credential exept the blank noodes
     * 
     * @param credential the credential to reset
     */
     private async _resetAndLoadCresential(path: string) {
        const Credential:any =  require(path);

        const _deleteValues = (VC: any) => {
            for (let key in VC) {
                if (!key.includes("BlankNode") && !Array.isArray(VC)) { 
                    delete VC[key]; 
                }
                else {_deleteValues(VC[key])}
            }

            return VC
        };

        const resetedVC = _deleteValues(Credential);

        return resetedVC
    }


    /**
     * Adds random claims to each blank node of the input credential
     * 
     * @param credential the credential to add the random claims to
     * @param claimsNumber the number of random claims to add to EACH blank node
     */
     private _addClaimsToBNs(credential: any, claimsNumber: number) {

        for (let key in credential) {

            if (key.includes("BlankNode_")) {
                for (let i=0; i<claimsNumber; i++) {
                    const [rand_key, rand_value] = this.randKeyValuePair(KEY_VALUE_BYTES);
                    credential[key][rand_key] = rand_value;
                }
            }
            
            if(typeof credential[key] == "object") {
                this._addClaimsToBNs(credential[key], claimsNumber)
            }
        }

        return credential
    }


    /**
     * Generates random credentials. The files of the credentials must already be
     * created in the smae file with names of the form ${TOTAL_CLAIMS_NUMBER}_claims.json.
     * 
     * @param FilePath The path to the file that the credentials will be saved ()
     * @param perBNclaims The number of claims to add to each blank node
     * @param from The minimum total number of claims
     * @param max The maximum total number of claims
     * @param step The step with which to add claims
     */
    async createRandCredentials(
        FilePath: string, 
        range: number[],
        expand: boolean) 
        {
        // TODO: Make if "for(let file in files)"
        for (let _claims of range){
            const path:string = FilePath + `/${_claims}`+JSON_FILES_NAMES

            // Try to read the credential from 'path'
            var Credential =  await this._resetAndLoadCresential(path).catch(
                (err) => {
                    if(err.code == 'MODULE_NOT_FOUND') {
                        console.log(
                            `ERROR: ./${_claims}_claims.json possible does not exist in ${FilePath}` +
                            ` You must create it manually first (with the desirable number of keys including "BlankNode").`);
                        console.log(err)
                            throw Error ("Stoping creation of credentials.")}
                        
                    });
            
            // Add claims to every blank node
            await this._addClaimsToBNs(Credential, _claims);

            // Add claims to the root of the credential
            // for (let _=0; _<_claims; _++) {
            //     const [key, value] = await this.randKeyValuePair(KEY_VALUE_BYTES);
            //     Credential[key] = value;
            // }
                        
            if(expand) {
                var Credential = await jsonld.expand(Credential)
            }
            
            // overide the curent credential file with the new one
            fs.writeFile(path, JSON.stringify(Credential, null, 2), (err) => {
                if(err){
                    console.log("ERROR while writing random VC to file.", err)
                };
            });
        }
    }
}
