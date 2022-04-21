// Import mysql2 module so that we can talk to the database
const mysql = require("mysql2")

// Create a connection to the database
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "soar"
})

// This wrapper will allow the use of promise functions
// like .then() and .catch() so that we can use it in an async
// way along with expressJS.
const query = (sql, parameters) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, parameters, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

// export the new query function so that the models can use it
module.exports = {
    query
}