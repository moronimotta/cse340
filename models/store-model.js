const pool = require('../database/')


// update stock
async function updateStock(inventory_id, stock) {
    try {
        const sql = 'UPDATE store SET amount = $1 WHERE id = $2 RETURNING *'
        return await pool.query(sql, [stock, inventory_id])
    } catch (error) {
        console.error('updateStock error ' + error)
        throw error
    }
}

// get all items in stock
async function getStock() {
    try {
        const sql = 'SELECT * FROM store WHERE amount > 0 ORDER BY id ASC'
        const res = await pool.query(sql)
        return res.rows
    } catch (error) {
        console.error('getStock error ' + error)
        throw error
    }
}

module.exports = {
    updateStock,
    getStock
}
