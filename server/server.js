const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const createRecords = require('./utils/createInitialRecords');
const createRecordsForProcessTable = require('./utils/createRecordsForProcessTable');
const createTaskProcessConnection = require('./utils/createTaskProcessConnection');

const cleanUp = require('./utils/cleanUpOldProcesses');
const cors = require('cors');
//const port = process.env.PORT || 3000;
const { graphqlHTTP } = require('express-graphql');
const processesPath = './processes';
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('../server/graphql/resolver');

// Clean Up
cleanUp();

// Create Records  // Deprecated
   //createRecords();

// Iteration Resolver
const _allResolver = [];
const _processes = fs.readdirSync(processesPath);
_processes.forEach(process => {
   if(process === 'react_all_pages') return;
   const newPath = processesPath + "/" + process + '/resolver_schema';
   const resolvers = fs.readdirSync(newPath);
   const resolver = resolvers[0];
   const requireResolver = require(`../processes/${process}/resolver_schema/${resolver}`).resolver;
   _allResolver.push(requireResolver);
});

// Hinzufügen der Prozesse in die DB --> Damit die ID immer die gleichen sind und wenn neue hinzukommen diese automatisch hinzugefügt werden

createRecordsForProcessTable();

// Hinzufügen von "Tasks haben eine Relation zu dem übergeordneten 'Prozess'"
createTaskProcessConnection();


const superGraphQLResolver = Object.assign(graphqlResolver,..._allResolver);

app.use(bodyParser.json());
app.use(cors());

app.use('/graphql', graphqlHTTP({
   schema : graphqlSchema,
   rootValue : superGraphQLResolver,
   graphiql : true,
   customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }

 }));

/*app.listen(port, function() {
   console.log('Server started on port: ' + port);
});*/

module.exports = app;