// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');

    // findOneAndUpdate
    db.collection('Todos')
        .findOneAndUpdate({
                _id: new ObjectID('59bfe822cfbaa75e600da7ec')
            },
            {
                $set: {
                    text: 'Walk the dog'
                }
            })
        .then((result) => {
            console.log(JSON.stringify(result, undefined, 2));
        }, (err) => {
            console.log(err);
        })

    db.collection('Users')
        .findOneAndUpdate({
                _id: new ObjectID('59bff61ecfbaa75e600daeba')
            },
            {
                $set: {
                    name: "Dan Aronson",
                    age: 34
                }
            })
        .then((result) => {
            console.log(JSON.stringify(result, undefined, 2));
        }, (err) => {
            console.log(err);
        });

    // db.close();
});