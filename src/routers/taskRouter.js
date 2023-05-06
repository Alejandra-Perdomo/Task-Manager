const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');
const User = require('../models/user')

router.post('/tasks',auth,async(req,res)=>{
    try{
        /* const task = new Task(req.body); */
        const task = new Task({
            ...req.body,
            owner: req.user._id,
        })

        await task.save();
        res.status(201).send(task);
    }catch(error){
        res.status(400).send(error);
    }
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
//limit --> number of results per page
//skip --> page number
//GET  /tasks?sortBy=createdAt:asc or createdAt:desc
router.get('/tasks', auth ,async(req,res)=>{
    const match = {}
    const sort = {}
    
    if(req.query.completed){
        match.completed = req.query.completed;
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':') //removes colon and splits string into array of substrings
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1;
    }

    try{
        const user = await User.findById(req.user._id);
        await user.populate({
            path: 'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        const tasks_found = user.tasks;

        if(!tasks_found){
            return res.status(404).send('No tasks found');
        }
        res.status(200).send(tasks_found);
    }catch(error){
        res.status(500).send(error);
    }
})

router.get('/tasks/:task_id', auth ,async(req,res)=>{
    const _id = req.params.task_id;

    try{
        const task_found = await Task.findOne({_id, owner: req.user._id});

        if(!task_found){
            res.status(404).send('Task not found!');
        }
        res.status(200).send(task_found);
    }catch(error){
        res.status(500).send(error);
    }
})

router.patch('/tasks/:task_id',auth, async(req,res)=>{
    const updates = Object.keys(req.body);
    
    const alloweUpdates = ["description","completed"];

    const isValidOperation = updates.every((update)=>{
        return alloweUpdates.includes(update);
    })

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Updates'});
    }

    try{
        const task = await Task.findOne({_id: req.params.task_id, owner: req.user._id});
        
        if(!task){
            return res.status(404).send('Task not found!');
        }

        updates.forEach((update)=>{
            task[update] = req.body[update];
        })

        await task.save()
        res.status(200).send(task);
    }catch(error){
        res.status(500).send(error);
    }
})



router.delete('/tasks/:task_id', auth ,async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.task_id, owner: req.user._id});
        if(!task){
           return res.status(404).send('Task not found!');
        }
        
        res.status(200).send(task);
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router;