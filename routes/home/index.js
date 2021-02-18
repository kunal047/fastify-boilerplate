const controller = require('../../controller/home');
const bearerAuthPlugin = require('../../config/fastify_api_auth');

const config = require('../../config/constants')();

const keys = new Set(config.root_api_key);

module.exports = (fastify, opts, done) => {
    // fastify.register(bearerAuthPlugin, { keys, bearerType: 'token', auth_header: 'access_key' });

    fastify.get('/', {
        schema: {
            description: 'get homepage ',
            tags: ['homepage'],
        },
        // preValidation: [fastify.authenticate],
    }, controller.get);

    fastify.get('/token', {
        schema: {
            description: 'get homepage ',
            tags: ['homepage'],
        },

    }, controller.generateToken);

    done();
};
