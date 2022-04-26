const express = require("express")
// Create a router so that we can define API
// routes in this file.
const router = express.Router()
// Access the books model so that we can access
// book data in this file.
const bodyModel = require("../models/bodyModel")
const logModel = require("../models/logModel")



// Define an /api/books endpoint that responds with
// an array of all books.
router.get("/body", (req, res) => {
    bodyModel.getBodyPart()
        .then((results) => {
            res.status(200).json(results)
        })
        .catch((error) => {
            // Log any errors to the node console
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


// Define an /api/books/:id endpoint that responds with
// a specific book by id

// could be "/favorites/:content"

router.get("/body", (req, res) => {
    bodyModel.body(body)
        .then((results) => {
            if (results.length > 0) {
                res.status(200).json(results[0])
            } else {
                res.status(404).json("failed to get body part")
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



// Define an /api/users/update endpoint that updates an existing user
router.patch("/body/update", (req, res) => {
    // the req.body represents the posted json data
    let ID = req.body


    // If the string does NOT start with a $ then we need to hash it.
    // Existing passwords that do start with $ are already hashed

    // Each of the names below reference the "name" attribute in the form
    bodyModel.updateBodyPart(
            body.body)

        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("body updated")
            } else {
                res.status(404).json("body not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to update body - query error")
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




router.delete("/body/delete", (req, res) => {
    // Access the user id from the body of the request
    let body = req.body.body

    // Ask the model to delete the user with userId
    bodyModel.deleteBodyPart(body)
        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("body part deleted")
            } else {
                res.status(404).json("body part not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to delete favorites - query error")
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




router.post("/body/create", (req, res) => {
    // Only allow admins to use this endpoint


    // req.body represents the form field data (json in body of fetch)
    let body = req.body

    // Only allow valid emails

    // Hash the password before inserting into DB

    // Each of the following names reference the "name"
    // attribute in the inputs of the form.
    bodyModel.createBodyPart(
            body.body

            // We now store the hashed version of the password
        )
        .then((result) => {
            res.status(200).json("body part created " + result.body)

        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("query error - failed to create body part")
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