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
    let templateVars = { urls: urlDatabase,
    username: req.cookies["username"]
    };
    res.render("urls_index", templateVars);
}); 

// Page to add URLs to Database
app.get("/urls/new",(req, res) => {
    let templateVars = { 
        username: req.cookies["username"]
    }; 
    res.render("urls_new", templateVars);
});

// 
app.get("/urls/:id", (req, res) => {
    let templateVars = { shortURL:req.params.id,  
    username: req.cookies["username"]
    };
    res.render("urls_show", templateVars);
}); 

//
app.get("/u/:shortURL", (req, res) => {
    res.redirect(longURL); 
});

// Update URLs
app.get("/urls/:id", (req, res) => {
    let templateVars = {
        shortURL: req.params.id, 
        longURL: urlDatabase[req.params.id]
    };
    res.render("urls_show", templateVars);
});

// Direct to User Registration
app.get("/urls_registration", (req, res) => {
    console.log("Attempting to register new user")
    res.render("urls_registration");
});

// New User gets added to Database
app.post("/url/register", (req, res)=> {
    const id = generateRandomString();
    const email = req.body.email;
    const password = req.body.password; 
    users[id] = {id, email, password};
    console.log(users); 
    res.redirect("/urls/");
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

// User sign in
app.post("/login", (req, res) => {
    res.cookie("username",req.body.username);
    res.redirect("/urls/");
});

app.post("/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect("/urls/");
});

// app.post("")

// Console Startup alert
app.listen(PORT, () => {
    console.log(`TinyApp is running on port ${PORT}!`);
});