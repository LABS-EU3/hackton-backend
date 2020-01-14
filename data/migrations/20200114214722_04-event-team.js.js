exports.up = function(knex) {
  return knex.schema.createTable('event_team', table => {
    table.increments();
    table
        .foreign('event_id')
        .references('events.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    table 
        .foreign('user_id')
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    table 
        .enu('role_type', ['participant', 'organizer', 'judge'])
        .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('event_team');
};
