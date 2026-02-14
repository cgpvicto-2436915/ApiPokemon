import { parse } from 'dotenv';
import pool from '../config/db.js';

const getPokemon = async (id) => {

    const requete = `SELECT nom,type_primaire,type_secondaire,pv,attaque,defense FROM pokemon WHERE id = ? LIMIT 1`;
    const params = [id];

    try {

        const [resultats] = await pool.query(requete, params);
        return resultats[0] ?? null;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
};
const listeToutePokemons = async(type) =>{
        if(type){
            var requete = `SELECT nom,type_primaire,type_secondaire,pv,attaque,defense FROM pokemon WHERE type_primaire = ? ORDER BY nom`;
            var params = [type];            
        } else{
            var requete = `SELECT nom,type_primaire,type_secondaire,pv,attaque,defense FROM pokemon ORDER BY nom`;
        }  


    try {
        if(type){
            var [resultats] = await pool.query(requete, params);
        }else{
            var [resultats] = await pool.query(requete);            
        }

        return resultats ?? null;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
};
const creerPokemonsbd = async(nom,type_primaire,type_secondaire,pv,attaque,defense) =>{
    const requete = `INSERT INTO pokemon(nom,type_primaire,type_secondaire,pv,attaque,defense) VALUE (?,?,?,?,?,?)`;
    const param = [nom,type_primaire,type_secondaire,pv,attaque,defense];
    try {
        const [resultats] = await pool.execute(requete,param);

        return resultats.insertId ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
}
const modifierPokemonsbd = async(id,nom,type_primaire,type_secondaire,pv,attaque,defense) =>{
    const requete = `UPDATE pokemon SET nom=?, type_primaire=?,type_secondaire=?,pv=?,attaque=?,defense=? WHERE id=?`;
    const param = [nom,type_primaire,type_secondaire,pv,attaque,defense,id];
    try {
        const [resultats] = await pool.execute(requete,param);

        return resultats.insertId ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
}
const supprimerPokemonsbd = async(id) =>{

    const requete = `DELETE FROM pokemon WHERE id = ?`;
    const param = [id];
    try {
        const [resultats] = await pool.execute(requete,param);

        return resultats ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
}
const validerExistance = async(id) =>{
    if(!parseInt(id))
    {
        return null;
    }    
    const requete = `SELECT nom FROM pokemon WHERE id = ?`;
    const params = [id];

    try {

        const [resultats] = await pool.query(requete, params);
        return resultats[0] ?? null;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
}
export default {
    getPokemon,
    listeToutePokemons,
    creerPokemonsbd,
    modifierPokemonsbd,
    supprimerPokemonsbd,
    validerExistance
}