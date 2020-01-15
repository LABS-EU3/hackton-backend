exports.seed = function(knex) {
  return knex('event_tags').insert([
    { tag_name: 'AI' },
    { tag_name: 'IOT' },
    { tag_name: 'Automotive' },
    { tag_name: 'Healthcare' }
  ]);
};
