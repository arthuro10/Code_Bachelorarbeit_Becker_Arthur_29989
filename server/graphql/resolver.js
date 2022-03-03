const fs = require('fs');
const processesPath = './processes';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const { Model } = require('objection');
const knex = require('knex');
const config = require('../database/knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

Model.knex(database);

const business_process = require('../database/models/Prozess');
const archived_process = require('../database/models/Archived_Processes');
const roles_for_tasks = require('../database/models/Roles_For_Tasks');
const user = require('../database/models/User');
const processData = require('../database/models/ProzessName');
const tasksTiedToProcess = require('../database/models/Tasks_tied_to_process');


module.exports = { 

    loadPagesAndProcessesString: () => {

        const _processes = fs.readdirSync(processesPath);
        const processWithPages = [];

        _processes.forEach(process => {
            if(process === 'react_all_pages') return;
            const _pages = [];
            const newPath = processesPath + '/' + process + '/pages';
            console.log("newPath");
            console.log(newPath);
            const pageStrings = fs.readdirSync(newPath);
            _pages.push(...pageStrings);
            processWithPages.push({name: process,pages : _pages});

        });

        console.log("processWithPages");
        console.log(processWithPages);

        return (JSON.stringify(processWithPages))

    },
    getAllProcesses:() => {
        const _processes = fs.readdirSync(processesPath);
        const processesArr = [];

        _processes.forEach(process => {
            if(process === 'react_all_pages') return;
            processesArr.push(process);

        });

        return(processesArr)

    },
    getProcessId: async ({name}) => {
        try {
            const processId = await processData.query().where('name',name);
            return processId[0].id;
        } catch (error) {
            console.log("error: ",error);
            return 0;
        }
    },
    loadModules: () => {

        const _processes = fs.readdirSync(processesPath);
        const processWithPages = [];

        _processes.forEach(process => {
            if(process === 'react_all_pages') return;
            const _pages = [];
            const newPath = processesPath + '/' + process + '/pages';
            console.log("newPath");
            console.log(newPath);
            const pageStrings = fs.readdirSync(newPath);
            _pages.push(...pageStrings);
            processWithPages.push({name: process,pages : _pages});

        });

        console.log("processWithPages");
        console.log(processWithPages);
        const _modules = []
        processWithPages.forEach(item => {
            item.pages.forEach(page => {
                const requirePage = require(`../../processes/${item.name}/pages/${page}`);
                console.log("requirePage")
                console.log(requirePage)
                console.log(requirePage.default);

                const name = page;
                _modules.push(requirePage);
            });

        });

        return (_modules)

    },

    getActiveTask: async () => {

        try {
                
            const allData = await business_process.query()
            .select('id', 'pageData', 'processInkrement')
            console.log("allData");
            console.log(allData);
            return (allData)

        } catch (error) {
            console.log("error");
            console.log(error);
        }

        
        return([

        ])
    },
    getActiveTasks: async ({processId, user, role}) => {
        console.log(processId);
        try {
            const allData = await business_process.query().where('processId',processId)
            if(allData.length <= 0){
                throw new Error("No Tasks available")
            }
            
            const activeData = [];
            allData.forEach(data => {
                console.log("data.processInkrement");
                console.log(data.processInkrement);
                const parsedData = JSON.parse(data.processInkrement);
                if(parsedData.active === true){
                    const _owner = JSON.parse(data.owner);
                    console.log("_owner");
                    console.log(_owner);
                    const _roles = JSON.parse(data.roles);
                    if(_owner.owner.length > 0){
                        _owner.owner.forEach(_own => {
                            console.log(_own);
                            console.log(user);
                            // 
                            if(_own.toLowerCase() === user.toLowerCase() || role.toLowerCase() === 'admin' || role.toLowerCase() === 'chain_admin' || role.toLowerCase() === 'supervisor'){
                                activeData.push(data);
                            }
    
                        });
                    }else{
                        if(_roles.roles.toLowerCase() === role.toLowerCase() || role.toLowerCase() === 'admin' || role.toLowerCase() === 'chain_admin' || role.toLowerCase() === 'supervisor'){
                            activeData.push(data);
                        }
                    }
                    
                    
                    
                }
            });
            return (activeData)

        } catch (error) {
            console.log("error getActiveTasks");
            console.log(error);
            throw new Error(`${error}`)
        }

    },
    createNewProcessChain: async ({processId, ownerWithTasks, type}) => {
        console.log("createNewProcessChain");
        //console.log(ownerWithTasks);
        try {
            // Welcher Prozess
            const processNameArr = await processData.query().where('id',processId);

            // Ist dieser Prozess überhaupt in der Datenbank
            if(processNameArr.length <= 0) return 0;
            //console.log("Nach Return");

            // Den Namen beziehen. Und anhand des Namens die dazugehörigen Tasks holen mit den definierten Vorgängern
            const processName = processNameArr[0];
            const predecessorDataOfProcess = await tasksTiedToProcess.query().where('process',processName.name);
            if(predecessorDataOfProcess.length <= 0) return 0;

            // Die Pagedaten damit durch diese iterieren kann...
            const _pagesAndOrder = [];
            predecessorDataOfProcess.forEach(item => {
                _pagesAndOrder.push({
                    task: item.task_name,
                    order: item.order,
                    taskFileName: item.taskFileName
                });

            });
            
            // Definiere Nachfolger und Vorgänger
            const _tasksWithPredecessorAndSuccesor = []
            _pagesAndOrder.forEach( firstObj => {
                const successor = []
                let predecessor = {};
                predecessorDataOfProcess.forEach(secondObj => {
                    if(firstObj.task === secondObj.task_name || secondObj.predecessor === '{}' || firstObj.order > secondObj.order){
                        return;
                    }
                    const parsedPredecessor = JSON.parse(secondObj.predecessor);
                    predecessor = parsedPredecessor.predecessor
                    let bool = false;

                    parsedPredecessor.predecessor.forEach(thirdObj => {
                        if(bool){
                            // Nothing ... break
                        }else{
                            thirdObj.predecessor.forEach(fourthObj => {
                                // Nur nötig wenn Dub Bedingungen enthalten sind. Sind diese nicht enthalten, springt das Programm 
                                // Immer auf die else if. [1234,4321] So 
                                if(fourthObj.includes(',')){
                                    const stringsArr = fourthObj.split(',');
                                    stringsArr.forEach(string => {
                                        if(string === firstObj.task_name){
                                            successor.push(secondObj.task_name);
                                            bool = true;
                                        }
                                    });
                                }
                                else if(fourthObj === firstObj.task){
                                    successor.push(secondObj.task_name);
                                    bool = true;
                                    return;
                                }
                        });

                        }
                        
                    });
                });
                _tasksWithPredecessorAndSuccesor.push({
                    task: firstObj.task,
                    successor: successor,
                    successorIds : [],
                    predecessorIds : [],
                    predecessor : {},
                    id: 1,
                    order: firstObj.order,
                    taskFileName: firstObj.taskFileName
                });
            });

            // insert Predecessor
            _tasksWithPredecessorAndSuccesor.forEach(item => {
                predecessorDataOfProcess.forEach(obj => {
                    if(item.task === obj.task_name){
                        item.id = crypto.randomBytes(4).toString('hex');
                        if(obj.order === 1){
                            item.predecessor = [];
                        }else{
                            const parsedPredecessor = JSON.parse(obj.predecessor);
                            item.predecessor = parsedPredecessor.predecessor;
                        }
                        
                    }
                });
            })

            // Successor und predecessor nun als ID bestimmen und speichern
            _tasksWithPredecessorAndSuccesor.forEach(taskObj => {
                taskObj.successor.forEach(successor => {
                    _tasksWithPredecessorAndSuccesor.forEach(taskObj2 => {
                        if(successor === taskObj2.task){
                            taskObj.successorIds.push(taskObj2.id);
                        }
                    });
                });
                taskObj.predecessor.forEach(predecessor => {
                    const _predecessorIds = [];
                    predecessor.predecessor.forEach(preTasks => {
                        console.log("preTasks");
                        console.log(preTasks);
                        // Auch hier ist die IF nur wegen Sub Bedingungen drin. 
                        // Da in der BA keine Sub Bedingungen enthalten sind ... nicht beachten. 
                        if(preTasks.includes(',')){
                            const stringArray = preTasks.split(',');
                            const stringId = [];
                            stringArray.forEach(stringTask => {
                                _tasksWithPredecessorAndSuccesor.forEach(taskObj2 => {
                                    if(stringTask === taskObj2.task){
                                        stringId.push(taskObj2.id);
                                    }
                                });
                            });
                            _predecessorIds.push(stringId);
                            
                        }else{
                            _tasksWithPredecessorAndSuccesor.forEach(taskObj2 => {
                                if(preTasks === taskObj2.task){
                                    _predecessorIds.push(taskObj2.id);
                                }
                            });
                        }
                       
                    });
                    taskObj.predecessorIds.push({branchState : predecessor.branchState,
                        predecessor : _predecessorIds});
                });
            });
            

            // Um Ausgabe zu sehen
            _tasksWithPredecessorAndSuccesor.forEach(item => {
                console.log("_tasksWithPredecessorAndSuccesor");
                console.log(item);
            });
            

            const chainIdentifier = uuidv4();

            for(const page of _tasksWithPredecessorAndSuccesor) {
                console.log("page")
                console.log(page)
                const pageName = page.taskFileName.toLowerCase().split('.').slice(0,-1).join('.')
                try {
                    const _data = await roles_for_tasks.query().where('task_name',pageName);
        
                    const _role = JSON.parse(_data[0].roles).role;
                    let _owner = [];
                    if(type === 'user'){
                        console.log("ownerWithTasks[0]");
                        console.log(ownerWithTasks[0]);
                        _owner = ownerWithTasks[0].owner;
                    }else{
                        ownerWithTasks.forEach(oWT => {
                            if(page.taskFileName.toLowerCase().split('.').slice(0,-1).join('.') === oWT.task){
                                console.log("oWT");
                                console.log(oWT);
                                _owner = oWT.owner;
                            }
                        });
                    }
                    
                    const _date = new Date().toJSON().slice(0,19).replace('T', ' ');
                    const pathName = "/" +  page.taskFileName.toLowerCase().split('.').slice(0,-1).join('.')
                    let newProcess = {};
                    let isActive = false;
                    let successor = [];
                    let predecessor = [];

                    if(page.order === 1){
                        isActive = true;
                    }


                       
                        // New Record ... 
                        newProcess = {
                            id: page.id,
                            pageData: JSON.stringify({
                                process: processName.name,
                                taskPage : page.taskFileName,
                                path: pathName
                            }),
                            processData : JSON.stringify({}),
                            created_at: _date,
                            processId: processId,
                            chain_identifier: chainIdentifier,
                            owner: JSON.stringify({owner : _owner}),
                            roles: JSON.stringify({roles : _role}),
                            processInkrement: JSON.stringify({
                                active: isActive,
                                predecessor: page.predecessorIds,
                                successor: page.successorIds
                            })
                        }


                    try {
                        const doneNewProcess = await business_process.query().insert(newProcess); 
                        //console.log(doneNewProcess);
                    } catch (error) {
                        console.log("error");
                        console.log(error);
                        return;
                    }
                } catch (error) {
                    console.log("error get _data",error);
                }
        

            }
            return chainIdentifier;

        } catch (error) {
            console.log("error",error);
            return 0;
        }
    },
    updateActiveTask: async ({idLastActive}) => {


        const lastId = idLastActive;
        try {
                
            const jsonDataLast = await business_process.query().findById(lastId);
            const updatedProcessInkrementLast = JSON.parse(jsonDataLast.processInkrement);

            // Successor ist ein Array. Dort sind die Nachfolger enthalten.
            const successorArray = updatedProcessInkrementLast.successor
            updatedProcessInkrementLast.active = false;
            // Deaktivere den Task.
            await business_process.query().findById(lastId)
            .patch({
              processInkrement: JSON.stringify(updatedProcessInkrementLast)
            });

            if(successorArray.length <= 0){
                // Prozesschritt hat keinen Nachfolger. Es handelt sich um den letzten Prozessschritt. Der Prozess endet hier. 
                const chain_identifier = jsonDataLast.chain_identifier;
                const _processChain = await business_process.query().where('chain_identifier',chain_identifier)
                for(const task of _processChain){
                    const finished_at = new Date().toJSON().slice(0,19).replace('T', ' ');
                    const insertInArchived = await archived_process.query().insert({
                            id: task.id,
                            pageData: task.pageData,
                            processData : task.processData,
                            created_at: task.created_at,
                            finished_at: finished_at,
                            processId: task.processId,
                            chain_identifier: chain_identifier,
                            owner: task.owner,
                            roles: task.roles,
                            processInkrement: task.processInkrement
                    })
                }
                const deleteChain = await business_process.query().delete().where('chain_identifier',chain_identifier)
                return true
            }

            // Durch die Nachfolger iterieren
            for(const id of successorArray){

                const jsonDataNew = await business_process.query().findById(id);
                const updatedProcessInkrementNew = JSON.parse(jsonDataNew.processInkrement);


                for(const predecessorObj of updatedProcessInkrementNew.predecessor){

                    const branchState = predecessorObj.branchState;
                    if(branchState === 'direct'){
                        const _predecessorData = await business_process.query().findById(id);
                        const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                        _predecessorProcessInkrementParsed.active = true;
                        await business_process.query().findById(id).patch({
                            processInkrement: JSON.stringify(_predecessorProcessInkrementParsed)
                        });
                        break;
                    // Bei AND und OR müssen die Vorgänger geholt und überprüft werden.
                    }else if(branchState === 'and'){
                        let isAndTrue = true;
                        for(const predecessor of predecessorObj.predecessor){
                            const _predecessorData = await business_process.query().findById(predecessor);
                            const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                            // Um den Nachfolger auf True zu setzen, müssen alle Vorgänger auf False gesetzt sein. 
                            if(_predecessorProcessInkrementParsed.active){
                                isAndTrue = false;
                            }
                        }
                        if(isAndTrue){
                            const _predecessorData = await business_process.query().findById(id);
                            const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                            _predecessorProcessInkrementParsed.active = true;
                            await business_process.query().findById(id).patch({
                                processInkrement: JSON.stringify(_predecessorProcessInkrementParsed)
                            });
                            break;
                        }
                    }else if(branchState === 'or'){
                        let isOrTrue = false;
                        for(const predecessor of predecessorObj.predecessor){
                            const _predecessorData = await business_process.query().findById(predecessor);
                            const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                            // Um den Nachfolger auf True zu setzen, muss nur einer auf False gesetzt sein. 
                            if(_predecessorProcessInkrementParsed.active){
                                isOrTrue = true;
                            }
                        }
                        if(isOrTrue){
                            const _predecessorData = await business_process.query().findById(id);
                            const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                            _predecessorProcessInkrementParsed.active = true;
                            await business_process.query().findById(id).patch({
                                processInkrement: JSON.stringify(_predecessorProcessInkrementParsed)
                            });
                            break;
                        }

                    }

                    
                }


            }
            
            return true


        } catch (error) {
            console.log("error");
            console.log(error);
            return false;
        }


    },
    // Die Version mit Sub Bedingungen ... 
    /*updateActiveTask: async ({idLastActive}) => {


        const lastId = idLastActive;
        try {
                
            const jsonDataLast = await business_process.query().findById(lastId);
            const updatedProcessInkrementLast = JSON.parse(jsonDataLast.processInkrement);

            // Successor ist ein Array. Dort sind die Nachfolger enthalten.
            const successorArray = updatedProcessInkrementLast.successor
            updatedProcessInkrementLast.active = false;
            // Deaktivere den Task.
            await business_process.query().findById(lastId)
            .patch({
              processInkrement: JSON.stringify(updatedProcessInkrementLast)
            });

            if(successorArray.length <= 0){
                // Prozesschritt hat keinen Nachfolger. Der Prozess endet hier. 
                const chain_identifier = jsonDataLast.chain_identifier;
                const _processChain = await business_process.query().where('chain_identifier',chain_identifier)
                for(const task of _processChain){
                    const finished_at = new Date().toJSON().slice(0,19).replace('T', ' ');
                    const insertInArchived = await archived_process.query().insert({
                            id: task.id,
                            pageData: task.pageData,
                            processData : task.processData,
                            created_at: task.created_at,
                            finished_at: finished_at,
                            processId: task.processId,
                            chain_identifier: chain_identifier,
                            owner: task.owner,
                            roles: task.roles,
                            processInkrement: task.processInkrement
                    })
                }
                const deleteChain = await business_process.query().delete().where('chain_identifier',chain_identifier)
                return true
            }

            // Durch die Nachfolger iterieren
            for(const id of successorArray){

                const jsonDataNew = await business_process.query().findById(id);
                const updatedProcessInkrementNew = JSON.parse(jsonDataNew.processInkrement);

                const arrayAND = [];
                const arrayOR = [];
                const idAndActiveState = [];
                const ergebnisMenge = [];
                for(const predecessorObj of updatedProcessInkrementNew.predecessor){

                    const branchState = predecessorObj.branchState;
                    if(branchState === 'direct'){
                        ergebnisMenge.push(true);
                        const _predecessorData = await business_process.query().findById(id);
                        const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                        _predecessorProcessInkrementParsed.active = true;
                        await business_process.query().findById(id).patch({
                            processInkrement: JSON.stringify(_predecessorProcessInkrementParsed)
                        });
                        continue;
                    }else if(branchState === 'and'){
                        arrayAND.push(predecessorObj.predecessor);
                    }else if(branchState === 'or'){
                        arrayOR.push(predecessorObj.predecessor);
                    }
            
                    for(const predecessor of predecessorObj.predecessor){
                        console.log("predecessor");
                        console.log(predecessor);
                        if(Array.isArray(predecessor)){
                            for(const predecessorId of predecessor){
                                const _predecessorData = await business_process.query().findById(predecessorId);
                                const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                                idAndActiveState.push({id : _predecessorData.id, active: _predecessorProcessInkrementParsed.active});
                            }
                        }else{
                            const _predecessorData = await business_process.query().findById(predecessor);
                            const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                            idAndActiveState.push({id : _predecessorData.id, active: _predecessorProcessInkrementParsed.active});

                        }
                        
                    }
                    
                }
                const uniqueIdAndActiveState = idAndActiveState.filter( (item,index) => {
                    const _item = JSON.stringify(item);
                    return index === idAndActiveState.findIndex(obj => {
                        return JSON.stringify(obj) === _item;
                    });
                });

                console.log("uniqueIdAndActiveState");
                console.log(uniqueIdAndActiveState);
                console.log("arrayAND");
                console.log(arrayAND);
                console.log("arrayOR");
                console.log(arrayOR);

                // Auswertung der Bedingungen
                // ---
                // Auswertung AND
                arrayAND.forEach(and => {
                    // and ist ein Array
                    let isAndTrue = true;
                    and.forEach(taskId => {
                        if(!isAndTrue) return
                        // Falls eine Sub Bedingung, dann muss durch das Array iteriert werden
                        if(Array.isArray(taskId)){
                            // Falls eine Sub Bedingung muss erst identifiziert werden ob es sich um eine OR oder AND Bedingung handelt ... 
                            arrayAND.forEach(andArr => {
                                const andArrString = JSON.stringify(andArr);
                                const taskIdString = JSON.stringify(taskId);
                                if(andArrString === taskIdString ){
                                    // Sub Bedingung ist eine AND das heißt wenn einer true ist, ist das Ergebnis false
                                    taskId.forEach(taskIdSingle => {
                                        uniqueIdAndActiveState.forEach(idAndActive => {
                                            if(idAndActive.id === taskIdSingle){
                                                if(idAndActive.active) isAndTrue = false;
                                            }
                                        });
                                    });
                                }
                            }); 
                            arrayOR.forEach(orArr => {
                                const orArrString = JSON.stringify(orArr);
                                const taskIdString = JSON.stringify(taskId);
                                if(orArrString === taskIdString ){
                                    // Sub Bedingung ist eine OR das heißt wenn nur einer false ist, reicht das für das Ergebnis true
                                    isAndTrue = false;
                                    taskId.forEach(taskIdSingle => {
                                        uniqueIdAndActiveState.forEach(idAndActive => {
                                            if(idAndActive.id === taskIdSingle){
                                                if(!idAndActive.active) isAndTrue = true;
                                            }
                                        });
                                    });
                                }
                            });
                        }else{
                            uniqueIdAndActiveState.forEach(idAndActive => {
                                if(idAndActive.id === taskId){
                                    // is idAndActive.active true?
                                    if(idAndActive.active) isAndTrue = false;
                                }
                            });
                        }
                        
                    });
                    // Möglich dass Subcondition ...
                    let isSubCondtion = false;
                    arrayAND.forEach(andObj => {
                        andObj.forEach(singleItem => {
                            if(Array.isArray(singleItem)){
                                const singleItemString = JSON.stringify(singleItem);
                                const AndString = JSON.stringify(and);
                                if(singleItemString === AndString){
                                    isSubCondtion = true;
                                }
                            }
                        });
                    });
                    arrayOR.forEach(orObj => {
                        orObj.forEach(singleItem => {
                            if(Array.isArray(singleItem)){
                                const singleItemString = JSON.stringify(singleItem);
                                const AndString = JSON.stringify(and);
                                if(singleItemString === AndString){
                                    isSubCondtion = true;
                                }
                            }
                        });
                    });
                    if(isSubCondtion) isAndTrue = true;
                    isAndTrue === true ? ergebnisMenge.push(true) : ergebnisMenge.push(false)
                });
                // ---
                // Auswertung OR  // Weitere Überprüfungen umsetzen. 
                arrayOR.forEach(or => {
                    let isOrTrue = [];
                    or.forEach(taskId => {
                        if(Array.isArray(taskId)){
                            console.log("The Sub Condition");
                            // Quasi hier schauen, ist Condition von OR oder AND. Entsprechend des States auswerten
                            arrayAND.forEach(andArr => {
                                const andArrString = JSON.stringify(andArr);
                                const taskIdString = JSON.stringify(taskId);
                                if(andArrString === taskIdString ){
                                    // Sub Bedingung ist eine AND das heißt wenn einer true ist, ist das Ergebnis false
                                    let isAndTrue = true;
                                    taskId.forEach(taskIdSingle => {
                                        uniqueIdAndActiveState.forEach(idAndActive => {
                                            if(idAndActive.id === taskIdSingle){
                                                if(idAndActive.active) isAndTrue = false;
                                            }
                                        });
                                    });
                                    isAndTrue === true ? isOrTrue.push(true) : isOrTrue.push(false)
                                }
                            }); 
                            arrayOR.forEach(orArr => {
                                const orArrString = JSON.stringify(orArr);
                                const taskIdString = JSON.stringify(taskId);
                                if(orArrString === taskIdString ){
                                    // Sub Bedingung ist eine OR das heißt wenn nur einer false ist, reicht das für das Ergebnis true
                                    let OrTrue = false;
                                    taskId.forEach(taskIdSingle => {
                                        uniqueIdAndActiveState.forEach(idAndActive => {
                                            if(idAndActive.id === taskIdSingle){
                                                if(!idAndActive.active) OrTrue = true;
                                            }
                                        });
                                    });
                                    OrTrue === true ? isOrTrue.push(true) : isOrTrue.push(false)
                                }
                            });
                            
                        }else{
                            console.log("The single Condition");
                            uniqueIdAndActiveState.forEach(idAndActive => {
                                if(idAndActive.id === taskId){
                                    idAndActive.active === false ? isOrTrue.push(true) : isOrTrue.push(false)
                                }
                            });
                        }
                    });
                    let isSubCondtion = false;
                    arrayOR.forEach(orObj => {
                        orObj.forEach(singleItem => {
                            if(Array.isArray(singleItem)){
                                const singleItemString = JSON.stringify(singleItem);
                                const OrString = JSON.stringify(or);
                                if(singleItemString === OrString){
                                    isSubCondtion = true;
                                }
                            }
                        });
                    });
                    if(isSubCondtion) isOrTrue.push(true);
                    isOrTrue.includes(true) ? ergebnisMenge.push(true) : ergebnisMenge.push(false)
                });
                // ---
                // Ergebnismenge zeigt ob man nun auf true stellen kann oder nicht. 
                console.log("ergebnisMenge");
                console.log(ergebnisMenge);
                let isOneFalse = ergebnisMenge.includes(false);

                console.log("isOneFalse");
                console.log(isOneFalse);

                if(!isOneFalse){
                    console.log("Everything is True. Change the Active State!!!");
                    updatedProcessInkrementNew.active = true;
            
                    await business_process.query().findById(id).patch({
                        processInkrement: JSON.stringify(updatedProcessInkrementNew)
                    });
    
                }


            }
            
            return true


        } catch (error) {
            console.log("error");
            console.log(error);
            return false;
        }


    },*/
    login: async({ name, password}) => {

        const _user = await user.query()
        .where('name', name)

        let isTrue = true;

        if(!_user.length > 0){
        isTrue = false;
        const error = new Error('User does not exists');
        error.code = 401;
        throw error;
        } 

        const isEqual = await bcrypt.compare(password, _user[0].password);
        console.log(isEqual);
        if (!isEqual) {
        isTrue = false;
        const error = new Error('Password is incorrect.');
        error.code = 401;
        throw error;
        }
        const token = jwt.sign(
        {
            userId: _user[0].id,
            email: _user[0].name
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
        );

        console.log(_user[0]);

        return({
            token: token,
            name: _user[0].name,
            userId: _user[0].id,
            role: _user[0].role,
            tasks: _user[0].tasks
        })
    },
    createUser: async ({ name, password }) => {
        const errors = [];
        if (
        validator.isEmpty(password) ||
        !validator.isLength(password, { min: 5 })
        ) {
        errors.push({ message: 'Password too short!' });
        }
        if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.data = errors;
        error.code = 422;
        throw error;
        }
        const existingUser = await user.query().where('name', name);
        console.log(existingUser);
        if (existingUser.length > 0) {
        const error = new Error('User exists already!');
        throw error;
        }

        const hashedPw = await bcrypt.hash(password, 12);

        const createdUser = await user.query().insert({
            id: uuidv4(),
            role: JSON.stringify({}),
            tasks: JSON.stringify({}),
            name: name,
            password: hashedPw
            
        });

        let created = false

        if(createdUser){
            console.log("createdUser")
            console.log(createdUser)
            created = true;
        }

        return created;

    },
    getAllUser: async () => {

        try{

        }catch(err){
            console.log("err",err);
        }
        const allUser = await user.query();
        console.log(allUser);
        const allUserToFrontend = [];
        allUser.forEach(user => {
            allUserToFrontend.push({
                name: user.name,
                role: user.role,
                tasks: user.tasks,
                id: user.id
            });
        })
        return(allUserToFrontend)
    },
    getAllTasks: async () => {
        try{
            const allTasks = await roles_for_tasks.query().where('has_role',true);
            console.log(allTasks);
            const allTasksToFrontend = [];
            allTasks.forEach(task => {
                allTasksToFrontend.push({
                    name: task.task_name,
                    role: task.roles,
                });
            });
            return(allTasksToFrontend)

        }catch(err){
            console.log("err",err);
        }
        

    },
    updateUsersRole: async ({_user}) => {
        _user.role = JSON.stringify(_user.role)
        _user.tasks = JSON.stringify(_user.tasks)
        try{
            const doUpdate = await user.query().findById(_user.id)
        .patch(_user);
        return true;

        }catch (err){
            console.log("err",err);
            return false;
        }
        
    },
    setRolesToNewTasks: ({taskNames}) => {

        try {
            taskNames.forEach(async (taskName) => {
            const task = await roles_for_tasks.query().where('task_name',taskName);
            if(task.length > 0){
                // Is already in DB
            }else{
                const newTask = await roles_for_tasks.query().insert({
                    id: uuidv4(),
                    task_name: taskName,
                    roles: JSON.stringify({}),
                    has_role: false
                  });


            }
            
        });
        return true;
            
        } catch (error) {
            console.log("error",error);
            return false;
        }

    },
    getTasksWithNoRoles: async () => {
        try {
            const getTasks = await roles_for_tasks.query().where('has_role',false);
            const taskNames = [];
            getTasks.forEach(task => {
                taskNames.push(task.task_name);
            });
            return taskNames;
        } catch (error) {
            console.log("error in getRolesToNewTasks",error);
            return ['Failed']
        }
    },
    NewRoleForTask : async ({taskName, role}) => {
        const roleObj = JSON.stringify({role : role});
        try {
            const updateTask = await roles_for_tasks.query().patch({ has_role: true, roles: roleObj })
                                .where('task_name', taskName);
            return true;
            
        } catch (error) {
            console.log("error NewRoleForTask",error);
            return false;
        }
        

    },
    getProcessName: async ({task}) => {
        try {
            const getProcess = await tasksTiedToProcess.query().where('task_name',task);
            if(getProcess.length > 0){
                return getProcess[0].process;
            }else{
                return 'failed'
            }
        } catch (error) {
            console.log("error getProcessName",error);
        }
    },
    getAllTaskProcessConnections: async () => {
        try {
            const array = []
            const allData = await tasksTiedToProcess.query();
            console.log(allData);
            allData.forEach(data => {
                array.push({
                    task: data.task_name,
                    process: data.process
                });
            });
            return(
                array
            )
        } catch (error) {
            console.log("error getAllTaskProcessConnections",error);
            return ([
                {task: "failed",
                process: "failed"}
            ])
        }
    },
    isFirstTask: async ({task}) => {
        try {
            const isFirstData = await tasksTiedToProcess.query().where('task_name',task);
            if(isFirstData.length > 0){
                console.log();
                return isFirstData[0].firstTask
            }
            return false;
        } catch (error) {
            console.log("error isFirstTask",error);
            return false;
        }
    },
    NewInitiateStateForTask: async ({initiateState, taskName}) => {
        try {
            let _boolean = false;
            console.log("initiateState");
            console.log(initiateState);
            switch (initiateState) {
                case 'supervisor+':
                    _boolean = true;
                    break;
                case 'user':
                    _boolean = false;
                    break;
            
                default:
                    _boolean = null;
                    break;
            }
            const isTaskAvailable = await tasksTiedToProcess.query().where('task_name',taskName);
            if(isTaskAvailable.length <= 0){
                return false;
            }
            const dataArr = await tasksTiedToProcess.query().where('task_name',taskName).patch({
                initiated: _boolean
            });
            if(dataArr.length > 0){
                console.log();
                return true
            }
            return false;
            
        } catch (error) {
            console.log("error NewInitiateStateForTask",error);
            return false;
        }

    },
    getInitiateState: async ({processName}) => {
        try {
            const data = await tasksTiedToProcess.query().where('process',processName).where('firstTask',true);
            if(data.length > 0){
                let _string = ""
                switch (data[0].initiated) {
                    case 1:
                        _string = "supervisor+"
                        break;
                    case 0:
                        _string = "user"
                        break;
                
                    default:
                        _string = "null"
                        break;
                }
                return _string;
            }
            return false;
            
        } catch (error) {
            console.log("error NewInitiateStateForTask",error);
            throw new Error("Failed")
            
        }
    },
    getAllActiveTasks: async () => {
        try {
            const getAllActiveTasksArr = await business_process.query();
            if(getAllActiveTasksArr.length <= 0){
                throw new Error("No Tasks available")
            }
            const activeData = [];
            getAllActiveTasksArr.forEach(data => {
                const parsedData = JSON.parse(data.processInkrement);
                    if(parsedData.active === true){
                        activeData.push(data);
                    }
            });
            return activeData;
                
        } catch (error) {
            console.log("error NewInitiateStateForTask",error);
            throw new Error("Failed")
            
        }
        
    },
    getAllProcessTasks: async ({process}) => {
        try {
            const _data = await tasksTiedToProcess.query().where('process',process);
            if(_data.length > 0){
                const _tasks = [];
                _data.forEach(obj => {
                    _tasks.push({task: obj.task_name,order: obj.order});
                });
                return _tasks
            }else{
                return {task:'NoTasks',order:0}
            }

        } catch (error) {
            console.log("Error getAllProcessTasks",error);
            
        }
    },setPredecessors: async ({predecessorData}) => {
        console.log("predecessorData");
        console.log(predecessorData);
        for(const data of predecessorData){
            console.log("data");
            console.log(data);
            try {
                const insertData = await tasksTiedToProcess.query()
                .patch({    
                    branch_type: 'direct',
                    predecessor: JSON.stringify({predecessor : data.predecessor}),
                    branchSet: true
                    })
                .where('task_name', data.parent);
                
            } catch (error) {
                console.log("setPredecessors ERROR",error);
                return false;
            }
           
        }
        return true;
    },
    getAllActiveTasksOfUser: async ({_userName}) => {
        const getUserInformation = await user.query().where('name', _userName);
        if(getUserInformation.length <= 0){
            throw new Error('User is Invalid');
        }
        const _userInfo = getUserInformation[0];

        try {
            const getAllActiveTask = await  business_process.query();
            if(getAllActiveTask.length <= 0){
                throw new Error("No Tasks available")
            }
            const activeData = [];
            getAllActiveTask.forEach(data => {
                const parsedData = JSON.parse(data.processInkrement);
                    if(parsedData.active === true){
                        activeData.push(data);
                    }
            });
        
            const onlyUserRoleTasks = activeData.map( _task => {
                //console.log("_task");
                //console.log(_task);
                //console.log("_userInfo");
                //console.log(_userInfo);

                if(_userInfo.name.toLowerCase() === 'admin') return _task

                const parsedUserRole = JSON.parse(_userInfo.role);
                const parsedTaskRole = JSON.parse(_task.roles);
                const parsedTaskOwner = JSON.parse(_task.owner);
                //console.log("parsedUserRole");
                //console.log(parsedUserRole);
                //console.log("parsedTaskRole");
                //console.log(parsedTaskRole);
                //console.log(parsedUserRole.roles);
                let isOwnerTrue = false;
                parsedTaskOwner.owner.forEach(owner => {
                    if(owner.toLowerCase() === _userInfo.name.toLowerCase()) isOwnerTrue = true;
                });
                if(_task.owner === '{"owner": []}') isOwnerTrue = true;


                if(parsedUserRole.roles[0] === parsedTaskRole.roles && isOwnerTrue){
                    console.log('has Role');
                    return _task
                }
            });
            //console.log("onlyUserRoleTasks");
            //console.log(onlyUserRoleTasks);

            const filtered = onlyUserRoleTasks.filter(ele => {
                return ele != undefined
            })

            return filtered;
                
        } catch (error) {
            console.log("error getAllActiveTasksOfUser",error);
            throw new Error(`${error}`)
            
        }

    },
    getProcessDataFromPreviousTask: async ({id}) => {
        try {
            const getData = await  business_process.query().where('id',id);
            if(getData.length <= 0) throw new Error("Id is not available")

            console.log(getData[0]);

            const parsedProcessInkrement = JSON.parse(getData[0].processInkrement);

            const returnProcessData = []
            for(const prevArr of parsedProcessInkrement.predecessor){
                for(const prev of prevArr.predecessor){
                    const getPrev = await  business_process.query().where('id',prev);
                    returnProcessData.push(getPrev[0].processData);
                }
            }
            

            return returnProcessData;
        } catch (error) {
            console.log("error getProcessData",error);
            throw new Error("Failed")
            
        }

    },
    setProcessData: async ({id,data}) => {
        try {
            const setData = await business_process.query().where('id',id).patch({
                processData: JSON.stringify(data)
            })
            return true
        } catch (error) {
            console.log("error setProcessData",error);
            return false;
        }
    },
    getBranchSetState: async ({processName}) => {
        try {
            const getState = await tasksTiedToProcess.query().where('process',processName);
            if(getState.length <= 0) throw new Error("This process is not available");

            if(getState[getState.length-1].branchSet === null) return false;
            return getState[getState.length-1].branchSet;
        } catch (error) {
            console.log("error getBranchSetState",error);
            throw new Error("Error: ",error);
            
        }
    }
    
     
     
}


/**
 * createNewProcessChain: async ({processId, ownerWithTasks, type}) => {
        console.log("createNewProcessChain");
        //console.log(ownerWithTasks);
        try {
            const processNameArr = await processData.query().where('id',processId);
            //console.log("Vor Return");
            //console.log(processNameArr);
            //console.log(processId);
            if(processNameArr.length <= 0) return 0;
            //console.log("Nach Return");

            const processName = processNameArr[0];
            const _pages = [];
            const newPath = './processes/' + processName.name + '/pages';
            //console.log("newPath");
            //console.log(newPath);
            const pageStrings = fs.readdirSync(newPath);
            _pages.push(...pageStrings);
            

            const chainIdentifier = uuidv4();
            let count = 0;
            let predecessor = "";
            let successor = "";

            _pages.forEach(async (page) => {
                console.log("page")
                console.log(page)
                const pageName = page.toLowerCase().split('.').slice(0,-1).join('.')
                try {
                    const _data = await roles_for_tasks.query().where('task_name',pageName);
        
                    const _role = JSON.parse(_data[0].roles).role;
                    let _owner = [];
                    if(type === 'normal'){
                        console.log("ownerWithTasks[0]");
                        console.log(ownerWithTasks[0]);
                        _owner = ownerWithTasks[0].owner;
                    }else{
                        ownerWithTasks.forEach(oWT => {
                            if(page.toLowerCase().split('.').slice(0,-1).join('.') === oWT.task){
                                console.log("oWT");
                                console.log(oWT);
                                _owner = oWT.owner;
                            }
                        });
                    }
                    
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
                                process: processName.name,
                                taskPage : page,
                                path: pathName
                            }),
                            processData : JSON.stringify({}),
                            created_at: _date,
                            processId: processId,
                            chain_identifier: chainIdentifier,
                            owner: JSON.stringify({owner : _owner}),
                            roles: JSON.stringify({roles : _role}),
                            processInkrement: JSON.stringify({
                                active: true,
                                predecessor: "",
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
                                process: processName.name,
                                taskPage : page,
                                path: pathName
                            }),
                            processData : JSON.stringify({}),
                            created_at: _date,
                            processId: processId,
                            chain_identifier: chainIdentifier,
                            owner: JSON.stringify({owner : _owner}),
                            roles: JSON.stringify({roles : _role}),
                            processInkrement: JSON.stringify({
                                active: false,
                                predecessor: predecessor,
                                successor: successor
                            })
                        }
                        predecessor = id;
                        
                    }

                    try {
                        const doneNewProcess = await business_process.query().insert(newProcess); 
                        //console.log(doneNewProcess);
                    } catch (error) {
                        console.log("error");
                        console.log(error);
                        return;
                    }
                } catch (error) {
                    console.log("error get _data",error);
                }
        

            })
            count = 0;
            return chainIdentifier;

        } catch (error) {
            console.log("error",error);
            return 0;
        }
    }
 */

    /**
     * updateActiveTask: async ({idLastActive}) => {


        const lastId = idLastActive;
        try {
                
            const jsonDataLast = await business_process.query().findById(lastId);
            const updatedProcessInkrementLast = JSON.parse(jsonDataLast.processInkrement);

            // Successor ist ein Array. Dort sind die Nachfolger enthalten.
            const successorArray = updatedProcessInkrementLast.successor
            updatedProcessInkrementLast.active = false;
            // Deaktivere den Task.
            await business_process.query().findById(lastId)
            .patch({
              processInkrement: JSON.stringify(updatedProcessInkrementLast)
            });

            // Durch die Nachfolger iterieren
            for(const id of successorArray){

                const jsonDataNew = await business_process.query().findById(id);
                const updatedProcessInkrementNew = JSON.parse(jsonDataNew.processInkrement);

                const arrayAND = [];
                const arrayOR = [];
                const idAndActiveState = [];
                const ergebnisMenge = [];
                for(const predecessorObj of updatedProcessInkrementNew.predecessor){

                    const branchState = predecessorObj.branchState;
                    if(branchState === 'direct'){
                        ergebnisMenge.push(true);
                        const _predecessorData = await business_process.query().findById(id);
                        const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                        _predecessorProcessInkrementParsed.active = true;
                        await business_process.query().findById(id).patch({
                            processInkrement: JSON.stringify(_predecessorProcessInkrementParsed)
                        });
                        continue;
                    }else if(branchState === 'and'){
                        arrayAND.push(predecessorObj.predecessor);
                    }else if(branchState === 'or'){
                        arrayOR.push(predecessorObj.predecessor);
                    }
            
                    for(const predecessor of predecessorObj.predecessor){
                        console.log("predecessor");
                        console.log(predecessor);
                        if(Array.isArray(predecessor)){
                            for(const predecessorId of predecessor){
                                const _predecessorData = await business_process.query().findById(predecessorId);
                                const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                                idAndActiveState.push({id : _predecessorData.id, active: _predecessorProcessInkrementParsed.active});
                            }
                        }else{
                            const _predecessorData = await business_process.query().findById(predecessor);
                            const _predecessorProcessInkrementParsed = JSON.parse(_predecessorData.processInkrement);
                            idAndActiveState.push({id : _predecessorData.id, active: _predecessorProcessInkrementParsed.active});

                        }
                        
                    }
                    
                }
                const uniqueIdAndActiveState = idAndActiveState.filter( (item,index) => {
                    const _item = JSON.stringify(item);
                    return index === idAndActiveState.findIndex(obj => {
                        return JSON.stringify(obj) === _item;
                    });
                });

                console.log("uniqueIdAndActiveState");
                console.log(uniqueIdAndActiveState);
                console.log("arrayAND");
                console.log(arrayAND);
                console.log("arrayOR");
                console.log(arrayOR);

                // Auswertung der Bedingungen
                // ---
                // Auswertung AND
                arrayAND.forEach(and => {
                    // and ist ein Array
                    let isAndTrue = true;
                    and.forEach(taskId => {
                        // Falls eine Sub Bedingung, dann muss durch das Array iteriert werden
                        if(Array.isArray(taskId)){
                            taskId.forEach(taskIdSingle => {
                                uniqueIdAndActiveState.forEach(idAndActive => {
                                    if(idAndActive.id === taskIdSingle){
                                        if(idAndActive.active) isAndTrue = false;
                                    }
                                });
                            });
                        }else{
                            uniqueIdAndActiveState.forEach(idAndActive => {
                                if(idAndActive.id === taskId){
                                    if(idAndActive.active) isAndTrue = false;
                                }
                            });
                        }
                        
                    });
                    if(!isAndTrue){
                        // AND ist false kann aber noch in einer OR enthalten sein als Sub Bedingung
                        let isASubCondition = false;
                        arrayOR.forEach(or => {
                            or.forEach(subCondition => {
                                // Wenn subCondtion ein Array ist, ist es eine Sub Bedingung
                                if(Array.isArray(subCondition)){
                                    const stringifiedSubCondition = JSON.stringify(subCondition);
                                    const stringifiedNormalCondtionAnd = JSON.stringify(and);
                                    console.log("stringifiedNormalCondtionAnd");
                                    console.log(stringifiedNormalCondtionAnd);
                                    console.log("stringifiedSubCondition");
                                    console.log(stringifiedSubCondition);
                                    if(stringifiedNormalCondtionAnd === stringifiedSubCondition){
                                        isASubCondition = true;
                                    }
                                }
                            });
                        });
                        isASubCondition === true ? ergebnisMenge.push(true) : ergebnisMenge.push(false)
                    }else{
                        ergebnisMenge.push(true);
                    }
                });
                // ---
                // Auswertung OR  // Weitere Überprüfungen umsetzen. 
                arrayOR.forEach(or => {
                    let isOrTrue = [true];
                    or.forEach(taskId => {
                        if(Array.isArray(taskId)){
                            console.log("The Sub Condition");
                            // Quasi hier schauen, ist Condition von OR oder AND. Entsprechend des States auswerten
                            let isOr = false;
                            let isAnd = false;
                            arrayAND.forEach(and => {
                                const stringAnd = JSON.stringify(and);
                                const stringTaskIds = JSON.stringify(taskId);
                                if(stringAnd === stringTaskIds){
                                    console.log("is a AND Sub Condition");
                                    isAnd = true;
                                }
                            });
                            if(!isAnd){
                                arrayOR.forEach(or => {
                                    const stringOr = JSON.stringify(or);
                                    const stringTaskIds = JSON.stringify(taskId);
                                    if(stringOr === stringTaskIds){
                                        console.log("is a OR Sub Condition");
                                        isOr = true;
                                    }
                                });
                            }
                            taskId.forEach(taskIdSingle => {
                                uniqueIdAndActiveState.forEach(idAndActive => {
                                    if(idAndActive.id === taskIdSingle){
                                        if(idAndActive.active){
                                            if(isAnd){
                                                isOrTrue[0] = false;
                                            }else if(isOr){
                                                isOrTrue.push(false);
                                            }
                                        }else if(!idAndActive.active){
                                            if(isOr){
                                                isOrTrue.push(true);
                                            } 
                                        }
                                    }
                                });
                            });
                        }else{
                            console.log("The single Condition");
                            uniqueIdAndActiveState.forEach(idAndActive => {
                                if(idAndActive.id === taskId){
                                    if(!idAndActive.active){
                                        isOrTrue.push(true);
                                    }
                                }
                            });
                        }
                    });
                    isOrTrue.includes(true) ? ergebnisMenge.push(true) : ergebnisMenge.push(false)
                });
                // ---
                // Ergebnismenge zeigt ob man nun auf true stellen kann oder nicht. 
                console.log(ergebnisMenge);
                let isOneFalse = ergebnisMenge.includes(false);

                console.log("isOneFalse");
                console.log(isOneFalse);

                if(!isOneFalse){
                    console.log("Everything is True. Change the Active State!!!");
                    updatedProcessInkrementNew.active = true;
            
                    await business_process.query().findById(id).patch({
                        processInkrement: JSON.stringify(updatedProcessInkrementNew)
                    });
    
                }


            }
            
            return true


        } catch (error) {
            console.log("error");
            console.log(error);
            return false;
        }


    }
     */