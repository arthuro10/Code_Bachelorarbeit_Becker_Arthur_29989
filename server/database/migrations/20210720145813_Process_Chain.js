exports.up = async function(knex) {
    await knex.schema.createTable("business_process", table => {
        table.uuid('id');
        table.json('pageData').notNullable();
        table.json('processData').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('finished_at').defaultTo(knex.fn.now());
        table.uuid('processId');
        table.uuid('chain_identifier');
        table.json('processInkrement').notNullable();
        table.json('roles');
    } );

    return true;
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("business_process");
    return true;
  };
  