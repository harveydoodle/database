
exports.seed = function(knex, Promise) {
  return knex('cars').del()
    .then(function () {
      return Promise.all([
        knex('cars').insert({
          make: 'Hyundai',
          model: 'Elantra',
          year: 2016,
          dealership_id:1
        }),
        knex('cars').insert({
          make: 'Ford',
          model: 'Focus',
          year: 2015,
          dealership_id: 1
        }),
        knex('cars').insert({
          make: 'Honda',
          model: 'Civic',
          year: 2014,
          dealership_id: 2
        })
      ]);
    });
};
