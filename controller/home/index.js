const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

exports.get = async (request, reply) => {
    console.log("in here..");
    return reply.send({
        success: 1,
        msg: `you are running version ${process.env.VERSION}` 
    })
}

exports.generateToken = async (request, reply) => {
    const credentials = { id: 'user_id' }
    
    const token = jwt.sign(credentials, SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '30d'
    });

    return reply.send({
        success: 1,
        msg: 'token',
        data: {
            token,
        }
    });
}