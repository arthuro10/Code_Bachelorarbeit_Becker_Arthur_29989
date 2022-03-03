// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3305,
      user: 'root',
      password: 'root',
      database: 'process_chain',
      dateStrings: true
    }
  },

};


// dateStrings um das Datum als String zu bekommen. In GraphQL kann als Type dann String verwendet werden. 
