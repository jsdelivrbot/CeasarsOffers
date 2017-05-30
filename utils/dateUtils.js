exports.convertToPostgresDateTime = function(dateParam){
    return dateParam.getFullYear()+'-' + exports.ensureLeadingZeros(dateParam.getMonth()+1)+
                                   '-'+exports.ensureLeadingZeros(dateParam.getDate())+
                                   ' '+exports.ensureLeadingZeros(dateParam.getHours())+
                                   ':'+exports.ensureLeadingZeros(dateParam.getMinutes())+
                                   ':'+exports.ensureLeadingZeros(dateParam.getSeconds());
}

exports.ensureLeadingZeros = function(param){
    return param < 10 ? '0'+param : param;
}