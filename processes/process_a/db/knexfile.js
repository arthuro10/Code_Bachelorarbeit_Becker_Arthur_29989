// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: '192.168.0.90',
      user: 'arthur',
      password: 'kaaT6$bLaa',
      database: 'Processes',
      dateStrings: true
    }
  },
  migrations: {
    directory: "../migrations"
  }

};