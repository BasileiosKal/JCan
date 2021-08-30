const MAX_KEY_LENGTH = 100;


export class JSONcredentialSync {
    parsedVC: any

    constructor(JSONfile: string) {
        this.parsedVC = this._secureJSONparse(JSONfile);
    };


    /**
     * Parses the credential (using JSON.parse()) and applyies the 
     * sanitization logic.
     * 
     * @param ContexResolver A ContexResolver object that resolves the keys of the 
     *                       credential from a localy cashed contex.
     * @returns the parsed credential if parsing successful, null otherwise
     */
    private _secureJSONparse(JSONfile: any): object | null {
        try{
            const parsedJSON = JSON.parse(JSONfile, (key, value) => {
                this._KeyValue_sanitize(key, value);
                return value;
                }
            );
            
            this._VC_sanitize(parsedJSON);

            return parsedJSON;

        } catch(err) {
            console.log("ERROR: At 'secureJSONparse': ", err.message)
        }

        return null;
    };


    /**
     * BFS type recursive function that returns the list of the claims to be signed and the
     * core of the credential.
     * 
     * @param parsedJSON parsed credential as returned by JSON.parse.
     * @param claimList list of claims to be returned in the end.
     * @param claim current claim that the function constructs in each recursion.
     * 
     * @returns list of the claims to be signed.
     */
    private _getClaims(
        parsedJSON: any, 
        claimList: string[] = [],
        claim: string[] = []): any[]
    {

        for (let key in parsedJSON) {
            claim.push(key);

            const value: any = parsedJSON[key];

            if (typeof value == "object") {
                this._getClaims(value, claimList, claim);
            } else { 
                claimList.push(claim.map(elem => `<${elem}>`).join("") + " " + value);
                claim.pop();
            };
                
        };
        
        claim.pop() 

        // return [claimList, JSON.stringify(VC_core)];
        return claimList;
    };


    /**
     * Parses the credential and returns the list of claims
     * 
     * @returns if the credential is parsed corectly, the list of claims, null otherwise
     */
    claims(): string[] | null
    {
        if(this.parsedVC){
            // The VC_core is set here as a copy of the VC. 
            // Later all of its values will be deleted living only the core.

            const resList = this._getClaims(this.parsedVC);

            return resList   // TODO: filter ellements with length(value) == 0
        }
        
        return null
    }


    /**
     * Sanitization logic of the result of the credential's parsing.
     * 
     * @param VC the result of parsing the credential with JSON.parse()
     */
    private _VC_sanitize(VC: any) {    
        let VCtype: string | boolean = false;

        if (typeof VC != "object"){
            VCtype = typeof VC
            
        } else {
            if (Array.isArray(VC)) {
                VCtype = "Array";
            } else if (VC == null) {
                VCtype = "null"
            }
        };

        if (VCtype) {
            throw new Error(`Expected credential with key/value pairs. Got ${VCtype} instead`);
        };
        }
    
    
    /**
     * Sanitization logic of the key/value pairs of the credential.
     * 
     * @param key One of the credential's keys
     * @param value The credential's value coresponding to the key
     */
    private _KeyValue_sanitize(key: string, value: any) {
        
        // check the keys for '<', '>' or white spaces
        if (/\s|\<|\>/.test(key)) {
            throw new TypeError (`At "${key}".Credential keys must not contain '<' or '>' or white spaces.`);
        };

        // check the values for '<', '>' or white spaces 
        if (typeof value == "string") {
            if (/\s|\<|\>/.test(value)) {
                throw new TypeError (`At "${value}". Credential values must not contain '<' or '>' or white spaces.`);
            }
        }

        if (key.length > MAX_KEY_LENGTH) {
            throw new TypeError (`Credential keys must be strings of length <= ${MAX_KEY_LENGTH}`);
        };
    
    };

}
