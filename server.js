// https://www.sciencedaily.com/news/computers_math/robotics/

const express = require("express");
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');
const logger = require("morgan");

//website scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

//Require the models for data transfer to mongo
const db = require("./models");

//specify local port 
const PORT = 3010;

// Initialize Express
const app = express();

//TODO https://www.npmjs.com/package/express-handlebars
// TODO app.engine('handlebars', exphbs());
// TODO app.set('view engine', 'handlebars');

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public folder static 
app.use(express.static("public"));

// Connect to the Mongo DB
//TODO - instructions ssay to call const and not use useNewUrlParser code
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//temp code to see what's not working with create fuction
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

//EXPRESS ROUTES---------------------------------------------------------
//----Scrape websites and insert into mongo DB----
app.get("/scrape", function (req, res) {
    axios.get("https://www.sciencedaily.com/news/matter_energy/nanotechnology/").then(function (response) {
        const $ = cheerio.load(response.data)
        for (let i = 1; i < 11; i++) {
            $(`#featured_tab_${i}`).each(function (i, element) {   //"#tab-pane h3"
                //grab title, summary and link and add to empty result object
                const result = {}
                result.title = $(this)
                    .children("h3")
                    .text();
                result.summary = $(this)
                    .children(".latest-summary")
                    .text();
                result.url = "https://www.sciencedaily.com" + $(this)
                    .children(".latest-summary")
                    .children(".more")
                    .children("a")
                    .attr("href");
                //TODO check if title already exists in database

                db.Article.findOneAndUpdate({ title: result.title }, result, { upsert: true, new: true, runValidators: true })
                    .catch(function (err) {
                        console.log(err)
                    });
                //TODO this code works to create new 
                // db.Article.create(result)
                //     .then(function (dbArticle) {
                //     })
                //     .catch(function (err) {
                //         console.log(err)
                //     });
            });
        }
        res.send("Scrape complete")
    });
});

//----Retrieve scraped articles from DB----
app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle)
        }).catch(function (err) {
            res.json(err)
        })
});

//----Take user entered note and update related article with it----
app.get("/articles/:id", function (req, res) {
    db.Article.findById(req.params.id)
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle)
        }).catch(function (err) {
            res.json(err)
        });
});

//----Save user entered note with associated article id----
app.post("/articles/:id", function (req, res) {
    db.Article.create(req.body)
        .then(function (dbNote) {
            const articleId = req.params.id
            return db.Article.findByIdAndUpdate(articleId, { $set: { note: dbNote.id } }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});