exports.up = async function(knex) {

    await knex.schema.createTable("user", table => {
        table.uuid('id').notNullable();
        table.json('role');
        table.json('tasks');
        table.string('name').notNullable();
        table.string('password').notNullable();
    } );
  
    return true;
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("user");
    return true;
  };
  