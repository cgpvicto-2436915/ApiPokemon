import express from 'express';
import dotenv from 'dotenv';
import pokemonsRouter from './src/routes/pokemons.route.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use('/api/pokemons',pokemonsRouter);
app.use('/api/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, swaggerOptions));

app.get('/api', (req, res) => {
    res.send("<h1>Mon premier serveur web sur express !</h1>");
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
