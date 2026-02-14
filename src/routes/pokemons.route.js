
import { trouverUnPokemon,
    listePokemon,
    creerPokemons,
    modifierPokemons,
    supprimerPokemons 
    } from '../controllers/pokemons.controller.js';

// Nous avons besoin d'importer le module express pour utiliser la classe Router
import express from 'express';
// Nous créons un objet router qui va nous permettre de gérer les routes
const router = express.Router();

router.get('/liste', listePokemon);
router.get('/:id', trouverUnPokemon);
router.post('/', creerPokemons);
router.put('/:id', modifierPokemons);
router.delete('/:id', supprimerPokemons);
export default router;