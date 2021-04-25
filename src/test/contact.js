import mongoose from 'mongoose';
const request = require('supertest');
const app = require('../server');
const Contact = require('../entities/contact');
const { flushCollections } = require('../utils/db')

let token = null
let contactId = null
let userTwoToken = null

beforeAll(async () => {
    const userOne = await request(app)
        .post('/auth/login')
        .send({
            email: "williams@gmail.com",
            password: "password"
        })
    token = userOne.body.token

    await request(app)
        .post('/contact')
        .set('Authorization', 'Bearer ' + token)
        .send({
            fullname: "Ashady Law",
            number: "+22333",
            address: "22 valleyview lane",
        })

    const userTwo = await request(app)
        .post('/auth/login')
        .send({
            email: "eric@gmail.com",
            password: "password"
        })

    userTwoToken = userTwo.body.token
})

afterAll(() => mongoose.disconnect());

describe('Contacts Endpoints', () => {
    it('should throw an error when the contact creation endpoint is accessed by an unauthorized user', async () => {
        const res = await request(app)
            .post('/contact')
            .send({
                fullname: "Inem",
                number: "2232333",
                address: "22 valleyview lane",
            })
        expect(res.status).toEqual(401)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toEqual('Unauthorized Action, Please register or login')
    })

    it('should throw an error when the contact fullname is missing on contact creation', async () => {

        const res = await request(app)
            .post('/contact')
            .set('Authorization', 'Bearer ' + token)
            .send({
                number: "2232333",
                address: "22 valleyview lane",
            })
        expect(res.status).toEqual(422)
        expect(res.body.success).toBe(false)
        expect(res.body.errors[0].fullname).toEqual('fullname cannot be empty')
    })


    it('should throw error when number contains invalid characters', async () => {

        const res = await request(app)
            .post('/contact')
            .set('Authorization', 'Bearer ' + token)
            .send({
                fullname: "Emmanuel",
                number: "+22E32Y333",
                address: "22 valleyview lane",
            })
        expect(res.status).toEqual(422)
        expect(res.body.success).toBe(false)
        expect(res.body.errors[0].number).toEqual('Letters are not allowed!')
    })

    it('should create a contact', async () => {

        const res = await request(app)
            .post('/contact')
            .set('Authorization', 'Bearer ' + token)
            .send({
                fullname: "Emmanuel",
                number: "2232333",
                address: "22 valleyview lane",
            })

        contactId = res.body.data._id

        expect(res.status).toEqual(201)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toEqual("Contact Added!")
        expect(res.body).toHaveProperty('data')
    })

    it('should throw error when creating a contact with same number or name', async () => {

        const res = await request(app)
            .post('/contact')
            .set('Authorization', 'Bearer ' + token)
            .send({
                fullname: "Emmanuel",
                number: "2232333",
                address: "22 valleyview lane",
            })
        expect(res.status).toEqual(422)
        expect(res.body.success).toBe(false)
        expect(res.body.errors[1].number).toEqual('Contact with that number exists!')
        expect(res.body.errors[0].fullname).toEqual('Contact with that name exists!')
    })

    it('should update a contact', async () => {

        const res = await request(app)
            .put(`/contacts/${contactId}`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                fullname: "Emmanuel King",
                number: "+223552333",
                address: "22 valleyview lane, CA",
            })

        expect(res.status).toEqual(200)
        expect(res.body.success).toBe(true)
    })

    it('should not update a contact if the values are the same', async () => {

        const res = await request(app)
            .put(`/contacts/${contactId}`)
            .set('Authorization', 'Bearer ' + token)
        expect(res.status).toEqual(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toEqual("Please include field(s) to be updated!")
    })

    it('should return not found if the contact to be updated doesnt belong to the logged in user', async () => {

        const res = await request(app)
            .put(`/contacts/${contactId}`)
            .set('Authorization', 'Bearer ' + userTwoToken)
            .send({
                fullname: "Emma",
            })
        expect(res.status).toEqual(404)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toEqual("Contact not found!")
    })

    it('should return all the contacts belonging to a user', async () => {

        const res = await request(app)
            .get('/contact/all')
            .set('Authorization', 'Bearer ' + token)

        expect(res.status).toEqual(200)
        expect(res.body.success).toBe(true)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveLength(2)
    })

    it('should return not found if user has not contact', async () => {

        const res = await request(app)
            .get('/contact/all')
            .set('Authorization', 'Bearer ' + userTwoToken)

        expect(res.status).toEqual(404)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toEqual('No contact found!')
    })

    it('should get a contact by name', async () => {

        const res = await request(app)
            .get('/contacts?fullname=ashady law')
            .set('Authorization', 'Bearer ' + token)

        expect(res.status).toEqual(200)
        expect(res.body.success).toBe(true)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.fullname).toEqual('ashady law')
    })

    it('should get a contact by Id', async () => {

        const res = await request(app)
            .get(`/contacts/${contactId}`)
            .set('Authorization', 'Bearer ' + token)

        expect(res.status).toEqual(200)
        expect(res.body.success).toBe(true)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.fullname).toEqual('emmanuel king')
    })


    it('should delete a contact', async () => {
        const res = await request(app)
            .delete(`/contacts/${contactId}`)
            .set('Authorization', 'Bearer ' + token)

        expect(res.status).toEqual(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toEqual('Contact removed!')
    })
})