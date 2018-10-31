// Required Modules
const express = require("express"); 
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true})); 

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
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
}); 

// Page to add URLs to Database
app.get("/urls/new",(req, res) => {
    res.render("urls_new");
});

// 
app.get("/urls/:id", (req, res) => {
    let templateVars = { shortURL:req.params.id };
    res.render("urls_show", templateVars);
}); 

//
app.get("/u/:shortURL", (req, res) => {
    res.redirect(longURL); 
});

//
app.get("/urls/:id", (req, res) => {
    let templateVars = {
        shortURL: req.params.id, 
        longURL: urlDatabase[req.params.id]
    };
    res.render("urls_show", templateVars);
});

// Generate random URL for user inputs
app.post("/urls", (req, res) => {
    console.log(req.body);
    const newID = generateRandomString(); 
    urlDatabase[newID] = req.body.longURL;
    console.log(urlDatabase);
    res.redirect("/urls/");
}); 

// Delete saved URLs
app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect("/urls/");
    console.log(req.body.longURL + " Deleted by User");
});

// Update edited URLs
app.post("/urls/:id", (req, res) => {
    urlDatabase[req.params.id] = req.body.editURL;
    res.redirect("/urls/");
    console.log("URL Edited by User");
});

// Console Startup alert
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});