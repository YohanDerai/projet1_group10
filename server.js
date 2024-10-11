const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware pour traiter les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// Configurer la connexion à MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Utilise ton nom d'utilisateur MySQL
    password: "4678", // Ajoute mot de passe MySQL 
    database: "inscription_db", // Crée cette base de données dans MySQL
});

// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err);
        return;
    }
    console.log("Connecté à la base de données MySQL");
});


const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// Route pour gérer la soumission du formulaire
app.post("/inscription", [
    // Validation des données
    body("email").isEmail().withMessage('Email non valide'),
    body("password").isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nom, prenom, tel, naissance, email, password } = req.body;

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Requête SQL pour insérer les données dans la base de données
    const query = "INSERT INTO people (nom, prenom, tel, naissance, email, password) VALUES (?, ?, ?, ?, ?, ?);";

    db.query(query, [nom, prenom, tel, naissance, email, hashedPassword], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'insertion des données :", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        console.log("Utilisateur inscrit avec succès");
        res.send("Inscription réussie !");
    });
});

// route pour la connexion d'un utilisateur

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const query = "SELECT * FROM people WHERE email = ?";

    db.query(query, [email], async (err, result) => {
        if (err || result.length === 0) {
            return res.status(400).send("Email incorrect");
            
        };

        const user = result[0];

        // Comparer le mot de passe avec celui stocké dans la base de données
        const isMatch = await bcrypt.compare(password, user.password);
     
        if (!isMatch) {
            return res.status(400).send("Mot de passe incorrect");
        }

        res.status(200).send("Connexion réussie !");
    });
});



app.get("/people", (req, res) => {
    const query = "SELECT * FROM people";

    db.query(query, [], (err, result) => {
        
        if (err) {
            console.error("Erreur lors de la récupération des données :", err);
            res.status(500).send("Erreur serveur");
            return;
        }

        if (result.length === 0) {
            res.status(404).send("Utilisateur non trouvé");
            return;
        }

        console.log("Données récupérées avec succès");
        res.json(result); // Retourne les données en JSON
    });
});


app.get("/people-id/:id", (req, res) => {
    const userId = req.params.id;

    // Requête SQL pour récupérer les informations de l'utilisateur
    const query = "SELECT * FROM people WHERE ID = ?";

    db.query(query, [userId], (err, result) => {
       
        
        if (err) {
            console.error("Erreur lors de la récupération des données :", err);
            res.status(500).send("Erreur serveur");
            return;
        }

        if (result.length === 0) {
            res.status(404).send("Utilisateur non trouvé1");
            return;
        }

        console.log("Données récupérées avec succès");
        res.json(result[0]); // Retourne les données en JSON
    });
});

app.get("/people-nom/:nom", (req, res) => {
    const userNom = req.params.nom;

    // Requête SQL pour récupérer les informations de l'utilisateur
    const query = "SELECT * FROM people WHERE NOM = ?";

    db.query(query, [userNom], (err, result) => {

        if (err) {
            console.error("Erreur lors de la récupération des données :", err);
            res.status(500).send("Erreur serveur");
            return;
        }

        if (result.length === 0) {
            res.status(404).send("Utilisateur non trouvé");
            return;
        }

        console.log("Données récupérées avec succès");
        res.json(result); // Retourne les données en JSON
    });
});

app.get("/people-prenom/:prenom", (req, res) => {
    const userPrenom = req.params.prenom;

    // Requête SQL pour récupérer les informations de l'utilisateur
    const query = "SELECT * FROM people WHERE PRENOM = ?";

    db.query(query, [userPrenom], (err, result) => {

        if (err) {
            console.error("Erreur lors de la récupération des données :", err);
            res.status(500).send("Erreur serveur");
            return;
        }

        if (result.length === 0) {
            res.status(404).send("Utilisateur non trouvé");
            return;
        }

        console.log("Données récupérées avec succès");
        res.json(result); // Retourne les données en JSON
    });
});

app.get ("/", (req, res) => {
    fs.readFile('./index.html', function (err, html) {
        if (err) {
            throw err; 
        } res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);  
        res.end();})        

}
    )


    app.get("/people-login/:email", (req, res) => {
        const userEmail = req.params.email;
    
        // Requête SQL pour récupérer les informations de l'utilisateur
        const query = "SELECT * FROM people WHERE EMAIL = ?";
    
        db.query(query, [userEmail], (err, result) => {
    
            if (err) {
                console.error("Erreur lors de la récupération des données :", err);
                res.status(500).send("Erreur serveur");
                return;
            }
    
            if (result.length === 0) {
                res.status(404).send("Utilisateur non trouvé");
                console.log(res);
                
                return;
            }
    
            console.log("Données récupérées avec succès");
            res.json(result); // Retourne les données en JSON
        });
    });

    app.delete("/people-suppression/:id", (req, res)=>{
        const query = "DELETE FROM people WHERE ID = ?";

        const userId = req.params.id;
        db.query (query,[userId], (err,result)=>{
            if(err){
                console.error("Erreur lors de la récupération des données");
                res.status(500).send("Erreur Serveur");
                return;
            }
            if (result.length === 0){
                res.status(404).send("Entreprise non trouvé");
                return;
            }
            console.log("données supprimées avec succès");
            res.json(result);
        })
    } )


// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});






       