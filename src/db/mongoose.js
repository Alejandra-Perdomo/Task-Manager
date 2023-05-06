
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/task-manager');


/* const Task = mongoose.model('Task',{
    description:{
        type: String,
        required: true,
        trim:true,
    },
    completed:{
        type: Boolean,
        required:false,
        default: false
    }
})

const new_task = new Task({
    description:'  Meet babe at coffee shop',
}) 

new_task.save().then(()=>{
    console.log(new_task)
}).catch((error)=>{
    console.log(error);
})
 */


