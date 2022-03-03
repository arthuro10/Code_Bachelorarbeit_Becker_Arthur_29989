exports.up = async function(knex) {
    await knex.schema.createTable("process_a", table => {
        table.uuid('id');
        table.json('pageData').notNullable();
        table.json('processData').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.uuid('processId');
        table.json('processInkrement').notNullable();
    } );

    return true;
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("process_a");
    return true;
  };
  