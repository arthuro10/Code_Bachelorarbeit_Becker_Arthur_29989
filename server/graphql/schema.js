const { buildSchema } = require('graphql');

const fs = require('fs');
const processesPath = './processes';

const _allSchemas = [];
const _processes = fs.readdirSync(processesPath);
_processes.forEach(process => {
    if(process === 'react_all_pages') return;
   const newPath = processesPath + "/" + process + '/resolver_schema';
   const resolvers = fs.readdirSync(newPath);
   const resolver = resolvers[0];
   const requireSchemaType = require(`../../processes/${process}/resolver_schema/${resolver}`).schema._types;
   const requireSchemaInput = require(`../../processes/${process}/resolver_schema/${resolver}`).schema._input;
   const requireSchemaQuery = require(`../../processes/${process}/resolver_schema/${resolver}`).schema._query;
   const requireSchemaMutation = require(`../../processes/${process}/resolver_schema/${resolver}`).schema._mutation;
   _allSchemas.push({
       name: process,
       type: requireSchemaType,
       input: requireSchemaInput,
       query: requireSchemaQuery,
       mutation: requireSchemaMutation
   });
});


// Merge them
let allTypes = ``;
let allInputs = ``;
let allQuery = ``;
let allMutation = ``;
_allSchemas.forEach(obj => {
    allTypes +=  '\n' + obj.type;
    allInputs +=  '\n' + obj.input;
    allQuery +=  '\n' + obj.query;
    allMutation +=  '\n' + obj.mutation;
});





const _schema = `
scalar JSON

type prozesse {
    id: ID!
    pageData: JSON!
    processData: JSON!
    created_at: String!
    chain_identifier: ID
    roles: JSON
    finished_at: String
    processId: ID!
    processInkrement: JSON!
    owner: JSON!
}

type AuthData {
    token: String!
    userId: String!
    name: String!
    role: JSON!
    tasks: JSON!
}
type Userdata {
    name: String!
    role: JSON!
    tasks: JSON!
    id: ID!
}
type Taskdata {
    name: String!
    process: String
    role: JSON!
}
type TaskProcess {
    task: String!
    process: String
}

type TaskAndOrder {
    task: String!
    order: Int!
}


${allTypes}


input process {
    id: ID
    processData: JSON!
    created_at: String!
    processId: ID!
    processInkrement: JSON!
}



input UserInputRoleData {
    name: String!
    tasks: JSON!
    role: JSON!
    id: ID!
}
input predData {
    branchState: String!
    parent: String!
    predeccesor: [String]!
}

${allInputs}    

type RootQuery {
    getActiveTask: [prozesse!]
    getActiveTasks(processId: ID!, user: String!, role: String!): [prozesse!]
    readProcess(id: ID!): prozesse!
    readAllProcesses: [prozesse!]
    loadPagesAndProcessesString: JSON!
    getAllProcesses: [String!]
    getProcessId(name: String!): ID!
    loadModules: JSON!
    login(name: String!, password: String!): AuthData!
    getAllUser: [Userdata!]
    getAllTasks: [Taskdata!]
    getTasksWithNoRoles: [String!]
    getProcessName(task: String!): String!
    getAllTaskProcessConnections: [TaskProcess]!
    isFirstTask(task: String!): Boolean!
    getInitiateState(processName: String!): String!
    getAllActiveTasks: [prozesse!]
    getAllProcessTasks(process : String!): [TaskAndOrder]!
    getAllActiveTasksOfUser(_userName : String!): [prozesse!]
    getProcessDataFromPreviousTask(id: ID!): [JSON!]
    getBranchSetState(processName: String!): Boolean!
    ${allQuery}

}

type RootMutation {
    updateActiveTask(idLastActive: ID!): Boolean!
    updateProcess(prozess: process!): prozesse!
    createProcess(prozess: process!): prozesse!
    deleteProcess(id: ID!): ID!
    createUser(name: String!,password: String!): Boolean!
    updateUsersRole(_user: UserInputRoleData!):Boolean!
    createNewProcessChain(processId: ID!, ownerWithTasks : [JSON!], type: String!): ID!
    setRolesToNewTasks(taskNames: [String]!): Boolean!
    NewRoleForTask(taskName : String!, role : String!): Boolean!
    NewInitiateStateForTask(taskName : String!, initiateState: String!): Boolean!
    setPredecessors(predecessorData: [JSON    ]!): Boolean!
    setProcessData(id: ID!, data:JSON!): Boolean!
    ${allMutation}

}



schema {
query: RootQuery 
mutation: RootMutation
}
`
//console.log("_schema");
//console.log(_schema);


module.exports = buildSchema(_schema);

let _ProzesseTabelle = `
    type prozesse {
        id: ID
        processData: JSON!
        time: String!
        processId: ID!
        processInk: [String!]
    }
`

/**
 * module.exports = buildSchema(`
    scalar JSON

    type prozesse {
        id: ID!
        processData: JSON!
        time: String!
        processId: ID!
        processInk: [String!]
    }


    type RootQuery {
        getProcess: prozesse!
    }

    
    type RootMutation {

    }


    schema {
    query: RootQuery 
    mutation: RootMutation
    }
`);
 */

