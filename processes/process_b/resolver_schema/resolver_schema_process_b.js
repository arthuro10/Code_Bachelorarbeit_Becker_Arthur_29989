const { v4: uuidv4 } = require('uuid');
const { GraphQLJSON, GraphQLJSONObject} = require('graphql-type-json');
const validator = require('validator');
let nodemailer = require('nodemailer');

const { Model } = require('objection');
const knex = require('knex');
const config = require('../../../server/database/knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

Model.knex(database);

const business_process = require('../../../server/database/models/Prozess');

// CRUD Methods
const crudFunctions = require('../../../server/graphql/methods/crud');

const readAllProcesses = crudFunctions.readAllProcesses;
const readProcess = crudFunctions.readProcess;
const updateProcess = crudFunctions.updateProcess;
const createProcess = crudFunctions.createProcess;
const deleteProcess = crudFunctions.deleteProcess;


module.exports = { 
    resolver: {
        JSON: { 
            __serialize(value) {
            return GraphQLJSONObject.parseValue(value);
            }
        },
        readAllProcesses,
        readProcess,
        updateProcess,
        createProcess,
        deleteProcess,
        createKunde : async function ({kunde}) {
            console.log(kunde);
            const { firstName } = kunde;
            const { lastName }  = kunde;
            const { about } = kunde;
            const { id } = kunde;

            console.log(firstName);
            console.log(lastName);
            console.log(about);

            const newProcess = {
                processData: JSON.stringify({
                fistName : firstName,
                lastName: lastName,
                about: about
            }),
        }
        try {
            const doneNewProcess = await business_process.query().patch({ processData : newProcess.processData })
            .where('id', '=', id);
            return true;
        } catch (error) {
            console.log("error");
            console.log(error);
            return false;
        }

        },
        loadKunde : async function () {

        const allBusinessProcesses = await business_process.query();
        console.log("allBusinessProcesses");
        console.log(allBusinessProcesses);
        const kundenArr = [];
        allBusinessProcesses.forEach(item => {
            console.log("item");
            console.log(item.processData);
            kundenArr.push({processData : item.processData});
        });
        console.log("kundenArr");
        console.log(kundenArr);
        return(
            kundenArr
        )

        }
    },
    schema: {
        _types : `type KundenInfo {
            processData: JSON!   
            }
          `,
          _input : `
          input Kunde {
            firstName: String!
            lastName: String!
            about: String!
            id: ID!
          }
        
          
          `,
          _query : `loadKunde: [KundenInfo!]`,
          _mutation : `createKunde(kunde: Kunde!): Boolean!`,
    }
     
     
}
