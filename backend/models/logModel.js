const db = require("../database")

module.exports.createLog = (ip, sessionID, email, user_status, time_stamp, action) => {
    return db.query(
         
         `INSERT INTO log (ip, sessionID, email, user_status, time_stamp, action)
         VALUES (?, ?, ?, ?, ?, ?);`
         , [ip, sessionID, email, user_status, time_stamp, action]
    )

}