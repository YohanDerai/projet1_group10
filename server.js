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
    password: "4678", // Ajoute ton mot de passe MySQL si besoin
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

// Route pour gérer la soumission du formulaire
app.post("/inscription", (req, res) => {
    const { nom, prenom, tel, naissance, email } = req.body;
 
    // Requête SQL pour insérer les données dans la base de données
    // console.log(nom, email, motdepasse);
    
    const query =
        "INSERT INTO people (nom, prenom, tel, naissance, email) VALUES (?, ?, ?, ?, ?);";

    db.query(query, [nom, prenom, tel, naissance, email], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'insertion des données :", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        console.log("Données insérées avec succès");
        res.send("Inscription réussie !");
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

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
// app.get("/home", (req, res) => {
//     const query2 = "SELECT * FROM utilisateur WHERE id = \"1\"";;

//     db.query(query2, (err, result) => {
//         if (err) {
//             console.error("Erreur lors de la récupération des données :", err);
//             res.status(500).send("Erreur serveur");
//             return;
//         }
//         console.log(result);
//         res.send(result);
//     });

// });





       