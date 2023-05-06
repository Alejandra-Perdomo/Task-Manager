

const mongoose = require('mongoose');
const validator =   require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    user_name:{
        type: String,
        required:true,
        trim: true, //Gets rid of spaces before and after the String.
        lowercase:true,
    },
    age:{
        type: Number ,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    email:{
        type: String,
        unique:true, //email can be registered just once.
        required:true,
        trim: true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.includes('password')){
                throw new Error('Password must not contain the word "password"');
            }
        }
    },
    pass:{
        type:String
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps:true  //adds createdAt.. and updatedAt.. to doc
});

//Not actual data stored in db
//It's a virtual array of tasks 
//It can be named anything, in this case 'tasks'
//It'll be a relationship between users and tasks
//

userSchema.virtual('tasks',{
    ref: 'Task', //reference to Task model
    localField: '_id', //field in model that's making the reference
    foreignField: 'owner' //Name field on Task
})

/* Mongoose supports two Schema options to transform Objects after querying MongoDb: toObject and toJSON. */
/* toJSON allows method to run without being explicitly called every time res.send(user) is sent*/
/* toJSON calls JSON.stringify behind the scenes to convert data to a json string but also allows us to control
what data will be exposed through its function */

userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject();
    /* Document.prototype.toObject() is a mongoose function that converts 
    this document into a plain-old JavaScript object, removing mongoose functionalities
    attached to doc*/
    //Now we can manipulate object to change what we expose.
    delete userObject.password
    //The delete operator belongs javascript and removes a property from an object.
    delete userObject.tokens
    delete userObject.pass
    delete userObject.avatar //this data is too big and makes things slower

    return userObject
}

userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({_id:user._id.toString()},'thisismynewcourse');
    user.tokens = user.tokens.concat({token}) //OR {token:token}
    await user.save();
    return token;
}


//This creates a function we can later call using User model
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to log in');
    }
  
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.pre('save',async function(next){ 
    //must be a standar function bc arrow functions don't bind 'this'
    //'this' is equal to the doc that is being saved
    const user = this;

    if(user.isModified('password')){
       //True when psswrd is first created and also true when passwrd was modified
        user.password = await bcrypt.hash(user.password, 8)
    }

    next(); 
}) 

//Delete user tasks when user is removed
//Doesn't work, doesn't get fired

userSchema.pre('findOneAndDelete',{document:false,query:true}, async function(next){
    console.log('Inside remove middleware');
    const user = this;
    await Task.deleteMany({owner: user._id})

    next()
})

/* userSchema.pre('save', async function(next){
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(8, function(err,salt){
        if(err) return next(err);

        //hash password along with our new salt
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err) return next(err);
            user.password = hash;
            next();
        })
    })
}) */

const User = mongoose.model('User', userSchema)


module.exports = User;