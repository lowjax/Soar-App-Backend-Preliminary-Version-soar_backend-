// Access the database connection from database.js
const db = require("../database")
module.exports.getAllFavorites = () => {
    return db.query("SELECT * FROM favorites")
}

module.exports.getFavoritesById= (ID) => {
    return db.query("SELECT * FROM favorites WHERE ID = ?", [ID])
}

module.exports.deleteFavorites = (ID) => {
    return db.query("DELETE FROM favorites WHERE ID = ?", [ID])
}

module.exports.updateFavorites = (ID) => {
    return db.query("ID = ?", [ID])
}

/// create insert into favorites query ***********