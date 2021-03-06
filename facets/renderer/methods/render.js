'use strict';

const Bluebird = require('bluebird');
const Boom = require('boom');
const _ = require('lodash');

module.exports = render;

const renderers = [
    require('../lib/babelRenderer'),
    require('../lib/typescriptRenderer'),
    require('../lib/base64Renderer'),
    require('../lib/staticRenderer'),
    require('../lib/npmcdnRenderer'),
    require('../lib/lessRenderer'),
    require('../lib/markdownRenderer'),
    require('../lib/coffeeRenderer'),
    require('../lib/jadeRenderer'),
    require('../lib/sassRenderer'),
    require('../lib/stylusRenderer'),
];



function render(request) {
    const pathname = request.params.pathname;
    const preview = request.pre.preview;
    const candidates = pathname
        ?   [pathname]
        :   ['index.html', 'README.html', 'demo.html'];
    
    if (!preview) {
        return Bluebird.reject(Boom.notFound());
    }
    
        
    for (let candidate of candidates) {
        const render = findRenderer(preview, candidate);
        
        if (render) {
            return Bluebird.try(() => render(request));
        }
    }
    
    return Bluebird.reject(Boom.notFound());
}

function findRenderer(preview, pathname) {
    for (let renderer of renderers) {
        const render = renderer.getRenderer(preview, pathname);
        
        if (render) {
            return render;
        }
    }
}
