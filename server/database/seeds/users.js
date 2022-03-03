const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
   await knex('user').del()

  const hashedPw_1 = await bcrypt.hash("User123", 12);
  const role_1 = {roles : ["user"]}
  const process_id_1 = await knex('user').insert({
    id: uuidv4(),
    role: JSON.stringify(role_1),
    tasks: JSON.stringify({}),
    name: "User",
    password: hashedPw_1
  });

  const hashedPw_2 = await bcrypt.hash("Admin123", 12);
  const role_2 = {roles : ["admin"]}
  const process_id_2 = await knex('user').insert({
    id: uuidv4(),
    role: JSON.stringify(role_2),
    tasks: JSON.stringify({}),
    name: "Admin",
    password: hashedPw_2
  });
  const hashedPw_3 = await bcrypt.hash("Chain_Admin123", 12);
  const role_3 = {roles : ["chain_admin"]}
  const process_id_3 = await knex('user').insert({
    id: uuidv4(),
    role: JSON.stringify(role_3),
    tasks: JSON.stringify({}),
    name: "Chain_Admin",
    password: hashedPw_3
  });
  const hashedPw_4 = await bcrypt.hash("Supervisor123", 12);
  const role_4 = {roles : ["supervisor"]}
  const process_id_4 = await knex('user').insert({
    id: uuidv4(),
    role: JSON.stringify(role_4),
    tasks: JSON.stringify({}),
    name: "Supervisor",
    password: hashedPw_4
  });
  
    return true;
};