const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const PORT          = 7001;

const knex = require('knex')({
  client: 'postgres',
  connection: {
    host     : '127.0.0.1',
    user     : 'postgres',
    password : 'postgres',
    database : 'car_assignment',
    charset  : 'utf8'
  }
});

const bookshelf = require('bookshelf')(knex);

// top section required for connecting with db

const Dealership = bookshelf.Model.extend({
    tableName: 'dealerships',
    car: function() {
        return this.hasMany(Car, 'dealership_id')
    }
})

const Car = bookshelf.Model.extend({
    tableName: 'cars',
    dealership: function() {
        return this.belongsTo(Dealership,'dealership_id')
    }
})

// QUERIES BEGIN

// makes new car
const newCar = new Car({
    make: 'Toyota',
    model: 'Camry',
    year: 2018,
    dealership_id: 2
})

newCar.save()
    .then(car => {
    console.log(car)
})

// fetch all cars
Car
    .fetchAll()
    .then(cars=>{
        console.log(cars.models.map(car => car.attributes))
    })

// get cars with filter (year 2018)
Car
    .fetchAll()
    .then(cars=>{
        console.log(cars.models
            .filter(car => car.attributes.year === 2018)
            .map(car => car.attributes))
    })

// get single car with its primary id
Car
    .fetchAll()
    .then(cars=>{
        console.log(cars.models
            .filter(car => car.attributes.id === 2)
            .map(car => car.attributes))
    })

// update attributes of single car
const attributesToUpdate = {
    year: '2000'
}
new Car({id: 2})
    .save(attributesToUpdate, {patch: true})
    .then(car => {
        console.log(car.attributes)
    })

//get dealership of a single car
Car.where({dealership_id:1})
    .fetch({withRelated: 'dealership'})
    .then(car=>{
        console.log(car.related('dealership').attributes)
    })

//get all cars of single dealership
Dealership.where({id: 1})
	.fetch({withRelated: 'car'})
	.then(dealership => {
		const cars = dealership.related('car')
		console.log(cars.models.map(car => car.attributes))
	})

// END QUERIES

// API ENDPOINTS BEGIN

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CARS 
// retrieve all car objects
app.get('/cars', (req,res)=>{
    Car
        .fetchAll()
        .then(cars=>{
            res.json(cars.models.map(car => car.attributes))
        })
})

// retrieve single car object
app.get('/singlecar', (req,res)=>{
    Car
        .fetchAll()
        .then(cars=>{
            res.json(cars.models
                .filter(car => car.attributes.id === 2)
                .map(car => car.attributes))
        })
})

// save single car
app.post('/singlecar', (req,res)=>{
    const newCar = new Car(
        {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            dealership_id: req.body.id,
        }
    );

    newCar.save()
        .then(car => {
        res.json(car)
    })

})

// update attributes of single car
app.put('/singlecar', (req,res)=>{
    const attributesToUpdate = {
        year: '2020'
    }
    new Car({id: 2})
        .save(attributesToUpdate, {patch: true})
        .then(car => {
            res.send(car)
        })
})

// delete single car 
app.delete('/singlecar', (req,res)=>{
    new Car({
        id: 20
    })
    .destroy()
	.then(car => {
		res.send("Car deleted.")
	})
})

// DEALERSHIPS

// retrieve all dealership objects
app.get('/dealerships', (req,res)=>{
    Dealership
        .fetchAll()
        .then(dealerships=>{
            res.json(dealerships.models.map(dealership => dealership.attributes))
        })
})

// retrieve single dealership
app.get('/singledealership', (req,res)=>{
    Dealership
        .fetchAll()
        .then(dealerships=>{
            res.json(dealerships.models
                .filter(dealership => dealership.attributes.id === 2)
                .map(dealership => dealership.attributes))
        })
})

// save single dealership
app.post('/singledealership', (req,res)=>{
    const newDealership = new Dealership(
        {
            make: req.body.make,
            city: req.body.city,
            province: req.body.province,
            postal_code: req.body.postal_code,
            street: req.body.street,
        }
    );

    newDealership.save()
        .then(dealership => {
        res.json(dealership)
    })

})

// change attributes of single dealership objet
app.put('/singledealership', (req,res)=>{
    const attributesToUpdate = {
        city: 'Hamilton'
    }
    new Dealership({id: 1})
        .save(attributesToUpdate, {patch: true})
        .then(dealership => {
            res.send(dealership)
        })
})

// delete single dealership
app.delete('/singledealership', (req,res)=>{
    new Dealership({
        id: 3
    })
    .destroy()
	.then(dealership => {
		res.send("Dealership deleted.")
	})
})

app.listen(PORT, ()=>{
    console.log('Server running on localhost 7001')
})

// END API ENDPOINTS