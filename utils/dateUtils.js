use strict;

exports.convertToPostgresDateTime = function(dateParam){
    return dateParam.getFullYear() +'-' + ensureLeadingZeros(dateParam.getMonth()+1)+'-'+ensureLeadingZeros(dateParam.getDate())+' '+ensureLeadingZeros(dateParam.getHours())+':'+ensureLeadingZeros(dateParam.getMinutes())+':'+ensureLeadingZeros(dateParam.getSeconds());
}

var ensureLeadingZeros = function(param){
    return param < 10 ? '0'+param : param;
}