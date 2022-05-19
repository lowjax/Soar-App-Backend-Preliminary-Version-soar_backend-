const express = require("express")
const bcrypt = require("bcrypt")
const validator = require("validator")


const router = express.Router()

const userModel = require("../models/userModel")
const logModel = require("../models/logModel")
const { request } = require("express")
const session = require("express-session")

router.get("/users", (req, res) => {

    // userModel.getAllUsers()
    //     .then((results) => {
    //         res.status(200).json(results)
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //         res.status(500).json("query error")
    //     })
    const userLoggedIn = req.session.user = !null

    if (userLoggedIn == true) {
        userModel.getAllUsers()
        .then((results) => {
            res.status(200).json(results)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("query error")
        })
        console.log(req.session.user.email)
        logModel.createLog(
            req.ip,
            req.sessionID,
            req.session.user.email,
            req.session.user.user_status,
            (new Date().toISOString()),
            req.method,

        )
    } else {
        res.redirect('/login')
        res.alert("you must sign in")
        res.alert('user not logged in')
    }


    // console.log(req.ip)
    // console.log(new Date().toISOString())
    // console.log(req.method)
    // console.log(req.session.user.email)
    // console.log(req.session.user.user_status)
    // console.log(JSON.stringify(req.session.user))
    if (
        req.session.user
    ) {
        console.log(req.session.user.email)
        console.log(req.session.user.user_status)
    }
})

// router.post("/users/create", (req, res) => {
//     // Only allow admins to use this endpoint
//     if (req.session.user.accessRights != "admin") {
//         // Send back an error message
//         res.status(403).json("admin only action")
//         // Stop this response handler here
//         return;
//     }

//     // req.body represents the form field data (json in body of fetch)
//     let user = req.body

//     // Only allow valid emails
//     if (validator.isEmail(user.email) == false) {
//         res.status(300).json("invalid email")
//         return;
//     }

//     // Hash the password before inserting into DB
//     let hashedPassword = bcrypt.hashSync(user.password, 6)

//     // Each of the following names reference the "name"
//     // attribute in the inputs of the form.
//     userModel.createUser(
//         validator.escape(user.first_name),
//         validator.escape(user.last_name),
//         validator.escape(user.email),
//         hashedPassword, // We now store the hashed version of the password
//         validator.escape(user.user_status)
//     )
//     .then((result) => {
//         res.status(200).json("user created with email " + result.insertemail)

//         // Log user creation
//         logModel.addLogEntryCreate(req.session.user.email, result.insertemail)
//     })
//     .catch((error) => {
//         console.log(error)
//         res.status(500).json("query error - failed to create user")
//     })

// })

router.post("/users/create", (req, res) => {
    // Only allow admins to use this endpoint
    // console.log(req.body)

    // req.body represents the form field data (json in body of fetch)
    let user = req.body
    // console.log(2, user)
    // console.log(1,user.password)

    // Only allow valid emails

    // Hash the password before inserting into DB
    let hashedPassword = bcrypt.hashSync(user.password, 6)
    console.log(hashedPassword)

    // Each of the following names reference the "name"
    // attribute in the inputs of the form.
    userModel.createUser(
            user.email,
            user.first_name,
            user.last_name, user.phone,
            user.profilePic_path,
            user.date_joined,
            user.user_status,
            hashedPassword

            // We now store the hashed version of the password
        )
        .then((result) => {
            res.status(200).json("user created with email " + user.email)

            // Log user creation
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("query error - failed to create user")
        })

        let userLoggedIn
        if (req.session.user != null) {
            userLoggedIn = true
    
        } else {
            userLoggedIn = false
        }
    
        if (userLoggedIn == true) {
            logModel.createLog(
                req.ip,
                (JSON.stringify(req.session.user)),
                req.session.user.email,
                req.session.user.user_status,
                (new Date().toISOString()),
                req.method,
    
            )
        } else {
            console.log("not logged in")
            // res.redirect('/api/user/login')
        }

})



