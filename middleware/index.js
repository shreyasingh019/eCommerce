//to import all the middleware function into one single file

const {checkNameForCategory} = require('./category')
const { validateProductData } = require('./product')
const {checkDuplicateUsernameAndEmail, checkRoles} = require('./user')
const {verifyToken, isAdmin} = require('./authjwt')


module.exports = {
    checkNameForCategory,
    validateProductData,
    checkDuplicateUsernameAndEmail,
    checkRoles,
    verifyToken,
    isAdmin
}