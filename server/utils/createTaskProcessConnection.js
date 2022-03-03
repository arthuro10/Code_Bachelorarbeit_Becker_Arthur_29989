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

module.exports = async function  createTaskProcessConnection()   {


    const _processes = fs.readdirSync(processesPath);

    
    for(const process of _processes) {
        if(process === 'react_all_pages') return;
        
        const newPath = processesPath + '/' + process + '/pages/'

        const _tasks = fs.readdirSync(newPath);

        let count = 0;
        for(const task of _tasks) {
            try {
                const taskNameChanged = task.toLowerCase().split('.').slice(0,-1).join('.')
                let isFirst = true;
                console.log(count);
                console.log(count > 0);
                if(count > 0) isFirst = false;
                count++;
                const alreadyInDB = await tasksTiedToProcess.query().where('task_name',taskNameChanged);
                if(alreadyInDB.length <= 0){
                    const addNewTask = await tasksTiedToProcess.query().insert({
                        id: uuid(),
                        task_name: taskNameChanged,
                        taskFileName: task,
                        process: process,
                        firstTask: isFirst,
                        branch_type: 'none',
                        predecessor: JSON.stringify({}),
                        order: count
                    });
                }
                
                
            } catch (error) {
                console.log("error in createTaskProcessConnection",error);
            }
            
        }
    }


} 