// !!! You should add a comment here explaining this block in your own words.
router.get("/users/:email", (req, res) => {
    console.log(req.params.email)
    userModel.getUserByEmail(req.params.email)
        .then((results) => {
            if (results.length > 0) {
                res.status(200).json(results[0])
            } else {
                res.status(404).json("failed to get user by email")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to get user - query error")
        })
    const userLoggedIn = req.session.user = !null
    if (userLoggedIn == true) {
        logModel.createLog(
            req.ip,
            (JSON.stringify(req.session.user)),
            req.session.user.email,
            req.session.user.user_status,
            (new Date().toISOString()),
            req.method,

        )
    } else {

        logModel.createLog(
            req.ip,
            req.method,

        )
        res.redirect('/login')
        res.alert("you must sign in")
    }
})

// Define an /api/users/update endpoint that updates an existing user
router.patch("/users/update", (req, res) => {
    // the req.body represents the posted json data
    let user = req.body
    console.log(req.body)

    let password = user.password

    // If the string does NOT start with a $ then we need to hash it.
    // Existing passwords that do start with $ are already hashed.
    if (!password.startsWith("$")) {
        password = bcrypt.hashSync(password, 6)
    }

    // Each of the names below reference the "name" attribute in the form
    userModel.updateUser(
            user.first_name,
            user.last_name,
            user.phone,
            user.profilePic_path,
            user.date_joined,
            user.user_status,
            password, // Use the hashed password
            user.email
        )
        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("user updated")
            } else {
                res.status(404).json("user not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to update user - query error")
        })
    let userLoggedIn
    if (req.session.user != null) {
        userLoggedIn = true

    } else {
        userLoggedIn = false
    }

    if (userLoggedIn == true) {
        logModel.createLog(
            req.ip,
            (JSON.stringify(req.session.user)),
            req.session.user.email,
            req.session.user.user_status,
            (new Date().toISOString()),
            req.method,

        )
    } else {
        console.log("not logged in")
        // res.redirect('/api/user/login')
    }
})

router.delete("/users/delete", (req, res) => {
    // Access the user id from the body of the request
    let email = req.body.email

    // Ask the model to delete the user with userId
    userModel.deleteUser(email)
        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("user deleted")
            } else {
                res.status(404).json("user not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to delete user - query error")
        })
    let userLoggedIn
    if (req.session.user != null) {
        userLoggedIn = true

    } else {
        userLoggedIn = false
    }

    if (userLoggedIn == true) {
        logModel.createLog(
            req.ip,
            (JSON.stringify(req.session.user)),
            req.session.user.email,
            req.session.user.user_status,
            (new Date().toISOString()),
            req.method,

        )
    } else {
        console.log("not logged in")
        // res.redirect('/api/user/login')
    }
})

router.post("/users/login", (req, res) => {
    // console.log(req)
    let login = req.body
       console.log(login)

    userModel.getUserByEmail(login.email)
        .then((results) => {
            console.log(results)
            if (results.length > 0) {
                // We found a user with that username,
                // next we check their password.
                let user = results[0]
                console.log(user)
                // console.log('Form Password: ', login.password)
                // console.log('Database Password: ', user.password)
                // Check if the login password matches the users password hash
                if (bcrypt.compareSync(login.password, user.password)) {

                    req.session.user = {
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        user_status: user.user_status
                        // userID: user.userID,
                        // accessRights: user.accessRights,
                    }
                    console.log(req.session.user.email, + "login", req.session.user.user_status)

                    // //setup session to login user
                    // request.session.user = {
                        // user_status: user.user_status,
                        // email: user.email,
                        // loginstatus: true,
                        // password: user.password
                    // }
                  
                    // req.session.username=login.email;
                    // req.session.loginstatus=true;
                    

                    //update database with loginstatus
                    

                    // console.log('Request Body Info: ', req.body)
                    // console.log('Request Session Info: ',req.session)

                  

                    // console.log(req.session.loginstatus)
                    // let the client know login was successful
                    // res.status(200).json({message:"login successful", user_status: req.session.user.user_status })
                        res.status(200).json({message:"login successful", user_status: req.session.user.user_status, email:req.session.user.email})
                        
                    // res.status(200).json({status:"login successful", user_status: user.user_status } )
                } else {
                    // let teh client know login failed
                    res.status(401).json("login failed")
                }
            } else {
                // No user found with that username
                res.status(404).json("that user doesn't exist!")
            }
        })

        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to get user - query error")
        })

})

router.post("/users/logout", (req, res) => {
    // const userLoggedIn = req.session.user = !null
    let userLoggedIn = req.session.user !== null
    console.log('Logout Stuff1: ', userLoggedIn)
    console.log('Logout stuff2: ', req.session)
    // console.log(req.session)
    if (req.session.user.user_status != null) {
        userLoggedIn = true

    } else {
        userLoggedIn = false
    }
    console.log("before check: ",userLoggedIn)
    if (userLoggedIn == true) {
        // logModel.createLog(
        //     req.ip,
        //     (JSON.stringify(req.session)),
        //     req.session.username,
        //     req.session.user.user_status,
        //     (new Date().toISOString()),
        //     req.method,

        // )
        console.log("just before destroy :)")
        req.session.destroy()
        res.status(200).json("logged out")
    } else {
        console.log("not logged in")
        // res.redirect('/api/user/login')
    }
})


// This allows the server.js to import (require) the routes
// defined in this file.
module.exports = router