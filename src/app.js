//Copy of index.js without listen for testing

const express = require('express');
const app = express();
require('./db/mongoose');
const user_router = require('./routers/userRouters');
const task_router = require('./routers/taskRouter');
const multer = require('multer');

const upload = multer({
    dest:'images', //folder name where imgs will be stored
    limits:{
        fileSize: 1000000
    }, 
    fileFilter(req, file, cb){ //filter files by their file type
        if(!file.originalname.match(/\.(doc|docx)$/)){ //match uses a regular expression to look for files ending in doc & docx
            return cb(new Error('Please upload a word doc'))
        }

        cb(undefined, true) //cb = call back, undefined = nothing went wrong
    }
})


//In upload.single('upload'), 'upload' is the name key should have in postman
app.post('/upload', upload.single('upload') ,(req,res)=>{
    res.send('ok');
},(error, req, res, next)=>{ 
    //extra function to handle errors, must include all those arguments. Will show error msg thrown in fileFilter
    res.status(400).send({error: error.message})
})

const port = process.env.PORT || 3000;



app.use(express.json());
//For post requests data is sent in json format.
//This middleware parses it automatically so we can use it as an object.S

app.use(user_router);
app.use(task_router);

module.exports = app;