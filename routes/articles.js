const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// GET all articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new article
router.post('/', async (req, res) => {
    const article = new Article({
        ref: req.body.ref,
        frs: req.body.frs,
        article: req.body.article,
        prix: req.body.prix,
        promotion: req.body.promotion,
        stock: req.body.stock,
        srcImg: req.body.srcImg
    });

    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT to update an article
router.put('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.ref = req.body.ref;
        article.frs = req.body.frs;
        article.article = req.body.article;
        article.prix = req.body.prix;
        article.promotion = req.body.promotion;
        article.stock = req.body.stock;
        article.srcImg = req.body.srcImg;

        const updatedArticle = await article.save();
        res.json(updatedArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE an article
router.delete('/:id', async (req, res) => {
    try {
        const articleId = req.params.id;
        console.log(`Attempting to delete article with ID: ${articleId}`);

        const result = await Article.findByIdAndDelete(articleId);
        if (!result) {
            console.error(`Article with ID: ${articleId} not found`);
            return res.status(404).json({ message: 'Article not found' });
        }

        console.log(`Article with ID: ${articleId} deleted successfully`);
        res.json({ message: 'Article deleted successfully' });
    } catch (err) {
        console.error('Error deleting article:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
