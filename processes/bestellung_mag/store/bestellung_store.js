import uuid from 'react-uuid'
import axios from "axios";

class Bestellung_Mag_Store {
    constructor() {
        this.baseURL = 'http://localhost:3000/';
        this.antragsData = [];
        
    }

    getKundenData() {
        return this.antragsData;
    }
    
    sendEmail(_sender, _receiver,_text,_subject) {
        return (`
        mutation {sendEmail(emailSet: {
          sender : "${_sender}" 
          receiver : "${_receiver}" 
          text : "${_text}" 
          subject : "${_subject}" 
            }) 
          }
        `)
    }

    async sendAntragsData(_antragsData){
        const _query = `mutation {createAntrag(antragsDaten: {vorname : "${_antragsData.firstName}" nachname : "${_antragsData.lastName}" abteilung : "${_antragsData.abteilung}" info : "${_antragsData.info}" id :"${_antragsData.id}"})} `;
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
     async loadKunde(id){
        console.log("loadKunde start");
        const _query = `query {getAntrag(id : "${id}") {processData}}`;
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
 

const store = new Bestellung_Mag_Store();

    export default store;
