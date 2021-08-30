const MAX_KEY_LENGTH = 100;


export class JSONcredential {
    parsedVC: any

    constructor(JSONstr: string) {
        this.parsedVC = this.secureJSONparse(JSONstr);
    };


    /**
     * Sanitization logic of the result of the credential's parsing.
     * 
     * @param VC the result of parsing the credential with JSON.parse()
     */
    async VC_sanitize(VC: any) {    
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
    KeyValue_sanitize(key: string, value: any) {
        
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


    /**
     * Parses the credential (using JSON.parse()) and applyies the 
     * sanitization logic.
     * 
     * @param ContexResolver A ContexResolver object that resolves the keys of the 
     *                       credential from a localy cashed contex.
     * @returns the parsed credential if parsing successful, null otherwise
     */
    async secureJSONparse(JSONfile: any): Promise<object | null> {
        try{
            const parsedJSON = JSON.parse(JSONfile, (key, value) => {
                //this.KeyValue_sanitize(key, value);
                return value;
                }
            );
            
            await this.VC_sanitize(parsedJSON);

            return parsedJSON;

        } catch(err) {
            console.log("ERROR: At 'secureJSONparse': ", err.message)
        }

        return null;
    };


    /**
     * Recursive function that returns the list of the claims to be signed and the
     * core of the credential.
     * 
     * @param parsedJSON parsed credential as returned by JSON.parse.
     * @param claimList list of claims to be returned in the end.
     * @param claim current claim that the function constructs in each recursion.
     * 
     * @returns list of the claims to be signed.
     */
    private async _getClaims(
        parsedJSON: any, 
        claimList: string[] = [],
        claim: string[] = []): Promise<any[]>
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

        return claimList;
    };


    /**
     * Parses the credential and returns the list of claims
     * 
     * @returns if the credential is parsed corectly, the list of claims, null otherwise
     */
    async claims(): Promise<string[] | null>{
        
        const parsedJSONVC = await this.parsedVC;
        let VC_core = {...parsedJSONVC};

        if(parsedJSONVC){
            const resList = await this._getClaims(parsedJSONVC, VC_core);
            return resList  // TODO: filter ellements with length(value) == 0
        }
        
        return null
    }

}
