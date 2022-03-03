import uuid from 'react-uuid'
import axios from "axios";

class B_Store {
    constructor() {
        this.baseURL = 'http://localhost:3000/';
        this.kundenData = [];
        
    }

    getKundenData() {
        return this.kundenData;
    }

    async sendKunde(_kunde){
        const _query = `mutation {createKunde(kunde: {firstName : "${_kunde.firstName}" lastName : "${_kunde.lastName}" about : "${_kunde.about}" id :"dce3f166"})} `;
        try {
            const result = await axios({
                url: 'http://localhost:3000/graphql',
                method: 'post',
                data: {
                  query: _query
                }
              })
        return true;
            
        } catch (error) {
            console.log("error",error);
            return false;
        }
        
    }
     async loadKunde(){
        console.log("loadKunde start");
        const _query = `query {loadKunde {processData}}`;
        try {
            console.log("loadKunde vor axios");
            const result = await await axios({
                url: 'http://localhost:3000/graphql',
                method: 'post',
                data: {
                  query: _query
                }
              })
            console.log("loadKunde nach axios");
            this.kundenData = result.data.data;
            console.log(this.kundenData);

            
        } catch (error) {
            console.log("error",error);
            this.kundenData = [];
        }

        console.log("loadKunde ende");
        
    }
 
}
 

const store = new B_Store();

    export default store;
