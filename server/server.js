const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todo', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo
        .save()
        .then((doc) => {
            res
                .status(201)
                .send(doc);
        }, (err) => {
            res
                .status(400)
                .send(err);
        });
});

app.post('/user', (req, res) => {
    var user = new User({
        email: req.body.email
    });

    user
        .save()
        .then((doc) => {
            res
                .status(201)
                .send(doc);
        }, (err) => {
            res
                .status(400)
                .send(err);
        });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});