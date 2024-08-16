const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    ref: String,
    frs: String,
    article: String,
    prix: Number,
    promotion: Number,
    stock: Number,
    srcImg: String
});

module.exports = mongoose.model('Article', articleSchema);
