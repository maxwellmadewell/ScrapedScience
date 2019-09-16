const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  // String title is the article's title 
  title: {
    type: String,
    required: true
  },
  // String summary is a long description of the article 
  summary: {
    type: String,
    required: true
  },
  // String link is the URL of the article
  url: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Custom Methods, if needed

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;


