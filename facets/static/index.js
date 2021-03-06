'use strict';



exports.register = function(server, options, next) {
    server.bind({
        config: options.config,
        server: server,
    });
    
    server.dependency([
        'inert',
    ], register);
    
    server.log(['info', 'init'], `Started ${exports.register.attributes.name}@${exports.register.attributes.version}.`);

    next();
};


exports.register.attributes = {
    'name': 'static',
    'version': '0.0.1',
    'dependencies': [
        'inert',
    ]
};


function register(server, next) {
    server.route({
        method: 'GET',
        path: '/favicon.ico',
        config: require('./routes/handleStatic')('favicon.ico')
    });
    
    server.route({
        method: 'GET',
        path: '/robots.txt',
        config: require('./routes/handleStatic')('robots.txt')
    });
    
    server.route({
        method: 'GET',
        path: '/sw.js',
        config: require('./routes/handleStatic')('sw.js')
    });
    
    server.route({
        method: 'GET',
        path: '/sw.html',
        config: require('./routes/handleStatic')('sw.html')
    });
    
    server.route({
        method: 'GET',
        path: '/preview.html',
        config: require('./routes/handleStatic')('preview.html')
    });
    
    server.log(['info', 'init'], 'Started ' + exports.register.attributes.name + '.');

    next();
}