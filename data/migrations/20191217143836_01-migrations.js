exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments();
      table
        .string('username')
        .notNullable()
        .unique();
      table.string('password').notNullable();
      table.text('bio');
      table.string('email').unique();
      table.string('fullname');
    })
    .createTable('event_categories', table => {
      table.increments();
      table
        .string('category_name')
        .notNullable()
        .unique();
    })
    .createTable('events', table => {
      table.increments();
      table.text('event_title').notNullable();
      table.text('event_description').notNullable();
      table
        .integer('creator_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users');
      table.datetime('start_date').notNullable();
      table.datetime('end_date').notNullable();
      table.text('location').notNullable();
      table.text('guidelines').notNullable();
      table.enum('participation_type').notNullable();
      table
        .integer('category_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('event_categories');
    })
    .createTable('event_organizers', table => {
      table
        .integer('events_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('events');
      table
        .integer('organizer_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users');
    })
    .createTable('event_judges', table => {
      table
        .integer('events_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('events');
      table
        .integer('judges_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users');
    })
    .createTable('event_participants', table => {
      table
        .integer('events_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('events');
      table
        .integer('participants_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users');
    })
    .createTable('projects', table => {
      table.increments();
      table
        .integer('events_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('events');
      table
        .text('project_title')
        .notNullable()
        .unique();
      table.text('project_description').notNullable();
      table
        .integer('submitted_by')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users');
    });
};
/**
 *
 *
 * @param {*} knex
 * @returns
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('projects')
    .dropTableIfExists('event_participants')
    .dropTableIfExists('event_judges')
    .dropTableIfExists('event_organizers')
    .dropTableIfExists('events')
    .dropTableIfExists('event_categories')
    .dropTableIfExists('users');
};
