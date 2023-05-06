const mongoose = require('mongoose');
const validator = require('validator');

const taskScheema = mongoose.Schema({
    description:{
        type: String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        required:false,
        default:false,
    }, 
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' //so we can stablish a relationship between the task model and the user model
    }
},
{
    timestamps:true 
});


const Task = mongoose.model('Task', taskScheema)

module.exports = Task;