exports.up = function(knex) {
  return knex.schema.table('events', table => {
    table
      .integer('tags_id')
      .unsigned()
      .notNullable();
    table
      .foreign('tags_id')
      .references('event_tags.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.table('events', table => {
    table.dropColumn('tags_id');
  });
};
