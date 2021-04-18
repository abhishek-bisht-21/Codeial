
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const urlencoded = require("express");
const env = require("./config/environment");
const logger = require('morgan');
require('./config/view-helpers')(app);
const rfs = require('rotating-file-stream')
const path = require("path");

// Used For Session Cookie. We need to require passport and local strategy, to make session cookie work
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

// Using Persistent storage to keep those cookies in server. We wont get logout every time we restart the server.
// This requires an argument which is express-session which is there. Cause we want to store session info to the database.
const MongoStore = require("connect-mongo")(session);

// SCSS
const sassMiddleware = require("node-sass-middleware");

// For Flash Messages
const Flash = require("connect-flash");
const customMware = require("./config/middleware");
const dirname = require("path");

// Setup the chat Server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat Server is Listening on Port 5000");


// Sass middleware now runs only when environment is development.
if (env.name == "development") {
  // Settings required for SCSS
  app.use(
    sassMiddleware({
      src: path.join(__dirname , env.asset_path, "scss"), //From Where do I pick up my SCSS files to convert into CSS
      dest: path.join(__dirname , env.asset_path, "css"), //Where we need to store the converted files
      debug: true, //When some error occurs in compilation do I want to console it in the terminal
      outputStyle: "extended", // Do I want everything to be in a single line or do I want it to be in multiple lines
      prefix: "/css", // Where should my server look out for these CSS files
    })
  );
}

// Reading through the post request
app.use(express.urlencoded());

// We got to tell the app to use this cookie-parser
app.use(cookieParser());

app.use(express.static(__dirname + '/' +env.asset_path));

// Make the uploads path available to the browser.
app.use("/uploads", express.static(__dirname + "/uploads"));

// For Logging
app.use(logger(env.morgan.mode, env.morgan.options))

// We need to put it before our routes. Because in those routes those views are
// going to rendered which are going to follow this particular layout, so that we need to tell that views which are going to be rendered

app.use(expressLayouts);

// Extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//Setting up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// MongoStore is used to the session cookie in the DB.
//  This middleware takes in the session cookie and encryptes it.
app.use(
  session({
    name: "codeil", //name of the cookie
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key, //Key to encode and decode it.
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Setting up current user's Usage. Whenever the app is getting initialised, passport is also getting initialised
// And the below function is called. The below function will check whether the session cookie is present or not.
// Below function gets called as a middleware. So whenever any request comes in this middleware gets called and user will be set
// in the locals. And the user will be accessible in Views.
app.use(passport.setAuthenticatedUser);

app.use(Flash());
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`); //Interpolation
  }

  console.log(`Server is running on port :${port}`);
});

