/* eslint-disable func-names */
exports.up = function(knex) {
  return knex.schema.createTable('project_requirements', table => {
    table.increments();
    table
      .integer('event_id')
      .unsigned()
      .notNullable();
    table
      .foreign('event_id')
      .references('events.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.boolean('video_url');
    table.boolean('git_url');
    table.boolean('project_writeup');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('project_requirements');
};
