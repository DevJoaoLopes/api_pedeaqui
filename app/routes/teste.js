const express = require("express");
const route = express.Router();
const { mysql } = require("../helpers/mysql");

route.get('/teste', async (request, response) => {

    let clientes = await mysql.queryAsync(`SELECT c.* FROM clientes AS c`);
    
    return response.status(200).json({
        data: clientes
    });

});

module.exports = route