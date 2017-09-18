// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');

    // delete many
    // db.collection('Todos')
    //     .deleteMany({
    //         text: 'eat launch'
    //     })
    //     .then((result) => {
    //         console.log(result);
    //     }, (err) => {
    //         console.log(err);
    //     })
    // delete one
    // db.collection('Todos')
    //     .deleteOne({
    //         text: 'eat launch'
    //     })
    //     .then((result) => {
    //         console.log(result);
    //     }, (err) => {
    //         console.log(err);
    //     })
    // find one and delete
    // db.collection('Todos')
    //     .findOneAndDelete({
    //         completed: false
    //     })
    //     .then((result) => {
    //         console.log(result);
    //     }, (err) => {
    //         console.log(err);
    //     })
    db.collection('Users')
        .deleteMany({
            name: "Dan"
        })
        .then((result) => {
            console.log(result);
        }, (err) => {
            console.log(err);
        });

    db.collection('Users')
        .deleteOne({
            _id: new ObjectID('59bfe42ea28dd813e6e82002')
        })
        .then((results) => {
            console.log(results);
        }, (err) => {
            console.log(err);
        })

    db.collection('Users')
        .findOneAndDelete({
            age: 34
        })
        .then((results) => {
            console.log(results);
        }, (err) => {
            console.log(err);
        })

    // db.close();
});