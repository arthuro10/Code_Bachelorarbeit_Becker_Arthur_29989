const { v4: uuidv4 } = require('uuid');
const { GraphQLJSON, GraphQLJSONObject} = require('graphql-type-json');
const validator = require('validator');


const { Model } = require('objection');
const knex = require('knex');
const config = require('../../../server/database/knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

Model.knex(database);

const business_process = require('../../../server/database/models/Prozess');




module.exports = { 
    resolver: {
        JSON: { 
            __serialize(value) {
            return GraphQLJSONObject.parseValue(value);
            }
        },
        createAntrag: async ({antragsDaten}) => {
            console.log(antragsDaten);
            const { vorname } = antragsDaten;
            const { nachname }  = antragsDaten;
            const { abteilung } = antragsDaten;
            const { info } = antragsDaten;
            const { id } = antragsDaten;

            const newProcess = {
                processData: JSON.stringify({
                vorname : vorname,
                nachname : nachname,
                abteilung : abteilung,
                info: info,
            }),
        }
        try {
            const doneNewProcess = await business_process.query().patch({ processData : newProcess.processData })
            .where('id', '=', id);
            console.log("DONE");
            return true;
        } catch (error) {
            console.log("error");
            console.log(error);
            return false;
        }
        },
        getAntrag: async ({id}) => {
            console.log(id);
            try {
                const doneNewProcess = await business_process.query()
                .where('id', '=', id);
                console.log("DONE");
                console.log(doneNewProcess);
                const parsedInkrement = JSON.parse(doneNewProcess[0].processInkrement);
                const predeccesorId = parsedInkrement.predeccesor
                const newData = await business_process.query()
                .where('id', '=', predeccesorId);
                console.log(newData[0]);
                const returnData = JSON.parse(newData[0].processData);
                return returnData;
            } catch (error) {
                console.log("error");
                console.log(error);
                return false;
            }

        },
        updateAntrag: async ({type, antragsDaten}) => {
            console.log(antragsDaten);
            console.log(type);
            const processData =  JSON.stringify({
                vorname : antragsDaten.vorname,
                nachname : antragsDaten.nachname,
                abteilung : antragsDaten.abteilung,
                info: antragsDaten.info,
                erlaubnis : type
            })
            try {
                const doneNewProcess = await business_process.query().patch({ processData : processData })
                .where('id', '=', antragsDaten.id);
                console.log("DONE");
                
                return true;
            } catch (error) {
                console.log("error");
                console.log(error);
                return false;
            }


        }

    },
    schema: {
        _types : `type urlaubsantrag {
            vorname : String!
            nachname : String!
            abteilung: String!
            info: String!
            erlaubnis: String
        }`,
          _input : `
          input urlaubsantragInput {
            id : ID!
            vorname : String!
            nachname : String!
            abteilung: String!
            info: String!
        }`,
          _query : `getAntrag(id : ID!): urlaubsantrag!`,
          _mutation : `createAntrag(antragsDaten: urlaubsantragInput): Boolean!
          updateAntrag(type: Boolean!, antragsDaten: urlaubsantragInput): Boolean!`,
    }
     
     
}
