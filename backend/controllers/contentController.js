const express = require("express")
// Create a router so that we can define API
// routes in this file.
const router = express.Router()
// Access the books model so that we can access
// book data in this file.
const contentModel = require("../models/contentModel")
const logModel = require("../models/logModel")


// Define an /api/books endpoint that responds with
// an array of all books.
router.get("/content", (req, res) => {
    contentModel.getAllContent()
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
router.get("/content/:injury", (req, res) => {
    contentModel.getContentByInjury(injury)
        .then((results) => {
            if (results.length > 0) {
                res.status(200).json(results[0])
            } else {
                res.status(404).json("failed to content from injury")
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



router.post("/content/create", (req, res) => {
    // Only allow admins to use this endpoint


    // req.body represents the form field data (json in body of fetch)
    let content = req.body

    // Only allow valid emails

    // Hash the password before inserting into DB

    // Each of the following names reference the "name"
    // attribute in the inputs of the form.
    contentModel.createContent(
            content.file_name

            // We now store the hashed version of the password
        )
        .then((result) => {
            res.status(200).json("content created with injury " + result.file_name)

        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("query error - failed to post content")
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
router.patch("/content/update", (req, res) => {
    // the req.body represents the posted json data
    let file_name = req.body


    // If the string does NOT start with a $ then we need to hash it.
    // Existing passwords that do start with $ are already hashed

    // Each of the names below reference the "name" attribute in the form
    contentModel.updateContent(
            user.file_name)

        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("content updated")
            } else {
                res.status(404).json("content not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to update content - query error")
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


router.delete("/content/delete", (req, res) => {
    // Access the user id from the body of the request
    let file_name = req.body.file_name

    // Ask the model to delete the user with userId
    contentModel.deleteContent(file_name)
        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("content deleted")
            } else {
                res.status(404).json("content not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to delete content - query error")
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