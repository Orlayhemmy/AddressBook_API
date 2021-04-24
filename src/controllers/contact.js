import Contact from '../entities/contact';

const getAllContacts = (req, res) => {
    const { id } = req.user

    return Contact.find({ userId: id }, (err, doc) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "An error occurred, try later!" })
        }

        if (!doc.length) {
            return res.status(404).json({
                message: "No contact found!",
            })
        }
        return res.status(200).json({
            message: "Contacts retrieved successfully!",
            data: doc
        })
    })
};

const createContact = (req, res) => {
    const { fullname, number, address } = req.body
    const { id } = req.user

    const newContact = new Contact({
        userId: id,
        fullname,
        number,
        address
    })

    return newContact.save((err, doc) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred, try later!" })
        }

        return res.status(201).json({
            message: "Contact Added!", data: newContact
        })
    })
}

const getContactByName = (req, res) => {
    const { fullname } = req.query
    const { id } = req.user

    return Contact.findOne({ fullname, userId: id }, (err, doc) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred, try later!" })
        }

        if (!doc) return res.status(404).json({ message: "Contact not found!" })

        return res.status(200).json({
            message: "Contact found!", data: doc
        })
    })
}

const getContactById = (req, res) => {
    const { id } = req.user

    return Contact.findOne({ _id: req.params.id, userId: id }, (err, doc) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred, try later!" })
        }

        if (!doc) return res.status(404).json({ message: "Contact not found!" })

        return res.status(200).json({
            message: "Contact found!", data: doc
        })
    })
}

const updateContact = (req, res) => {
    const { id } = req.user
    const fields = ['fullname', 'address', 'number']
    let isNewData = false

    return Contact.findOne(
        { _id: req.params.id, userId: id },
        (err, doc) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred, try later!" })
            }

            if (!doc) return res.status(404).json({ message: "Contact not found!" })

            fields.forEach((field) => {
                // check that field is present in req.body and also compare with the exist value in the db
                if (req.body[field] && req.body[field] !== doc[field]) {
                    doc[field] = req.body[field]
                    isNewData = true
                }
            })

            if (!isNewData) return res.status(400).json({ message: "Please include field(s) to be updated!" })

            doc.save()

            return res.status(200).json({
                message: "Contact updated!", data: doc
            })
        }
    )
}

const removeContact = (req, res) => {
    const { id } = req.user

    return Contact.deleteOne(
        { _id: req.params.id, userId: id },
        (err,) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred, try later!" })
            }
            return res.status(200).json({
                message: "Contact removed!"
            })
        }
    )
}

export default {
    // get all contacts for a user
    getAllContacts,
    // get a single contact by name
    getContactByName,
    // get a single contact by id
    getContactById,
    // create a single contact
    createContact,
    // update a single contact
    updateContact,
    // remove a single contact
    removeContact
}