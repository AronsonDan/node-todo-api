const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [
    {
        text: 'first test todo'
    },
    {
        text: 'second test todo'
    }
];

beforeEach((done) => {
    Todo
        .remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Todo text';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo
                    .find()
                    .then((todos) => {
                        expect(todos.length).toBe(3);
                        expect(todos[2].text).toBe(text);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    it('Should not create todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo
                    .find()
                    .then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch((err) => done(err))
            });
    })
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});