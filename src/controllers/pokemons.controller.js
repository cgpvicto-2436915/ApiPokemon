import pokemonModel from "../models/pokemons.model.js";

export const trouverUnPokemon = async (req, res) => {

    // Teste si le paramètre id est présent et valide
    if(!req.params.id || parseInt(req.params.id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du pokemon est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    try {
        
        const pokemon = await pokemonModel.getPokemon(req.params.id);

        // On retourne un message d'erreur avec le code 404 si aucun professeur n'a été trouvé
        // ** à faire en exercice **
        if(!pokemon)
        {
            res.status(404).send({erreur: "Echec lors de la récupération du pokemon avec l'id "+req.params.id});
        }
        // OK 
        res.send(pokemon);

    } catch (erreur) {
        // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car 
        //  c'est du serveur que provient l'erreur.
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération du pokemon avec l'id " + req.params.id
        });
    };
};
export const listePokemon = async (req, res) => {
    let page = parseInt(req.query.page) ?? 1;
    let limit = 25;
    let type = req.query.type ?? null;
    try {
        
        const pokemons = await pokemonModel.listeToutePokemons(type);
        
        const nombrePokemon = pokemons.length;
        const debut = (page - 1) * limit;
        const fin = page * limit;
        const totalPage = Math.ceil(nombrePokemon/25);
        const pokemonsPage = pokemons.slice(debut, fin);
        // OK 
        res.json(
            {
                "pokemons": pokemonsPage,
                "type":type,
                "nombrePokemonTotal" : nombrePokemon,
                "page": page,
                "totalPage": totalPage
            });

    } catch (erreur) {
        // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car 
        //  c'est du serveur que provient l'erreur.
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            erreur: "Echec lors de la récupération de la liste des pokemons"
        });
    };
};
export const creerPokemons = async (req,res) => {
    const nom = req.body.nom;
    const type_primaire = req.body.type_primaire;
    const type_secondaire = req.body.type_secondaire;
    const pv = parseInt(req.body.pv) ?? null;
    const attaque = parseInt(req.body.attaque)??null;
    const defense = parseInt(req.body.defense)??null;
    const champsManquants = [];
    if(!nom)
        champsManquants.push("nom");
    
    if(!type_primaire)
        champsManquants.push("type_primaire");

    if(!type_secondaire)
        champsManquants.push("type_secondaire");

    if(!pv)
        champsManquants.push("pv");

    if(!attaque)
        champsManquants.push("attaque");

    if(!defense)
        champsManquants.push("defense");


    if(!nom || !type_primaire||!type_secondaire||!pv||!attaque||!defense){
        const reponse =
        {
        "erreur":"Le format des données est invalide",
        "champs_manquants": champsManquants
        };
        return res.status(400).json(reponse);
    }
    try{

        const id = await pokemonModel.creerPokemonsbd(nom,type_primaire,type_secondaire,pv,attaque,defense);
        const reponse = {
            "message" : "Le pokemon "+ nom +" a été ajouté avec succès",
            "pokemon" : {
            "id": id, 
            "nom":nom,
            "type_primaire":type_primaire,
            "type_secondaire":type_secondaire,
            "pv":pv,
            "attaque":attaque,
            "defense":defense
            }
        };
        res.status(201).json(reponse);
    }
    catch (erreur){

        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Echec lors de la création du pokemon "+ nom
        });
    }
};
export const modifierPokemons = async (req,res) => {
    const id  = parseInt(req.params.id)??null;
    const nom = req.body.nom;
    const type_primaire = req.body.type_primaire;
    const type_secondaire = req.body.type_secondaire;
    const pv = parseInt(req.body.pv) ?? null;
    const attaque = parseInt(req.body.attaque)??null;
    const defense = parseInt(req.body.defense)??null;
    const champsManquants = [];
    if(!id || id<=0)
        champsManquants.push("id");
    
    if(!nom)
        champsManquants.push("nom");
    
    if(!type_primaire)
        champsManquants.push("type_primaire");

    if(!type_secondaire)
        champsManquants.push("type_secondaire");

    if(!pv)
        champsManquants.push("pv");

    if(!attaque)
        champsManquants.push("attaque");

    if(!defense)
        champsManquants.push("defense");


    if(!id||!nom || !type_primaire||!type_secondaire||!pv||!attaque||!defense){
        const reponse =
        {
        "erreur":"Le format des données est invalide",
        "champs_manquants": champsManquants
        };
        return res.status(400).json(reponse);
    }
    
    try{
        const valide = await pokemonModel.validerExistance(id); 
        console.log(valide);
        if(!valide)
        {
            const reponse = {
                "erreur":"Le pokemon "+ id +" n'existe pas dans la base de données"
            };
            return res.status(404).json(reponse);
        }
        await pokemonModel.modifierPokemonsbd(id,nom,type_primaire,type_secondaire,pv,attaque,defense);
        const reponse = {
            "message" : "Le pokemon id " + id + " a été modifié avec succès"
        };
        res.status(200).json(reponse);
    }
    catch (erreur){

        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Echec lors de la modification du pokemon "+ nom
        });
    }
};
export const supprimerPokemons = async (req,res) => {
    const id = req.params.id;

    try{
        const valide = await pokemonModel.validerExistance(id); 
        if(!valide)
        {
            const reponse = {
                "erreur":"Le pokemon "+ id +" n'existe pas dans la base de données"
            };
            return res.status(404).json(reponse);
        }
        await pokemonModel.supprimerPokemonsbd(id);
        const reponse = {
            "message" : "Le pokemon " + id + " a été supprimé avec succès"
        };
        res.status(200).json(reponse);
    }
    catch (erreur){

        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Echec lors de la suppression du pokemon "+ id
        });
    }
};