// Access the database connection from database.js
const db = require("../database")

module.exports.getAllUsers = () => {
    return db.query("SELECT email, first_name, last_name, phone, profilePic_path, date_joined, user_status, password FROM users")
}

module.exports.createUser = (email, first_name, last_name, phone, profilePic_path, date_joined, user_status, password) => {
    return db.query("INSERT INTO users (email, first_name, last_name, phone, profilePic_path, date_joined, user_status, password) "
        + `VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [email, first_name, last_name, phone, profilePic_path, date_joined, user_status, password])
}

module.exports.getUserByEmail = (email) => {
    return db.query("SELECT * FROM users WHERE email = ?", [email])
}

module.exports.getUserByPhone = (phone) => {
    return db.query("SELECT * FROM users WHERE phone = ?", [phone])

}

module.exports.updateUser = (first_name, last_name, phone, profilePic_path, date_joined, user_status, password, email) => {
    // console.log(first_name, last_name, phone, profilePic_path, date_joined, user_status, password, email)
    return db.query("UPDATE users SET first_name = ?, last_name = ?, phone = ?, profilePic_path = ?, date_joined = ?, user_status = ?, password = ? WHERE email = ?", [first_name, last_name, phone, profilePic_path, date_joined, user_status, password, email])
}

module.exports.deleteUser = (email) => {
    return db.query("DELETE FROM users WHERE email = ?", [email])
}

