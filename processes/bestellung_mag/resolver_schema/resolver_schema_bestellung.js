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
        setbestellData: async ({bestellung,maxPrice,id}) => {
            try {
                
                const setData = await business_process.query()
                .patch({    
                    processData: JSON.stringify({bestellung : bestellung, maxPrice : maxPrice}),
                    })
                .where('id', id);
                return true;
            } catch (error) {
                console.log("error setBestell Data",error);
                return false;
            }
        },
        getBestellData: async () => {
            try {
                
            } catch (error) {
                console.log("error getBestellData",error);
                return false;
            }
        }
        

    },
    schema: {
        _types : `type bestellung {
            name: String!
            amount: Int!
            price: Int!
        }`,
          _input : `input bestellData {
            name: String!
            amount: Int!
            price: Int!
        }`,
          _query : `getBestellData : [bestellung]! `,
          _mutation : `setbestellData(bestellung: [bestellData]!, maxPrice: Int!, id: ID!): Boolean!`,
    }
     
     
}
