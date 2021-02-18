const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
module.exports = () => {
    // Production Env
    if (env === 'production') {
        return {
            db_url: 'whatever',
            root_api_key: ['dpHau891H5uKt5ACrGKHENIuQLGL2JkD'],
        };
    }
    // Development Env
    return {
        db_url: 'whatever',
        root_api_key: ['dpHau891H5uKt5ACrGKHENIuQLGL2JkD'],
    };
};
