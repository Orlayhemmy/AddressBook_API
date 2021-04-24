import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const checkAuthStatus = (req, res, next) => {
    const bearerHeader = req.headers.authorization
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        const user = jwt.verify(bearerToken, process.env.TOKEN_KEY)

        req.user = user
        return next()
    }
    return res.status(401).json({ message: 'Unauthorized Action, Please register or login' })
}

export default checkAuthStatus
