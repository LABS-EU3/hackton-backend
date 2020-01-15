exports.up = function(knex) {
  return knex.schema.createTable('event_tags', table => {
    table.increments();
    table
      .string('tag_name')
      .notNullable()
      .unique();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('event_tags');
};
