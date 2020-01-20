/* eslint-disable func-names */
exports.up = function(knex) {
  return knex.schema.createTable('grading_rubrics', table => {
    table
      .foreign('event_id')
      .references('events.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.boolean('design').defaultTo(false);
    table.boolean('functionality').defaultTo(false);
    table.boolean('innovation').defaultTo(false);
    table.boolean('product_fit').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('grading_rubrics');
};
