const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({ // ID automatically generated by mongoose
    created_at: Date,
    updated_at: Date,
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    dealership_id: {
        type: Number,
        required: true
    }
});

// allows every Car to have created and updated car automatically
carSchema.pre('save', function(next){ 
    const currentDate = new Date ();

    this.updated_at = currentDate;

    if(!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;