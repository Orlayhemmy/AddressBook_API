import mongoose from 'mongoose';
const request = require('supertest');
const app = require('../server');
const User = require('../entities/user');
const { flushCollections } = require('../utils/db')

jest.setTimeout(10000);

let userId = '';

beforeAll(async () => {
    flushCollections()
    await User.create({
        "name": "Williams",
        "email": "williams@gmail.com",
        "username": "willy001",
        "password": "password"
    })

    await User.create({
        "name": "Eric",
        "email": "eric@gmail.com",
        "username": "Eric001",
        "password": "password"
    })

})

describe('User Endpoints', () => {
    it('should throw an error when any property for creating a new user is missing', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: "",
                email: "test@gmail.com",
                username: "tester",
                password: "password"
            })
        expect(res.status).toEqual(422)
        expect(res.body.success).toBe(false)
        expect(res.body.errors[0]).toHaveProperty('name')
        expect(res.body.errors[0].name).toEqual('name cannot be empty')
    })

    it('should throw an error when an existing username is used for creating a new user', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: "tester",
                email: "test@gmail.com",
                username: "willy001",
                password: "password"
            })
        expect(res.status).toEqual(422)
        expect(res.body.success).toBe(false)
        expect(res.body.errors[0]).toHaveProperty('username')
        expect(res.body.errors[0].username).toEqual('Username already in use')
    })

    it('should throw an error when an existing email is used for creating a new user', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: "tester",
                email: "williams@gmail.com",
                username: "tester",
                password: "password"
            })
        expect(res.status).toEqual(422)
        expect(res.body.success).toBe(false)
        expect(res.body.errors[0].email).toEqual('Email already in use')
    })

    it('should create a new user', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: "tester",
                email: "tester@gmail.com",
                username: "tester",
                password: "password_tester"
            })
        expect(res.status).toEqual(201)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toEqual("Account created!")
        expect(res.body).toHaveProperty('token')
    })

    it('should throw error if the email doesnt exist', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: "westers@gmail.com",
                password: "password"
            })
        expect(res.status).toEqual(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toEqual("Wrong login details!")
    })


    it('should throw error if the password is wrong', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: "tester@gmail.com",
                password: "wrong_password"
            })
        expect(res.status).toEqual(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toEqual("Wrong login details!")
    })

    it('should log user in when the right credential is provided', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: "tester@gmail.com",
                password: "password_tester"
            })
        expect(res.status).toEqual(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toEqual("Signed In!")
        expect(res.body).toHaveProperty('token')
    })
})
