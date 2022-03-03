const fs = require('fs');
const processesPath = './processes';
const { uuid } = require('uuidv4');
const crypto = require('crypto');

const { Model } = require('objection');
const knex = require('knex');
const config = require('../database/knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

Model.knex(database);

const processesNameAndID = require('../database/models/ProzessName');

module.exports = function createRecordsForProcesses()  {

    // Create Records for all available Tasks
    const _processes = fs.readdirSync(processesPath);


    _processes.forEach( async (process) =>  {
        if(process === 'react_all_pages') return;
        try{
            const isPageAvailable = await processesNameAndID.query().where('name', process);
            console.log("isPageAvailable")
            console.log(isPageAvailable)
            if(isPageAvailable.length <= 0){
                try{
                    await processesNameAndID.query().insert({
                        tasks: JSON.stringify({}),
                        name: process,
                        id: uuid()
                    }); 

                }catch (error) {
                    console.log("error");
                    console.log(error);
                    return;
                }

            }
        
            
        }catch (error) {
            console.log("error");
            console.log(error);
            return;
        } 
    });


} 

