const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59c0f77275067a83379d2489';
//
// if (!ObjectID.isValid()){
//     console.log('ID not valid');
// }
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos:', todos);
// });
//
// Todo
//     .findOne({
//         _id: id
//     })
//     .then((todo) => {
//         console.log('Todo:', todo);
//     });

// Todo
//     .findById(id)
//     .then((todo) => {
//         if (!todo) {
//             return console.log('Id not found');
//         }
//         console.log('Todo by id:', todo);
//     })
//     .catch((err) => console.log(err));

var id = '59c0cfce40f9c9211b5e55ce';

User
    .findById(id)
    .then((user) => {
        if (!user) {
            return console.log('User not found');
        }
        console.log(JSON.stringify(user, undefined, 2));
    })
    .catch((err) => console.log(err));