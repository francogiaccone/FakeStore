const express = require("express");
const app = express();
const fs = require("fs");
const translate = require("node-google-translate-skidz");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/productos", (req, res) => {
    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(error => console.log(error));
});

//endpoint anterior que traducia solamente un texto, decido dejarla por las dudas si falla la otra
/*app.get("/traducir", async (req, res) => {
    const texto = req.query.texto;
    try {
        translate({text: texto, source: "en", target: "es"}, traduccion => {
            res.json(traduccion.translation);
        });
    } catch (error) {
        console.error("Error al traducir:", error);
        res.status(500).send("Error interno del servidor");
    }
});*/

app.get("/traducir", async (req, res) => {
    const { texto1, texto2, texto3 } = req.query;
    
    try {
        const traducciones = await Promise.all([
            translate({ text: texto1, source: "en", target: "es" }),
            translate({ text: texto2, source: "en", target: "es" }),
            translate({ text: texto3, source: "en", target: "es" })
        ]);

        const traduccionesArray = traducciones.map(traduccion => traduccion.translation);
        res.json(traduccionesArray);
    } catch (error) {
        console.error("Error al traducir:", error);
        res.status(500).send("Error interno del servidor");
    }
});

app.get("/descuentos", (req, res) => {
    try {
        const data = fs.readFileSync("persistencia/descuentos.json");
        res.json(JSON.parse(data));
    } catch (err) {
        console.error("Error al leer el archivo de descuentos", err);
        res.status(500).send("Error al obtener la información de descuentos");
    }
});

app.post("/compras", (req, res) => {
    const compra = req.body;

    fs.readFile("persistencia/compras.json", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo de compras:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        let compras = JSON.parse(data);

        compras.push(compra);

        fs.writeFile("persistencia/compras.json", JSON.stringify(compras), err => {
            if (err) {
                console.error("Error al guardar la compra:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            res.json({ mensaje: "Compra guardada exitosamente" });
        });
    });
});

app.listen(3000, () => {
    console.log("Servidor iniciado.");
});