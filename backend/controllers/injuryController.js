const express = require("express")
// Create a router so that we can define API
// routes in this file.
const router = express.Router()
// Access the books model so that we can access
// book data in this file.
const injuryModel = require("../models/injuryModel")

const logModel = require("../models/logModel")


// Define an /api/books endpoint that responds with
// an array of all books.
router.get("/injury", (req, res) => {
    injuryModel.getInjury(req.params.sport)
        .then((results) => {
            res.status(200).json(results)
        })
        .catch((error) => {
            // Log any errors to the node console
            console.log(error)
            res.status(500).json("query error")
        })
})

// Define an /api/books/:id endpoint that responds with
// a specific book by id

// could be "/favorites/:content"
router.get("/injury/:sport", (req, res) => {
    // injuryModel.getInjury(injury)
    injuryModel.getInjuryBySport(req.params.sport)
        .then((results) => {
            if (results.length > 0) {
                res.status(200).json(results[0])
            } else {
                res.status(404).json("failed to get injury from sport")
            }
        })
        .catch((error) => {
            // Log sql errors to node console
            console.log(error)
            res.status(500).json("query error")
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



router.post("/injury/create", (req, res) => {
    // Only allow admins to use this endpoint
    console.log(req.body)


    // req.body represents the form field data (json in body of fetch)
    let injury = req.body

    // Only allow valid emails

    // Hash the password before inserting into DB

    // Each of the following names reference the "name"
    // attribute in the inputs of the form.
    injuryModel.createInjury(
            injury.injury

     
        )
        .then((result) => {
            res.status(200).json("injury created " + result.injury)
            console.log(result.injury)
            

        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("query error - failed to create injury")
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



router.delete("/injury/delete", (req, res) => {
    // Access the user id from the body of the request
    let injury = req.body.injury

    // Ask the model to delete the user with userId
    injuryModel.deleteInjury(injury)
        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("injury deleted")
            } else {
                res.status(404).json("injury not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to delete injury - query error")
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






// Define an /api/users/update endpoint that updates an existing user
router.patch("/injury/update", (req, res) => {
    // the req.body represents the posted json data
    let file_name = req.body


    // If the string does NOT start with a $ then we need to hash it.
    // Existing passwords that do start with $ are already hashed

    // Each of the names below reference the "name" attribute in the form
    injuryModel.updateInjury(
            injury.injury)

        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("injury updated")
            } else {
                res.status(404).json("injury not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to update injuryy - query error")
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







module.exports = router