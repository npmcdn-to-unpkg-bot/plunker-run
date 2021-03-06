const Mime = require('mime-types');
const Path = require('path');
const Url = require('url');


module.exports = {
    name: 'static',
    getRenderer,
    renderStatic,
};


function getRenderer(preview, pathname) {
    const entry = preview.get(pathname);
    
    return entry
        ?   render
        :   undefined;
    
    
    function render(request) {
        return renderStatic(request, entry);
    }
}

function renderStatic(request, entry) {
    const contentType = Mime.lookup(entry.pathname) || 'text/plain';
    const enableLogging = false;
    const payload = enableLogging && contentType === 'text/html' && request.params.previewId
        ?   entry.content.toString('utf-8').replace(/(<head[^>]*>)/, function (headStr) {
                return headStr + `
                    <script>
                        // Stackframe.js
                        !function(e,t){"use strict";"function"==typeof define&&define.amd?define("stackframe",[],t):"object"==typeof exports?module.exports=t():e.StackFrame=t()}(this,function(){"use strict";function e(e){return!isNaN(parseFloat(e))&&isFinite(e)}function t(e,t,r,n,i,o){void 0!==e&&this.setFunctionName(e),void 0!==t&&this.setArgs(t),void 0!==r&&this.setFileName(r),void 0!==n&&this.setLineNumber(n),void 0!==i&&this.setColumnNumber(i),void 0!==o&&this.setSource(o)}return t.prototype={getFunctionName:function(){return this.functionName},setFunctionName:function(e){this.functionName=String(e)},getArgs:function(){return this.args},setArgs:function(e){if("[object Array]"!==Object.prototype.toString.call(e))throw new TypeError("Args must be an Array");this.args=e},getFileName:function(){return this.fileName},setFileName:function(e){this.fileName=String(e)},getLineNumber:function(){return this.lineNumber},setLineNumber:function(t){if(!e(t))throw new TypeError("Line Number must be a Number");this.lineNumber=Number(t)},getColumnNumber:function(){return this.columnNumber},setColumnNumber:function(t){if(!e(t))throw new TypeError("Column Number must be a Number");this.columnNumber=Number(t)},getSource:function(){return this.source},setSource:function(e){this.source=String(e)},toString:function(){var t=this.getFunctionName()||"{anonymous}",r="("+(this.getArgs()||[]).join(",")+")",n=this.getFileName()?"@"+this.getFileName():"",i=e(this.getLineNumber())?":"+this.getLineNumber():"",o=e(this.getColumnNumber())?":"+this.getColumnNumber():"";return t+r+n+i+o}},t}),function(e,t){"use strict";"function"==typeof define&&define.amd?define("error-stack-parser",["stackframe"],t):"object"==typeof exports?module.exports=t(require("stackframe")):e.ErrorStackParser=t(e.StackFrame)}(this,function(e){"use strict";function t(e,t,r){if("function"==typeof Array.prototype.map)return e.map(t,r);for(var n=new Array(e.length),i=0;i<e.length;i++)n[i]=t.call(r,e[i]);return n}function r(e,t,r){if("function"==typeof Array.prototype.filter)return e.filter(t,r);for(var n=[],i=0;i<e.length;i++)t.call(r,e[i])&&n.push(e[i]);return n}function n(e,t){if("function"==typeof Array.prototype.indexOf)return e.indexOf(t);for(var r=0;r<e.length;r++)if(e[r]===t)return r;return-1}var i=/(^|@)\\S+\\:\\d+/,o=/^\\s*at .*(\\S+\\:\\d+|\\(native\\))/m,a=/^(eval@)?(\\[native code\\])?$/;return{parse:function(e){if("undefined"!=typeof e.stacktrace||"undefined"!=typeof e["opera#sourceloc"])return this.parseOpera(e);if(e.stack&&e.stack.match(o))return this.parseV8OrIE(e);if(e.stack)return this.parseFFOrSafari(e);throw new Error("Cannot parse given Error object")},extractLocation:function(e){if(-1===e.indexOf(":"))return[e];var t=/(.+?)(?:\\:(\\d+))?(?:\\:(\\d+))?$/,r=t.exec(e.replace(/[\\(\\)]/g,""));return[r[1],r[2]||void 0,r[3]||void 0]},parseV8OrIE:function(i){var a=r(i.stack.split("\\n"),function(e){return!!e.match(o)},this);return t(a,function(t){t.indexOf("(eval ")>-1&&(t=t.replace(/eval code/g,"eval").replace(/(\\(eval at [^\\()]*)|(\\)\\,.*$)/g,""));var r=t.replace(/^\\s+/,"").replace(/\\(eval code/g,"(").split(/\\s+/).slice(1),i=this.extractLocation(r.pop()),o=r.join(" ")||void 0,a=n(["eval","<anonymous>"],i[0])>-1?void 0:i[0];return new e(o,void 0,a,i[1],i[2],t)},this)},parseFFOrSafari:function(n){var i=r(n.stack.split("\\n"),function(e){return!e.match(a)},this);return t(i,function(t){if(t.indexOf(" > eval")>-1&&(t=t.replace(/ line (\\d+)(?: > eval line \\d+)* > eval\\:\\d+\\:\\d+/g,":$1")),-1===t.indexOf("@")&&-1===t.indexOf(":"))return new e(t);var r=t.split("@"),n=this.extractLocation(r.pop()),i=r.join("@")||void 0;return new e(i,void 0,n[0],n[1],n[2],t)},this)},parseOpera:function(e){return!e.stacktrace||e.message.indexOf("\\n")>-1&&e.message.split("\\n").length>e.stacktrace.split("\\n").length?this.parseOpera9(e):e.stack?this.parseOpera11(e):this.parseOpera10(e)},parseOpera9:function(t){for(var r=/Line (\\d+).*script (?:in )?(\\S+)/i,n=t.message.split("\\n"),i=[],o=2,a=n.length;a>o;o+=2){var s=r.exec(n[o]);s&&i.push(new e(void 0,void 0,s[2],s[1],void 0,n[o]))}return i},parseOpera10:function(t){for(var r=/Line (\\d+).*script (?:in )?(\\S+)(?:: In function (\\S+))?$/i,n=t.stacktrace.split("\\n"),i=[],o=0,a=n.length;a>o;o+=2){var s=r.exec(n[o]);s&&i.push(new e(s[3]||void 0,void 0,s[2],s[1],void 0,n[o]))}return i},parseOpera11:function(n){var o=r(n.stack.split("\\n"),function(e){return!!e.match(i)&&!e.match(/^Error created at/)},this);return t(o,function(t){var r,n=t.split("@"),i=this.extractLocation(n.pop()),o=n.shift()||"",a=o.replace(/<anonymous function(: (\\w+))?>/,"$2").replace(/\\([^\\)]*\\)/g,"")||void 0;o.match(/\\(([^\\)]*)\\)/)&&(r=o.replace(/^[^\\(]+\\(([^\\)]*)\\)$/,"$1"));var s=void 0===r||"[arguments not available]"===r?void 0:r.split(",");return new e(a,s,i[0],i[1],i[2],t)},this)}}});

                        var console = window.console;
                        var warn = console.warn.bind(console);
                        
                        [
                            'debug', 'clear', 'error', 'info', 'log', 'warn', 'dir', 'props', '_raw',
                            'group', 'groupEnd', 'dirxml', 'table', 'trace', 'assert', 'count',
                            'markTimeline', 'profile', 'profileEnd', 'time', 'timeEnd', 'timeStamp',
                            'groupCollapsed'
                        ].forEach(function (key) {
                            var fn = window.console[key];
                            window.console[key] = function() {
                                var args = Array.prototype.slice.call(arguments);
                                var stack = ErrorStackParser.parse(new Error('stack')).slice(1);
                                var callsite = stack[0];
                                
                                fn.apply(console, args);
                                
                                try {
                                    window.parent.postMessage({
                                        type: 'console',
                                        console: {
                                            level: key,
                                            message: args.map(String).join(' '),
                                            pathname: callsite.fileName.split('${request.params.previewId}').pop(),
                                            row: callsite.lineNumber - 1,
                                            column: callsite.columnNumber - 1,
                                        },
                                    }, '*');
                                        
                                } catch (e) {
                                    warn('Failed to proxy console', { method: key, args: args }, e);
                                }
                            };
                        });
                        
                        window.parent.postMessage({
                            type: 'ready',
                        }, '*');
                    </script>
                `;
            })
        :   entry.content;
    
    return {
        encoding: entry.encoding,
        etag: entry.etag + '-' + module.exports.name,
        headers: {
            'Content-Type': contentType,
        },
        payload,
    };
}