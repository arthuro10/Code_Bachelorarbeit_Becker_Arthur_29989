const { v4: uuidv4 } = require('uuid');
const { GraphQLJSON, GraphQLJSONObject} = require('graphql-type-json');
const validator = require('validator');
var nodemailer = require('nodemailer');
const fs = require('fs');

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
     validateEmail: async function ({adresses}) {
         console.log(adresses);
         console.log(adresses.sender);
         console.log(adresses.receiver);
         const _sender = adresses.sender;
         let _senderValid = true;
         let _receiverValid = true;
         const _receiver = adresses.receiver;
         if(!validator.isEmail(_sender)){
            _senderValid = false;
         }
         if(!validator.isEmail(_receiver)){
            _receiverValid = false;
         }
         
         fs.appendFile('./test.txt',_sender, (err,data) => {
           if(err){
              console.log("err");
              console.log(err);
              return;
           }
           console.log("Data saved in test.txt");
         });

         return ({
             sender: _sender,
             senderValid: _senderValid,
             receiver: _receiver,
             receiverValid: _receiverValid
         })
        
     },
     sendEmail: async function ({emailSet}) {
         console.log(emailSet.sender);
         console.log(emailSet.receiver);
         console.log(emailSet.text);
         console.log(emailSet.subject);

         let transporter = nodemailer.createTransport({
            host: 'mail.gmx.com',
            port: 587,
            auth: {
              user: emailSet.sender,
              pass: 'ewLaee1$5'
            }
          });
          
          let mailOptions = {
            from: emailSet.sender,
            to: emailSet.receiver,
            subject: emailSet.subject,
            text: emailSet.text
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

         return true;
        
     }
    
},
schema: {
  _types : `
  type validEmails {
    sender: String!
    senderValid: Boolean!
    receiver: String!
    receiverValid: Boolean!
}
`,
  _input : `
  input emailAdresses {
    sender: String!
    receiver: String!
}

input Mailset {
    sender: String!
    receiver: String!
    text: String!
    subject: String!
}`,
  _query : ``,
  _mutation : `validateEmail(adresses: emailAdresses!): validEmails!
  sendEmail(emailSet: Mailset!): Boolean!`,
}
}
