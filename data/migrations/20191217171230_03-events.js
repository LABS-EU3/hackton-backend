/* eslint-disable func-names */
exports.up = function(knex) {
  return knex.schema.createTable('events', table => {
    table.increments();
    table.text('event_title').notNullable();
    table.text('event_description').notNullable();
    table
      .integer('creator_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.datetime('start_date').notNullable();
    table.datetime('end_date').notNullable();
    table.text('location').notNullable();
    table.text('guidelines').notNullable();
    table
      .enu('participation_type', ['individual', 'team', 'both'])
      .notNullable();
    table
      .integer('category_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('event_categories')
      .onUpdate('CASCADE')

      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('events');
};
