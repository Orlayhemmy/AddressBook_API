import checkAuthStatus from '../utils/checkAuthStatus'
import validate from '../utils/validate'
import contactValidation from '../validation/contact'
import AddressBook from '../controllers/contact'

module.exports = app => {
    app.route('/contacts')
        .get(checkAuthStatus, AddressBook.getContactByName);
    app.route('/contacts/:id')
        .get(checkAuthStatus, AddressBook.getContactById)
        .put(checkAuthStatus, contactValidation.update, validate, AddressBook.updateContact)
        .delete(checkAuthStatus, AddressBook.removeContact);
    app.route('/contact/all')
        .get(checkAuthStatus, AddressBook.getAllContacts);
    app.route('/contact')
        .post(checkAuthStatus, contactValidation.create, validate, AddressBook.createContact);
};
