const rateLimit = require('express-rate-limit')
const express = require("express")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const bcrypt = require ('bcrypt');


const expressAccessToken = require('express-access-token');



const server = express()

server.use(cookieParser());

///acess token 





const port = 1235
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

server.use(cookieParser())
// console.log(req.session.user.email)

// Enable session middleware so that we have state
server.use(session({
    secret: 'secret phrase abc123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
    } // Should be turned to true in production (HTTPS only)
}))


// exress rate limiiting *********************
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 12 hour duration in milliseconds
    max: 1000, // Limit each IP to 1000 requests per `window` (here, per 24 hours)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

server.use(limiter);

// Apply the rate limiting middleware to all requests

const speedLimiter = slowDown({
    windowMs: 1000, // 1 second 
    delayAfter: 1, // allow 1 request per 1 second
    delayMs: 500, // begin adding 500ms if delay per request above 1
    
    // request # 101 is delayed by 500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 15000ms
    // etc.
});

// apply to all request
server.use(speedLimiter);
// server.user(limiter)



// cors online help
server.use(cors({
    origin: 'http://localhost:3000',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

    credentials: true
}));



// express rate limiting end***************



// Setup our own access control middleware
// Must happen after JSON and session middleware but before static files
server.use((req, res, next) => {
    console.log(req.body)
   
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
// dallas start

server.use((req, res, next) => {
    console.log(`${req.method} - ${req.url},`);

    // the user is logged in if the have session data
    console.log(req.session)
    let userLoggedIn = req.session.user !=null
    console.log(1, userLoggedIn)
    //define a list of allowed urls for non-logged in users
    let allowedURLs = [
     "http://localhost:3000",
     "/api/users/login",
     "/api/users/create",
    //  "/api/users/logout",
    //  "/logout.html",
     
    ]



    let adminOnlyURLS = [
        "/IndexAdmin",
        "/SelectionAdmin",
        "/AdminUserCRUD"
     ]
    // if the user is logged in 
    if (userLoggedIn) {
        // let them through
        if (adminOnlyURLS.includes(req.originalUrl) && req.session.user.accessRights !== "admin") {
            console.log('heello 1')
            res.redirect("/login");
        } else {
            next()
        }
        
    } else {
        if (allowedURLs.includes(req.originalUrl)) {
            //allows the guest user through
            next()
        } else {
        res.redirect("http://localhost:3000")
            //if not allowed - reditect to the login page
            console.log('heello')

        }
    }  
        
})


// // dallas end

// server.use((req, res, next) => {
//     console.log(req.url, req.method)
//     const routes ={
//     'unathorised' : [
//             "/login",
//             "/logout",
//             "/api/users/logout",
//             "/api/login",
//             "/api/users/login",
//             "/api/users/create"
//     ],

//         'admin' : [
//             "/api/users/create",
//             "login",
//             "/api/users/logout",
//             "/api/users/login",
//             "/boostrap.min.css",
//             "/Contact-Form-Clean.css",
//             "/Login-Form-Clean.css",
//             "/Navigation-Clean.css",
//             "/Pretty-Registration-Form.css",
//             "/style.css",
//             "/style.scss",
//             "/LogoutAdmin",
//             "/NavbarAdmin",
//             "/ThemeAdmin",
//             "/SelectionAdmin",
//             "/ContentcontainerAdmin",
//             "/CreateAccountAdmin",
//             "/IndexAdmin",
//             "/FavoritesAdmin",
//             "/api/users",
//             "/api/users/update",
//             "/api/users/delete",
//             "/api/users/create",
//             "/api/sport",
//             "/api/sport/update",
//             "/api/sport/delete",
//             "/api/sport/create",
//             "/api/injury",
//             "/api/favorites/update",
//             "/api/injury/delete",
//             "/api/injury/:ID",
//             "/api/content",
//             "/api/content/create",
//             "/api/content/update",
//             "/api/content/delete",
//             "/api/body/",
//             "/api/body/create",
//             "/api/body/update",
//             "/api/body/delete"
//         ]
//     }
//     let user_status = "unathorised"
//     if (req.session.user) {
//         console.log(user_status, req.session.user.email,req.session.user.user_status )
//         user_status = req.session.user.user_status
//     }

//     // check if user role has routes defined for it
// if (user_status in routes) {
//     const allowed_routes = routes[user_status]

//     //check if the requested url is a defined route for this user role
//     if (allowed_routes.some(url => req.originalUrl.startsWith(url))) {
//         // allow request to go through
//         next()
//     } else {
//         // stop the request and respond with forbidden
//         res.status(403).json("access forbidden")
//     } 
//     } else {
//         // stop request and respond with not authenticated
//         res.status(401).json("server client not authenticated")
// }
// })


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

const BodyController = require("./backend/controllers/BodyController");
const { response } = require('express');
server.use("/api", BodyController)


// Start the express server
server.listen(port, () => {
    console.log("Backend listening on http://localhost:" + port)
})








// authentication end