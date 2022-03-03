const { v4: uuidv4 } = require('uuid');

const { Model } = require('objection');
const knex = require('knex');
const config = require('../../database/knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

Model.knex(database);

const business_process = require('../../database/models/Prozess');


module.exports = { 
    
    createProcess : async function ({prozess}) {

        /**
         *  code: 'ER_BAD_FIELD_ERROR',
            errno: 1054,
            sqlMessage: "Unknown column 'a' in 'field list'",
            sqlState: '42S22',
            index: 0,
         */

        const _prozess = prozess;
        console.log("create");
        console.log(_prozess.id);
        console.log(_prozess.processData);
        console.log(JSON.parse(JSON.stringify(_prozess.processData)));
        console.log(_prozess.created_at);
        console.log(_prozess.processId);
        console.log(_prozess.processInkrement);
        console.log(JSON.parse(JSON.stringify(_prozess.processInkrement)));


        const newProcess = {
            id: _prozess.id,
            processData: JSON.stringify(_prozess.processData),
            created_at: _prozess.created_at,
            processId: _prozess.processId,
            processInkrement: JSON.stringify(_prozess.processInkrement)
        }
        try {
            const doneNewProcess = await (await business_process.query().insert(newProcess));  
            return doneNewProcess;    
        } catch (error) {
            console.log("error");
            console.log(error);
        }
        

        return newProcess;

    },
    readAllProcesses : async function () {
        const allBusinessProcesses = await business_process.query();
        console.log("allBusinessProcesses");

        return (allBusinessProcesses)

    },
    readProcess : async function ( {id} ) {
        const _id = id;
        const allBusinessProcesses = await business_process.query().findById(_id);
        console.log("allBusinessProcesses");
        console.log(allBusinessProcesses);
        console.log(allBusinessProcesses.created_at);
        console.log(allBusinessProcesses.created_at);
        return ({
            id: allBusinessProcesses.id,
            processData: allBusinessProcesses.processData,
            created_at: allBusinessProcesses.created_at,
            processId: allBusinessProcesses.processId,
            processInk: allBusinessProcesses.processInkrement
        })

    },
    updateProcess : async function ({prozess}) {

        const _prozess = prozess;

        const updatedProcess = {
            id: _prozess.id,
            processData: JSON.stringify(_prozess.processData),
            created_at: _prozess.created_at,
            processId: _prozess.processId,
            processInkrement: JSON.stringify(_prozess.processInkrement)
        }

        // Problem ... 
        /**
         * {
            "data": {
                "readProcess": {
                "id": "5",
                "processData": ----------------------->>>>>>> "{\"data\": \"data\"}",
                "created_at": "2021-07-02 17:59:53"
                }
            }
            }
         */

        const doUpdate = await business_process.query().findById(updatedProcess.id)
        .patch(updatedProcess);

        return (updatedProcess)

    },
    deleteProcess : async function ({id}) {

        const _id = id;
        console.log("delete ID",_id);
        const deleted = await business_process.query().deleteById(_id);

        console.log("deleted");
        console.log(deleted);


        return (
            _id
        )

    }
    
    

    

}