const sql = require('mssql');

// Tüm linkleri getir
async function getAllLinks() {
    const result = await sql.query`SELECT * FROM Links`;
    return result.recordset;
}

// Yeni bir link ekle
async function addLink(name, url, description) {
    await sql.query`INSERT INTO Links (name, url, description) VALUES (${name}, ${url}, ${description})`;
}

// Bir linki güncelle
async function updateLink(id, name, url, description) {
    await sql.query`UPDATE Links SET name = ${name}, url = ${url}, description = ${description} WHERE id = ${id}`;
}

// Bir linki sil
async function deleteLink(id) {
    await sql.query`DELETE FROM Links WHERE id = ${id}`;
}

module.exports = {
    getAllLinks,
    addLink,
    updateLink,
    deleteLink
};
