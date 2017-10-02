const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Todos endpoints', () => {


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
});

describe('Users endpoint', () => {

    describe('POST /users', () => {
        it('should create a new user', (done) => {
            var user = {
                email: "dan@example.com",
                password: "123456789"
            };
            request(app)
                .post('/users')
                .send(user)
                .expect(201)
                .expect((res) => {
                    expect(res.header).toIncludeKeys(['x-auth']);
                    expect(res.header['x-auth']).toNotEqual('undefined');
                    expect(res.body.email).toBe(user.email);
                    expect(res.body._id).toExist();

                })
                .end((err) => {
                    if (err) {
                        return done(err);
                    }
                    User
                        .findOne({email: user.email})
                        .then((userFromDB) => {
                            expect(userFromDB.email).toBe(user.email);
                            expect(userFromDB.password).toNotBe(user.password);
                            done();
                        })
                        .catch((err) => done(err));
                });
        });
        it('Should not create user with invalid email body data', (done) => {
            var user = {
                email: "dan!#5^^&*(example.com",
                password: "123456789"
            };

            request(app)
                .post('/users')
                .send(user)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('User validation failed');
                    expect(res.body.errors.email.message).toBe(`${user.email} is not a valid email`);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    User
                        .find()
                        .then((users) => {
                            expect(users.length).toBe(2);
                            done();
                        })
                        .catch((err) => done(err))
                });
        });
        it('Should not create user with invalid password body data', (done) => {
            var user = {
                email: "dan@example.com",
                password: "1"
            };

            request(app)
                .post('/users')
                .send(user)
                .expect(400)
                .expect((res) => {
                    // console.log(JSON.stringify(res.body, undefined, 2));
                    expect(res.body.message).toBe('User validation failed');
                    expect(res.body.errors.password.message).toBe('Path `password` (`1`) is shorter than the minimum allowed length (6).');
                    expect(res.body.errors.password.properties.type).toBe(`minlength`);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    User
                        .find()
                        .then((users) => {
                            expect(users.length).toBe(2);
                            done();
                        })
                        .catch((err) => done(err))
                });
        });
        it('Should not create user with an email that already exists', (done) => {
            var user = {
                email: "dan.a@example.com",
                password: "1234567890"
            };

            request(app)
                .post('/users')
                .send(user)
                .expect(400)
                .expect((res) => {
                    expect(res.body.code).toBe(11000);
                    var isErrMessageCorrect = res.body.errmsg.startsWith('E11000 duplicate key error collection');
                    expect(isErrMessageCorrect).toExist();

                })
                .end(done);

        });
        it('Should not create a user in case no email is supplied', (done) => {
            var user = {
                password: "1234567890"
            };

            request(app)
                .post('/users')
                .send(user)
                .expect(400)
                .expect((res) => {
                    // console.log(JSON.stringify(res.body, undefined, 2));
                    expect(res.body.errors.email.message).toBe('Path `email` is required.');
                    expect(res.body.errors.email.properties.type).toBe('required');
                })
                .end(done);
        });
        it('Should not create a user in case no password is supplied', (done) => {
            var user = {
                email: "example@example.com"
            };

            request(app)
                .post('/users')
                .send(user)
                .expect(400)
                .expect((res) => {
                    // console.log(JSON.stringify(res.body, undefined, 2));
                    expect(res.body.errors.password.message).toBe('Path `password` is required.');
                    expect(res.body.errors.password.properties.type).toBe('required');
                })
                .end(done);
        });
        it('Should return only email and id attributes in the response', (done) => {
            var user = {
                email: "attributes@example.com",
                password: '1234567890'
            };

            request(app)
                .post('/users')
                .send(user)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toIncludeKeys(['_id', 'email']);
                })
                .end(done);
        });
    });

    describe('GET /users/me', () => {
        it('Should return a user if authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                })
                .end(done);
        });
        it('Should return a 401 if not authenticated', (done) => {
            request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                })
                .end(done);
        });
    });
});
