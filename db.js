
var mysql = require('mysql');

var TEST_DATABASE = 'firefight0626';
//创建连接
var client = mysql.createConnection({
    user: 'root',
    password: 'azsxdc',
});
client.TEST_TABLE = 'user';

client.connect();

client.query("use " + TEST_DATABASE);

module.exports = client;