const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// delete multiple records - Todo.remove({})
// Todo
//     .remove({})
//     .then((result) => {
//         console.log(result);
//     });

// delete one record - Todo.FindOneAndRemove
// Todo
//     .findOneAndRemove({
//         _id: '59ca082c2bb71a696cb762ad'
//     })
//     .then();

// delete one record by ID - Todo.findByIdAndRemove
Todo
    .findByIdAndRemove('59ca0a5e6b1aac7034d6c819')
    .then((todo) => {
        console.log(todo);
    });