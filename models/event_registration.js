const mongoose = require('mongoose');

const eventRegSchema = mongoose.Schema({
    name:{
        first_name:{
            type: String,
            required: true
        },
        last_name:{
            type: String,
            required: true
        }
        
    },
    phone:{
        country:{
            type: String,
            required: true
        },
        number:{
            type: String,
            required: true
        }
    },
    email:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    objective:{
        type: String,
        required: true
    }

});

const EventReg = module.exports = mongoose.model('EventReg', eventRegSchema);