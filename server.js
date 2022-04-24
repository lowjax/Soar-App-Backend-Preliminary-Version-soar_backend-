const rateLimit = require('express-rate-limit')
const express = require("express")
const session = require("express-session")

const server = express()
const port = 1234
//importing express session to declare the variables
// const rateLimit = require('express-rate-limit')
const slowDown = require("express-slow-down");
const cors = require('cors')
const logModel = require("./backend/models/logModel")

// Enable middleware for JSON and urlencoded form data
server.use(express.json())
server.use(express.urlencoded({
    extended: true
}))

// console.log(req.session.user.email)

// Enable session middleware so that we have state
server.use(session({
    secret: 'secret phrase abc123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    } // Should be turned to true in production (HTTPS only)
}))



// exress rate limiiting *********************
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 12 hour duration in milliseconds
    max: 1000, // Limit each IP to 1000 requests per `window` (here, per 24 hours)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
const speedLimiter = slowDown({
    windowMs: 1000,
    delayAfter: 1,
    delayMs: 500,
});

// apply to all request
server.use(speedLimiter, limiter);
// server.user(limiter)

const corsOptions = {
    origin: 'localhost',
    optionsSuccessStatus: 200 // some legacy browser (IE11, various smartTvs) choke on 204
}
server.use(cors(corsOptions))

server.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
})



// app.use(speedLimiter);
// app.use(limiter, speedLimiter) //???


// express rate limiting end***************



// Setup our own access control middleware
// Must happen after JSON and session middleware but before static files
server.use((req, res, next) => {
    console.log(req.body)
    // console.log(req.ip)
    // console.log(new Date())
    // console.log(req.method)
    // // console.log(req.session.user.email)
    // // console.log(req.session.user.user_status)
    // console.log(req.session.user)
    // if (
    //     req.session.user
    // ){
    //     console.log(req.session.user.email)
    //     console.log(req.session.user.user_status)
    // }
    // The user is logged in if they have session data
    let userLoggedIn = req.session.user != null
    next()
    // URLs we will allow for non logged in clients (guests)
    // let guestAllowedURLs = [
    //     "/login.html",
    //     "/js/login.js",
    //     "/css/style.css",
    //     "/api/users/login",
    // ]

    // if (userLoggedIn) {
    //     // Allow the request through
    //     next()
    // } else {
    //     // Check that the guest page is only
    //     // asking for an allowed resource
    //     if (guestAllowedURLs.includes(req.originalUrl)) {
    //         // Allow the guest user through
    //         next()
    //     } else {
    //         // Redirect them to the login page
    //         res.redirect("/login.html")
    //     }
    // }
})

// Serve static frontend resources
server.use(express.static("frontend"))


// Link up the user controller
const userController = require("./backend/controllers/userController")
server.use("/api", userController)

const contentController = require("./backend/controllers/contentController")
server.use("/api", contentController)

const injuryController = require("./backend/controllers/injuryController")
server.use("/api", injuryController)

const sportController = require("./backend/controllers/sportController")
server.use("/api", sportController)

const favoritesController = require("./backend/controllers/favoritesController")
server.use("/api", favoritesController)

// const logController = require("./backend/controllers/logController")
// server.use("/api", logController)

const BodyController = require("./backend/controllers/BodyController")
server.use("/api", BodyController)


// Start the express server
server.listen(port, () => {
    console.log("Backend listening on http://localhost:" + port)
})