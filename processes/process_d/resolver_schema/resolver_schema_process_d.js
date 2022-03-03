const { v4: uuidv4 } = require('uuid');
const { GraphQLJSON, GraphQLJSONObject} = require('graphql-type-json');
const validator = require('validator');


const { Model } = require('objection');
const knex = require('knex');
const config = require('../../../server/database/knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

Model.knex(database);

const business_process = require('../../../server/database/models/Prozess');




module.exports = { 
    resolver: {
        JSON: { 
            __serialize(value) {
            return GraphQLJSONObject.parseValue(value);
            }
        },
        

    },
    schema: {
        _types : ``,
          _input : ``,
          _query : ``,
          _mutation : ``,
    }
     
     
}
