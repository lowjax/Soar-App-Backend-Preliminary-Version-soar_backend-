const db = require("../database")


// module.exports.getInjuryBySport= (sport) => {
//     return db.query("SELECT * FROM injury WHERE sport = ?", [sport])
// },

module.exports.filterExecution= ()=> {
    return db.query("SELECT `sport`.*, `injury`.* FROM `sport` LEFT JOIN `injury` ON `injury`.`sport` = `sport`.`sport`  WHERE body = ?", [body])
}