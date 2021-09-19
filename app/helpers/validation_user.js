const { mysql } = require("../helpers/mysql")

module.exports = {
    validation: async (id) => {
        let usuario = await mysql.queryAsync(`SELECT u.id, u.usuario FROM usuarios AS u WHERE u.id = ? AND u.deleted_at IS NULL`, [id])
        
        return usuario.length > 0 ? true : false
    }
}