const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    user_name: 'Mike Test',
    email: 'testingMike002@myemail.com',
    password: 'testmike00*#',
    tokens: [{
        token: jwt.sign({ _id: userOneId}, 'thisismynewcourse'),
    }]
}

const nonexistent = {
    user_name: 'Nobody',
    email: 'toktok002@myemail.com',
    password: 'nopass123$!'
}

/* beforeEach(async()=>{
    await User.deleteOne({email: 'testing002@myemail.com'});
    //await new User(userOne).save();
}) 

test('Should sign up a new user', async()=>{
    await request(app).post('/users').send({
        user_name: 'Test',
        email: 'testing002@myemail.com',
        password: 'teststate00*#',
    }).expect(201)
})

test('Should log in existing user', async()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password,
    }).expect(200)
}) */

test("Should not login nonexistent user", async()=>{
    await request(app).post('/users/login').send({
        email: nonexistent.email,
        password: nonexistent.password,
    }).expect(400)
})




