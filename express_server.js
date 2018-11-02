// Required Modules
const express = require("express"); 
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true})); 
app.use(cookieParser()) 

app.set("view engine", "ejs");

// URL String generator
function generateRandomString() {
    let ranString = Math.random().toString(36).substring(7)
    console.log(ranString); 
    return ranString;
}

// URL Database
const urlDatabase = {
    "b2xVnZ": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
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

//
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//
app.get("/", (req, res) => {
    res.send("Hello!");
});

//
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
}); 

//
app.get("/urls", (req, res) => {
    let user = {}; 
    if (req.cookies ["user_id"]) {
        id = req.cookies["user_id"]
        user = users[id];
    }
    let templateVars = { urls: urlDatabase, user }; 
    res.render("urls_index", templateVars);
}); 

// Page to add URLs to Database
app.get("/urls/new",(req, res) => {
    if (req.cookies["user_id"]) {
        id = req.cookies["user_id"]
        user = users[id];
        let templateVars = { urls: urlDatabase, user };
    } else {
        res.redirect("/login")
    }
    res.render("urls_new", templateVars);
});

// 
app.get("/urls/:id", (req, res) => {
    let templateVars = { shortURL: req.params.id, longURL: urlDatabase, id: req.cookies["user_id"] };
    res.render("urls_show", templateVars);
}); 

// Update URLs
app.get("/u/:shortURL", (req, res) => {
    let shortURL = req.params.shorURL;
    let longURL = urlDatabase[shortURL]; 
    res.redirect(longURL); 
});

// Direct to User Registration
app.get("/signup", (req, res) => {
    console.log("Attempting to register new user")
    res.render("urls_registration");
});



// New User gets added to Database
app.post("/url/register", (req, res) => {
    const id = generateRandomString();
    const email = req.body.email;
    const password = req.body.password; 
    let match = false;
    for (user in users) {
        if (users[user].email === email) {
            match = true;
        }
    } 
    if (!email || !password || match === true) {
        res.status(400).send("ERROR: Email entered is already used or field left blank");
    }
    console.log(users);
    users[id] = {id, email, password};
    res.redirect("/urls"); 
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password; 
    let match = {};
    let cookieIs = '';
    if (!email || !password ) {
        res.status(400).send("ERROR: Field missing")
    }
    for (user in users){
        if (users[user].email === email) {
            match = user;
        } else {
            res.status(400).send("ERROR: User Not Found")
        }
    } if (users[match].password === password) {
        cookieIs = users[match].id
    }
    res.cookie("user_id", cookieIs);
    res.redirect("/urls");
});

// Generate random URL for user inputs
app.post("/urls_index", (req, res) => {
    console.log(req.body);
    const newID = generateRandomString(); 
    urlDatabase[newID] = req.body.longURL;
    console.log(urlDatabase);
    res.redirect("/urls/");
}); 

// Delete saved URLs
app.post("/urls/:id/delete", (req, res) => {
    console.log(urlDatabase[req.params.id] + " deleted by User");
    delete urlDatabase[req.params.id];
    res.redirect("/urls/");
});

// Update edited URLs
app.post("/urls/:id", (req, res) => {
    console.log(urlDatabase[req.params.id] + " edited by User");
    urlDatabase[req.params.id] = req.body.editURL;
    res.redirect("/urls/");
});

app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/urls");
});

// app.post("")

// Console Startup alert
app.listen(PORT, () => {
    console.log(`TinyApp is running on port ${PORT}!`);
});