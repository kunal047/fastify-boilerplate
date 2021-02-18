const path = require('path');
const helmet = require('helmet');
require('dotenv').config({ path: path.join(__dirname, `.env`) });

const fastify = require('fastify')({
    ignoreTrailingSlash: true,
    trustProxy: true,
    bodyLimit: 10485760, // 10 MB
    logger: {
        prettyPrint: true,
        redact: ['req.headers.authorization'],
        serializers: {
            req(request) {
                return {
                    method: request.method,
                    url: request.url,
                    headers: request.headers,
                    hostname: request.hostname,
                    remoteAddress: request.ip,
                };
            },
        },
    },
});

fastify.register(
    require('fastify-sentry'),
    {
        dsn: process.env.SENTRY_DNS,
        environment: process.env.NODE_ENV || 'development',
    },
    (err) => {
        if (err) throw err;
    },
);

fastify.register(require('fastify-cors'), {
    origin: [/http:\/\/localhost:5555$/, /\.onsurity\.com$/],
    credentials: true,
});

fastify.register(require('fastify-jwt'), {
    secret: process.env.JWT_SECRET,
});

fastify.register(require('fastify-cookie'));

// fastify.register(
//     helmet,
//     { hidePoweredBy: { setTo: 'PHP 4.2.0' } },
// );

fastify.decorate('authenticate', async (request, reply) => {
    try {
        const jwtToken = request.cookies.session_id;
        let decoded = null;
        if (jwtToken) {
            try {
                decoded = fastify.jwt.verify(jwtToken, process.env.JWT_SECRET);
            } catch (e) {
                return reply.code(401).send({ error: 'invalid cookie' });
            }
            if (decoded && decoded.id) {
                request.user = {};
                request.user.id = decoded.id;
                request.token = jwtToken;
            } else {
                return reply.code(401).send({ error: 'invalid cookie' });
            }
        } else {
            await request.jwtVerify();
        }
    } catch (err) {
        logger.error(err);
        return reply.code(401).send({ error: 'invalid token' });
    }
});

/**
 * Registering for routes
 */
fastify.register(require('./routes/home'), { prefix: '/api/v1/' });


fastify.listen(process.env.PORT || 5555, '0.0.0.0', (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
});