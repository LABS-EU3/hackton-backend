/* eslint-disable func-names */
exports.up = function(knex) {
  return knex.schema.createTable('grading_rubrics', table => {
    table
      .integer('event_id')
      .unsigned()
      .notNullable();
    table
      .foreign('event_id')
      .references('events.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.boolean('product_design').defaultTo(false);
    table.boolean('functionality').defaultTo(false);
    table.boolean('innovation').defaultTo(false);
    table.boolean('product_fit').defaultTo(false);
    table.boolean('extensibility').defaultTo(false);
    table.boolean('presentation').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('grading_rubrics');
};
