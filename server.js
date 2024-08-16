const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const articlesRouter = require('./routes/articles');

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect('mongodb+srv://abdelouahad165:64oPEKJDxnkZfiV9@cluster0.kvvhl4c.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Servir les fichiers statiques du dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

// Route API pour les articles
app.use('/api/articles', articlesRouter);

// Route pour servir le fichier HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
