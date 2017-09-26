const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');

const todos = [
    {
        _id: new ObjectID(),
        text: 'first test todo'
    },
    {
        _id: new ObjectID(),
        text: 'second test todo',
        completed: true,
        completedAt: 10987
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

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        var id = todos[0]._id.toHexString()
        var text = todos[0].text;
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
                expect(res.body.todo.text).toBe(text);
            })
            .end(done)
    });

    it('Should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for invalid object id', (done) => {
        var id = 'ergoiujedrglihjergtlihrgj';
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo
                    .findById(hexId)
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch((err) => done(err));
            });
    });
    it('Should return a 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('Should return a 404 if ObjectId is invalid', (done) => {
        var id = 'sdfkugsdfbm,sdaum,kfgsdf,kh'
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var newBody = {
            text: "Updated test text",
            completed: true
        };

        request(app)
            .patch(`/todos/${hexId}`)
            .send(newBody)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newBody.text);
                expect(res.body.todo.completed).toBe(newBody.completed);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });
    it('Should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var newBody = {
            text: "Updated test text",
            completed: false
        };

        request(app)
            .patch(`/todos/${hexId}`)
            .send(newBody)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newBody.text);
                expect(res.body.todo.completed).toBe(newBody.completed);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});