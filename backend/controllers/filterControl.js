const express = require("express")
const bcryptjs = require("bcryptjs")
const validator = require("validator")


const router = express.Router()

const userModel = require("../models/userModel")
const logModel = require("../models/logModel")
const { request } = require("express")
const session = require("express-session")

// could be "/favorites/:content"
router.get("/injury/:sport", (req, res) => {
    // injuryModel.getInjury(injury)
    injuryModel.filterExecution(req.params.sport)
        .then((results) => {
            if (results.length > 0) {
                res.status(200).json(results[0])
            } else {
                res.status(404).json("failed to get execute filters")
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
