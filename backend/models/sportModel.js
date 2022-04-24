// Access the database connection from database.js
const db = require("../database")
module.exports.getSport = () => {
    return db.query("SELECT * FROM sport")
}

module.exports.getSportByBody= (body) => {
    return db.query("SELECT * FROM sport WHERE body = ?", [body])
}

module.exports.deleteSport = (sport) => {
    return db.query("DELETE FROM sport WHERE sport = ?", [sport])
}

module.exports.updateSport = (sport) => {
    return db.query("sport = ?", [sport])
}

module.exports.createSport = (sport) => {
    return db.query("INSERT INTO sport (sport) "
        + `VALUES (?)`, [sport])
}
