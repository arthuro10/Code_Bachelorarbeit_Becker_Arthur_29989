const fs = require('fs');
const processesPath = './processes';
const { uuid } = require('uuidv4');
const crypto = require('crypto');

const { Model } = require('objection');
const knex = require('knex');
const config = require('../database/knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

Model.knex(database);

const tasksTiedToProcess = require('../database/models/Tasks_tied_to_process');
const processName = require('../database/models/ProzessName');
const roles_of_tasks = require('../database/models/Roles_For_Tasks');

module.exports = async function  cleanUpProcesses()   {

    const processes = await processName.query();

    for(const _process of processes){
        const processesInDirectory = fs.readdirSync(processesPath);
        let isInDirectory = false;
        for(const process of processesInDirectory) {
            console.log(process);
            console.log(_process.name);
            if(process === 'react_all_pages'){
                // Nothing
            }else if(_process.name === process){
                console.log("YYY");
                isInDirectory = true;
            }
        }
        if(!isInDirectory){
            console.log("ZZZ");
            await processName.query().delete().where('name',_process.name);
            const data = await tasksTiedToProcess.query().where('process',_process.name);
            await tasksTiedToProcess.query().delete().where('process',_process.name);
            for(const _singleData of data){
                const _taskName = _singleData.task_name;
                await roles_of_tasks.query().delete().where('task_name',_taskName);
            }
        }

    }


} 

