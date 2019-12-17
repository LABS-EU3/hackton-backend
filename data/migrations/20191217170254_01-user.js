exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table
      .string('username')
      .notNullable()
      .unique();
    table.string('password').notNullable();
    table.text('bio');
    table.string('email').unique();
    table.string('fullname');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
