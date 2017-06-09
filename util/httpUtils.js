var url = require('url');

exports.parseRequestForParameters = function(requestObject){
    var url_parts = url.parse(requestObject.url, true);
    return url_parts.query;
}