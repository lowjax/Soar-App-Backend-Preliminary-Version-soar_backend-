// Access the database connection from database.js
const db = require("../database")
module.exports.getAllContent = () => {
    return db.query("SELECT * FROM content")
}

module.exports.createContent= (injury) => {
    return db.query("INSERT INTO content WHERE sport = ?", [injury])
}

module.exports.createContent = (file_name) => {
    return db.query("INSERT INTO content (file_name) "
        + `VALUES (?)`, [file_name])
}

module.exports.updateContent = (file_name) => {
    return db.query("file_name = ?", [file_name])
}

module.exports.deleteContent = (file_name) => {
    return db.query("DELETE FROM content WHERE file_name = ?", [file_name])
}