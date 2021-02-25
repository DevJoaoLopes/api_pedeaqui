var mysql = require('mysql');
require("dotenv/config")
const bluebird = require('bluebird');

var connection = mysql.createConnection({
    host     : process.env.BANCO_HOST,
    port     : process.env.BANCO_PORT,
    user     : process.env.BANCO_USER,
    password : process.env.BANCO_PASSWORD,
    database : process.env.BANCO_DB
});

bluebird.promisifyAll(connection)

module.exports = {
    mysql: connection
}