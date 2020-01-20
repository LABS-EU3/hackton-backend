exports.up = function(knex) {
  return knex.schema.createTable('project_grading', table => {
    table.increments();
    table.unique(['project_id', 'judge_id']);
    table
      .integer('event_id')
      .references('id')
      .inTable('events')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('project_id')
      .references('id')
      .inTable('project_entries')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('judge_id')
      .references('user_id')
      .inTable('event_team')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table.integer('product_design').defaultTo(0);
    table.integer('functionality').defaultTo(0);
    table.integer('innovation').defaultTo(0);
    table.integer('product_fit').defaultTo(0);
    table.integer('extensibility').defaultTo(0);
    table.integer('presentation').defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExisits('project_grading');
};
