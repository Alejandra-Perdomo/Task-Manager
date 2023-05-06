//promise-chaining.js
require ('../src/db/mongoose');
const User = require('../src/models/user');
const Task = require('../src/models/task');

/* User.findByIdAndUpdate('6442c1fafab6e34f0c0b46ef',{age:17}).then((user)=>{
    console.log(user);
    return User.countDocuments({age:17});
}).then((users)=>{
    console.log(users)
}).catch((e)=>{
    console.log(e);
}) */

/* Task.findByIdAndDelete('6446dad910f83d244934b3ff').then((task)=>{
    console.log(task);
    return Task.countDocuments({completed:false})
}).then((docs)=>{
    console.log(docs);
}).catch((e)=>{
    console.log(e);
}) */

const updateAndCount = async(id,age) =>{
    const user = await User.findByIdAndUpdate(id,{age}); 
    /* when name of property and name of variable are the same, 
    we can just use name of variable. In this case: age instead of age:age */
    const count = await User.countDocuments({age});
    return count;
}

/* updateAndCount('64469b25d65fedb2ce39d38e',17).then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e);
}) */

const deleteTaskAndCount = async(id) =>{
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed:false});
    return count;
}

deleteTaskAndCount('6442c383f6a4f5e98255fae7').then((incomplete_count)=>{
    console.log(incomplete_count);
}).catch((e)=>{
    console.log(e);
}) 