let url = require('url');

exports.parseRequestForParameters = function(requestObject){
    let url_parts = url.parse(requestObject.url, true);
    return url_parts.query;
}