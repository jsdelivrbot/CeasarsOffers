
exports.postOffer = function(request, response){
    var requestBody = request.body;
    var offers = JSON.parse(JSON.stringify(requestBody));
    for(var i =0; i<offers.length; i++){
        console.log('offer name ' + offers[i].name);
    }
}