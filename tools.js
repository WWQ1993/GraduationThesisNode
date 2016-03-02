/**
 * Created by 58 on 2016/3/2 0002.
 */

exports.getValFromResults = function (results, valName, getfirstTwo, truth) {
    var arr = []
    outloop:
        for (var j = 0; j < results.length; j++) {
            var id = results[j][valName].toString();
            if (getfirstTwo) {
                id = parseInt(id[0] + id[1], 10);
            }
            for (var n = 0; n < arr.length; n++) {
                if (id === arr[n]) {
                    break outloop;
                }
            }
            if (truth) {
                arr.push({
                    id: id,
                    truth0:  results[j].Confidence ,
                    truth1: results[j].Frequency
                });
            }
            else {
                arr.push(id);
            }
        }
    //console.log(arr.join(','));
    return arr;
}

exports.getLevel = function (results, valName) {
    var arr = []
    outloop:
        for (var j = 0; j < results.length; j++) {
            var levelName = results[j][valName].toString();

            for (var n = 0; n < arr.length; n++) {
                if (id === arr[n]) {
                    break outloop;
                }
            }
            arr.push(id);
        }
    console.log(arr.join(','));
    return arr;
}