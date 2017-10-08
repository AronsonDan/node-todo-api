const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: "dan.a@example.com",
        password: "userOnePass",
        tokens:[{
            access: "auth",
            token: jwt
                .sign(
                    {
                        _id:userOneId,
                        access:'auth'
                    }, 'abc123')
                .toString()
        }]
    },
    {
        _id: userTwoId,
        email: "idan.k@example.com",
        password: "userTwoPass"
    }
];

const populateUsers = (done) => {
    User
        .remove({})
        .then(() => {
            var user1 = new User(users[0])
                .save();
            var user2 = new User(users[1])
                .save();

            return Promise.all([user1,user2])
        })
        .then(() => done());
};

const todos = [
    {
        _id: new ObjectID(),
        text: 'first test todo',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'second test todo',
        completed: true,
        completedAt: 10987,
        _creator: userTwoId
    },
];

const populateTodos = (done) => {
    Todo
        .remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());
};
module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};