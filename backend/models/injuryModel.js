// Access the database connection from database.js
const db = require("../database")
module.exports.getInjury = () => {
    return db.query("SELECT * FROM injury")
}

module.exports.getInjuryBySport= (sport) => {
    return db.query("SELECT * FROM injury WHERE sport = ?", [sport])
}

module.exports.createInjury = (injury) => {
    return db.query("INSERT INTO injury (injury) "
        + `VALUES (?)`, [injury])
}

module.exports.deleteInjury = (injury) => {
    return db.query("DELETE FROM injury WHERE injury = ?", [injury])
}

module.exports.updateInjury = (injury) => {
    return db.query("injury = ?", [injury])
}

