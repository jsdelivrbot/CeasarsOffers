var url = require('url');

exports.parseRequestForParameters(requestObject){
    var params = new Object();
    var url_parts = url.parse(requestObject.url, true);
    console.log(url_parts.query);
    return '';
}