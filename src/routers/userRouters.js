const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const multer = require('multer');


router.post('/users',async(req,res)=>{
    const user = new User(req.body);

    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    }catch(error){
        res.status(400).send(error);
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,token});
    }catch(error){
        res.status(400).send(error);
        console.log(error)
    }
})

router.post('/users/logout', auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save();
        res.send('logged out');
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('Logged out of all sessions');
    }catch(error){
        res.status(500).send(error);
    }
})


router.get('/users/me',auth ,async(req,res)=>{
    res.send(req.user)
})


router.get('/users/:user_id',async(req,res)=>{
    const _id = req.params.user_id;
    try{
        const user = await User.findById(_id);

        if(!user){
            return res.status(404).send();
        }

        res.status(200).send(user);
    }catch(error){
        res.status(404).send(error);
    }
   /*  User.findById(_id).then((found_user)=>{
        res.status(200).send(found_user);
    }).catch((error)=>{
        res.status(404).send(error);
    }) */
})

router.patch('/users/me', auth ,async(req,res)=>{

    const updates_requested = Object.keys(req.body); 
    const allowedUpdates = ['user_name','age','email','password'];
    const isValidOperation = updates_requested.every((update)=>{
        return allowedUpdates.includes(update);
    })

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Updates'});
    }

    try{
        const user = req.user;
        updates_requested.forEach((update)=>{
            user[update] = req.body[update]
        });
        
        //req.body must look like this example.. {"user_name":"constance"} to update original name "conny" to "constance"

        await user.save();

        if(!user){
            res.status(404).send();
        }
        res.status(200).send(user);
    }catch(error){
        res.status(500).send(error);
    }
})



router.delete('/users/me', auth, async(req,res)=>{
    try{
        await User.findOneAndRemove(req.user._id);
        await Task.deleteMany({owner: req.user._id});
        res.send(req.user);

    }catch(error){
        return res.status(500).send(error);
    }
})

const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000,    
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image file'));
        }
        cb(undefined, true)
    }
})

//In upload.single('avatar'), 'avatar' is the name key should have in postman

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send('uploaded');
},(error, req, res, next)=>{
    res.status(400).send({error: error.message});
})

router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    res.send('avatar deleted');
})

router.get('/users/:user_id/avatar', async(req, res)=>{
    try{
        const user = await User.findById(req.params.user_id);
        console.log(user.user_name)

        if(!user || !user.avatar){
            throw new Error() //jumps to catch
        }

        res.set('Content-Type','image/jpg');
        res.send(user.avatar);

    }catch(error){
        console.log(error)
        res.status(400).send();
    }
})




module.exports = router;