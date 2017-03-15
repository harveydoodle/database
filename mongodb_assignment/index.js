const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Car = require('./models/cars.js');
const Dealership = require('./models/dealerships');
const ObjectId = require('mongodb').ObjectID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/data/db/');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected to db at /data/db/")
});

// CARS BEGIN
// retrieve all cars

app.get('/cars', (req,res)=>{
    Car.find({})
        .then(cars => {
                res.json(cars);
            })
            .catch(err => {
                console.log(err);
        })
})

// retrieve single car object

app.get('/cars/:objectId', (req,res)=>{
    Car.findById(req.params.objectId)
    .then(cars => {
        res.json(cars);
    })
    .catch(err => {
        console.log(err);
    })
})

// add single car object 
app.post('/car', (req,res)=>{
	let __object = req.body;
	let newCar = Car(__object);

    // let newCar = Car(
    //     {
    //         make: 'BMW',
    //         model: 'X5',
    //         year: 2222,
    //         dealership_id: 1
    //     }
    // );

    newCar.save()
    .then(car => {
        res.send(car);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({err});
    })
});

// change attributes of single car 
app.put('/cars/:objectId', (req,res)=>{
    let __car = req.body;
    let update = {
        model: "X6"
    }

    let query = {"_id": req.params.objectId};
    
    let options = {
        new: true,
        runValidators: true
    }

    Car.findOneAndUpdate(query, update, options)
        .then(updatedCar => {
            // res.json(updatedCar);
            res.json(updatedCar);
        })
        .catch(err => {
            console.log(err)
        })
})

app.delete('/cars/:objectId', (req,res)=>{
    Car.findOneAndRemove({"_id": req.params.objectId})
        .then(removedCar => {
            res.json({deleted:true});
            console.log(removedCar);
        })
        .catch(err => {
            console.log(err)
			res.status(400)
				.json({err});
        })
})

// CARS END

//DEALERSHIPS BEGIN

// retrieve all dealerships

app.get('/dealerships', (req,res)=>{
    Dealership.find({})
        .then(dealerships => {
                res.json(dealerships);
            })
            .catch(err => {
                console.log(err);
        })
})

// retrieve single dealership object

app.get('/dealerships/:objectId', (req,res)=>{
    Dealership.findById(req.params.objectId)
    .then(dealerships => {
        res.json(dealerships);
    })
    .catch(err => {
        console.log(err);
    })
})

// add single dealership object 
app.post('/dealerships', (req,res)=>{
	let __object = req.body;
	let newDealership = Dealership(__object);

    newDealership.save()
    .then(dealership => {
        res.send(dealership);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({err});
    })
});

// change attributes of single dealership
app.put('/dealerships/:objectId', (req,res)=>{
    let __dealership = req.body;
    let update = {
        city: __dealership.city
    }

    let query = {"_id": req.params.objectId};
    
    let options = {
        new: true,
        runValidators: true
    }

    Dealership.findOneAndUpdate(query, update, options)
        .then(updatedDealership => {
            res.json(updatedDealership);
        })
        .catch(err => {
            console.log(err)
        })
})

app.delete('/dealerships/:objectId', (req,res)=>{
    Dealership.findOneAndRemove({"_id": req.params.objectId})
        .then(removedDealership => {
            res.json({deleted:true});
            console.log(removedDealership);
        })
        .catch(err => {
            console.log(err)
			res.status(400)
				.json({err});
        })
})

// DEALERSHIPS END

// const seedDealerships = require('./seeds/dealerships');
// const seedCars = require('./seeds/cars');
// seedDealerships();
// seedCars();


app.listen(8080, () => {
    console.log('SERVER RUNNING ON 8080');
})
