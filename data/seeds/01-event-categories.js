exports.seed = function(knex) {
  return knex('event_categories').insert([
    { category_name: 'Student Hackaton' },
    { category_name: 'Innovate Hackaton' },
    { category_name: 'Corporate Hackaton' }
  ]);
};
