
var mysql = require('mysql');

var TEST_DATABASE = 'firefight0806';
//创建连接
var client = mysql.createConnection({
    user: 'root',
    password: '123456',
});
client.TABLE = 'user';

client.connect();

client.query("use " + TEST_DATABASE);

module.exports = client;