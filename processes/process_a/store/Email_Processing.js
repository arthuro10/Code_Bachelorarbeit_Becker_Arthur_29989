import uuid from 'react-uuid'
import axios from "axios";

class Email_ProcessingStore {
    constructor() {
        this.baseURL = 'http://localhost:3000/';
        
    }
    emailProcess = {};

    setEmailProcess(item) {
        const _query = ''

        this.emailProcess = item;
    }

    saveEmailAdresses = async () => {
      const _query = 'mutation {saveEmailAdress {name role tasks id} }'
      try {
        const stringData = await axios({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
            query: _query
          }
        })
        
      } catch (error) {
        console.log('error saveEmailAdresses',error);
      }
      
    }

    showEmailProcesses(){
        return this.emailProcess
    }

    fetchEmailset(type) {
        const whichOne = type;
        axios({
            url: 'http://localhost:3000/graphql',
            method: 'post',
            data: {
              query: `
                query {
                  mailset {${whichOne}}
                  }
                `
            }
          }).then((result) => {
            return result.data.data.mailset
          });
    }

   


 


}
 

const store = new Email_ProcessingStore();

    export default store;
