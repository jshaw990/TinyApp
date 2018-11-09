// Required Modules/Middleware
const express = require("express"); 
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require ("bcrypt"); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(cookieSession ({
    name: 'session',
    keys: ["secret1", "secret2", "secret3"],
    maxAge: 24 * 600 * 60 * 1000
})); 


app.set("view engine", "ejs");

// URL String generator
function generateRandomString() {
    let ranString = Math.random().toString(36).substring(7)
    console.log(ranString); 
    return ranString;
}

// Users URL Database
function usersURL (user_id) {
    let filter = {};
    for (let url in urlDatabase) {
        let shortURL = urlDatabase[url].shortURL;
        if (urlDatabase[url].userID === user_id) {
            filter[shortURL]= urlDatabase[url];
        }
    }
    return filter;
}

// URL Database
const urlDatabase = {
    "b2xVnZ": { 
        id: "userRandomID", 
        shortURL: "b2xVnZ", 
        longURL: "http://www.lighthouselabs.ca"
    },
    "9sm5xK": { 
        id: "user2RandomID",
        shortURL: "9sm5xK",
        longURL: "http://www.google.com"
    }
};

// User Database
const users = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
    }
}

// Hello Message
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Main Page
app.get("/", (req, res) => {
    if (req.session.userID) {
        res.redirect("/urls");
    } else {
        res.redirect("/login");
    }
});

//
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
}); 

// URLs
app.get("/urls", (req, res) => {
    if (req.session.userID) {
        let filterDB = usersURL(req.session.userID);
        let templateVars = {
            usersDB: users, 
            urls: filterDB,
            userID: req.session.userID,
            email: users[req.session.userID].email
        };
        res.status(200);
        res.render("urls_index", templateVars);
    } else {
        res.status(400).send("ERROR: You must be logged in to access the Database.");
    }
}); 

// Page to add URLs to Database
app.get("/urls_new",(req, res) => {
    id = req.session.user_id;
    user = users; 
    let templatevars= { urls: urlDatabase, user: users, userID: req.session.userID, email: app.locals.email };
    res.render("urls_new", templatevars);
});

// Short URL (ID)
app.get("/urls/:id", (req, res) => {
    const usersData = usersURL(req.session.userID);
    if (!urlDatabase[req.params.id]) {
        res.status(400).send("ERROR: URL Invalid");
    } else if (!req.session.userID) {
        res.status(400).send("ERROR: URL Invalid");
    } else if (req.session.userID !== urlDatabase[req.params.id].userID) {
        res.status(400).send("ERROR: You must be logged in to access URLs");
    } else {
        let templateVars = {
            usersDB: users,
            urls: usersData,
            shortUrl: req.params.id,
            userID: req.session.userID,
            email: users[req.session.userID].email
        };
        res.render("urls_show", templateVars);
    }
}); 

// Direct to User Registration
app.get("/urls_registration", (req, res) => {
    if (req.session.userID) {
        res.redirect("/urls_login");
    } else { 
        res.render('urls_registration', {userID: null})
    };
});

// Login Page
app.get("/login", (req, res) => {
    if (req.session.userID) {
        res.redirect("/");
    } else { 
        res.render("urls_login", { 
            userID: req.session.userID, 
            email: users[req.session.userID].email
        });
    }
});

// New User gets added to Database
app.post("/url/register", (req, res)=> {
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10); 
    for (user in users) {
    if (email == "" || password == "") {
        console.log("ERROR: One or more fields are invalid");
        // alert();
        res.status(400).send("ERROR: One or more fields are invalid");
        return false;
    }
    if (users[user].email == email) {
        console.log("ERROR: Email already registered");
        res.status(400).send("ERROR: Email already registered. Please login to access your account.");
        return false;
    }}
    const id = generateRandomString();
    users[id] = {id, email, password};
    console.log(users); 
    req.session.userID = id; 
    res.redirect("/urls");
});

// Generate random URL for user inputs
app.post("/urls_new", (req, res) => {
    if (req.session.userID) {
        let ranString = generateRandomString();
        urlDatabase[ranString] = {
            userID: req.session.userID,
            shortURL: ranString,
            longURL: req.body.longURL
        };
        const filterDB = usersURL(req.session.userID);
        res.redirect("/urls");
    } else {
        res.status(400).send("ERROR: You must be logged in to access the URL Database.");
    }
}); 

// Delete saved URLs
app.post("/urls/:id/delete", (req, res) => {
    if (req.session.userID) { 
        delete urlDatabase[req.params.id];
        console.log(urlDatabase);
        res.redirect("/urls");
    } else { 
        res.status(400).send("ERROR: You must be logged in to access the URL Database.")
    }
});

// Update edited URLs
app.post("/urls/:shortURL/", (req, res) => {
    const tinyURL = req.params.shortURL;
    if (!urlDatabase[tinyURL]) {
        res.status(400).send("ERROR: URL is invalid.");
    } else if (!req.session.userID) {
        res.status(400).send("ERROR: You must be logged in to access the URL Database.");
    } else if (req.session.userID !== urlDatabase[tinyURL].userID) {
        res.status(400).send("Only a URL owner can edit the Database.");
    } else { 
        urlDatabase[tinyURL].longURL = req.body.longURL;
        const filterDB = usersURL(req.session.userID);
        let templateVars = {
            usersDB: users,
            urls: filterDB,
            userID: req.session.userID,
            email: users[req.session.userID].email
        }
        res.render("urls_index", templateVars);
    }
});

// User sign in
app.post("/login", (req, res) => {
    const email = req.body.email;
    const passw0rd = req.body.password; 
    let pair;
    if (!email || !passw0rd) {
        res.status(400).send("ERROR: Missing Field");
        return false;
    }
    for (user in users) {
        console.log('user', users[user].email == email)
        if (users[user].email == email) {
            pair = user;
        }
        if (users[pair] && bcrypt.compareSync(passw0rd, users[user].password)) {
            req.session.userID = users[user].id;
            res.redirect("/urls");
            console.log(email + " has signed in");
            console.log(req.session.userID);
            return;
        }
    }
    if (!pair) {
        return res.status(400).send("ERROR: Email/Password matches nothing on record.");;
    }
    res.redirect("/urls");
});

// Logout
app.post("/logout", (req, res) => {
    req.session = null;
    app.locals.email = "";
    res.redirect("/");
});

// Console Startup alert
app.listen(PORT, () => {
    console.log(`TinyApp is running on port ${PORT}!`);
});