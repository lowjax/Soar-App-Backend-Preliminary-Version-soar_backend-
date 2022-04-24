const express = require("express")
// Create a router so that we can define API
// routes in this file.
const router = express.Router()
// Access the books model so that we can access
// book data in this file.
const favoritesModel = require("../models/favoritesModel")

const logModel = require("../models/logModel")



// Define an /api/books endpoint that responds with
// an array of all books.
router.get("/favorites", (req, res) => {
    favoritesModel.getAllFavorites()
        .then((results) => {
            res.status(200).json(results)
        })
        .catch((error) => {
            // Log any errors to the node console
            console.log(error)
            res.status(500).json("query error")
        })
        const userLoggedIn = req.session.user = !null
        if (userLoggedIn == true)  {
        logModel.createLog(
            req.ip,
            req.session,
            req.session.user.email,
            req.session.user.user_status,
            (new Date().toISOString()),
            req.method,

        )
    } else {
        res.redirect('/login')
        res.alert("you must sign in")
    }
})


// Define an /api/books/:id endpoint that responds with
// a specific book by id

// could be "/favorites/:content"
router.get("/favorites/:ID", (req, res) => {
    favoritesModel.getFavoritesById(ID)
        .then((results) => {
            if (results.length > 0) {
                res.status(200).json(results[0])
            } else {
                res.status(404).json("failed to get favorites from content")
            }
        })
        .catch((error) => {
            // Log sql errors to node console
            console.log(error)
            res.status(500).json("query error")
        })

        const userLoggedIn = req.session.user = !null
        if (userLoggedIn == true)  {
        logModel.createLog(
            req.ip,
            req.session,
            req.session.user.email,
            req.session.user.user_status,
            (new Date().toISOString()),
            req.method,

        )
    } else {
        res.redirect('/login')
        res.alert("you must sign in")
    }


})




// Define an /api/users/update endpoint that updates an existing user
router.post("/favorites/update", (req, res) => {
    // the req.body represents the posted json data
    let ID = req.body


    // If the string does NOT start with a $ then we need to hash it.
    // Existing passwords that do start with $ are already hashed

    // Each of the names below reference the "name" attribute in the form
    favoritesModel.updateFavorites(
            favorites.ID)

        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("favorites updated")
            } else {
                res.status(404).json("favroites not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to update favorites - query error")
        })

        const userLoggedIn = req.session.user = !null
        if (userLoggedIn == true)  {
        logModel.createLog(
            req.ip,
            req.session,
            req.session.user.email,
            req.session.user.user_status,
            (new Date().toISOString()),
            req.method,

        )
    } else {
        res.redirect('/login')
        res.alert("you must sign in")
    }
})


router.post("/favorites/delete", (req, res) => {
    // Access the user id from the body of the request
    let ID = req.body.ID

    // Ask the model to delete the user with userId
    favoritesModel.deleteFavorites(ID)
        .then((result) => {
            if (result.affectedRows > 0) {
                res.status(200).json("content favorites")
            } else {
                res.status(404).json("favorites not found")
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json("failed to delete favorites - query error")
        })
        const userLoggedIn = req.session.user = !null
        if (userLoggedIn == true)  {
        logModel.createLog(
            req.ip,
            req.session,
            req.session.user.email,
            req.session.user.user_status,
            (new Date().toISOString()),
            req.method,

        )
    } else {
        res.redirect('/login')
        res.alert("you must sign in")
    }
})








module.exports = router