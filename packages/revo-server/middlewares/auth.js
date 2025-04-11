require('dotenv').config()

const jwt = require('jsonwebtoken')
const pg = require('../services/pgService')

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization
//   const token = authHeader?.split(' ')[1]

//   if (!token) return res.status(401).json({ error: 'Token required' })

//   try {
//     const decoded = jwt.verify(token, `${process.env.DJANGO_SECRET_KEY}`) // 注意安全性！
//     req.user = decoded
//     next()
//   } catch (err) {
//     return res.status(403).json({ error: 'Invalid or expired token' })
//   }
// }

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization') || req.header('authorization')
    if (!authHeader) return res.status(401).send('Token required')

    try {
        const token = authHeader.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.DJANGO_SECRET_KEY) // 建議用 .env 管理
        const user = await pg.exec(
            'oneOrNone',
            'SELECT user_id, name, email, setting, role FROM users WHERE user_id = $1',
            [decoded.user_id || decoded._id]
        )
        if (!user) return res.status(401).send('auth failed')

        req.user = user
        next()
    } catch (err) {
        return res.status(401).send('auth failed')
    }
}

module.exports = authMiddleware