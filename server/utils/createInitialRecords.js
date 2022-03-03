const fs = require('fs');
const processesPath = './processes';
const { uuid } = require('uuidv4');
const crypto = require('crypto');

const { Model } = require('objection');
const knex = require('knex');
const config = require('../database/knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

Model.knex(database);

const business_process = require('../database/models/Prozess');

module.exports = function createRecords()  {

    // Create Records for all available Tasks
    const _processes = fs.readdirSync(processesPath);
    const _processesAndPages = [];

    _processes.forEach( (process) =>  {
        if(process === 'react_all_pages') return;
        const _pages = [];
        const newPath = processesPath + '/' + process + '/pages';
        console.log("newPath");
        console.log(newPath);
        const pageStrings = fs.readdirSync(newPath);
        _pages.push(...pageStrings);

        _processesAndPages.push({
            name: process,
            pages : _pages,
            uuid: uuid()
        });
    });

    
    _processesAndPages.forEach((item) => {
        let count = 0;
        let predecessor = "";
        let successor = "";
        item.pages.forEach(async (page) => {
            
            const _date = new Date().toJSON().slice(0,19).replace('T', ' ');
            const pathName = "/" +  page.toLowerCase().split('.').slice(0,-1).join('.')
            let newProcess = {};
            console.log(count);
            // First Task
            if(count === 0){
                // Generiere die ID für den Nachfolgenden
                successor = crypto.randomBytes(4).toString('hex');
                // Die eigene Task ID
                let id = crypto.randomBytes(4).toString('hex');
                // Da diese ID auch die Vorgänger ID des nächsten sein wird ... speichern
                predecessor = id;
                count++; 
                // New Record ... 
                newProcess = {
                    id: id,
                    pageData: JSON.stringify({
                        process: item.name,
                        taskPage : page,
                        path: pathName
                    }),
                    processData : JSON.stringify({}),
                    created_at: _date,
                    processId: item.uuid,
                    processInkrement: JSON.stringify({
                        active: true,
                        predeccesor: "",
                        successor: successor
                    })
                }

            }else{
                let id = successor;
                successor = crypto.randomBytes(4).toString('hex');
                // New Record ... 
                newProcess = {
                    id: id,
                    pageData: JSON.stringify({
                        process: item.name,
                        taskPage : page,
                        path: pathName
                    }),
                    processData : JSON.stringify({}),
                    created_at: _date,
                    processId: item.uuid,
                    processInkrement: JSON.stringify({
                        active: false,
                        predeccesor: predecessor,
                        successor: successor
                    })
                }
                predecessor = id;
                
            }

            try {
                
                const doneNewProcess = await business_process.query().insert(newProcess); 
                
                return;
            } catch (error) {
                console.log("error");
                console.log(error);
                return;
            }

            

        })
        count = 0;
        

    });

    


} 

