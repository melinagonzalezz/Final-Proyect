const express = require('express');
const path = require('path'); // Necesario para construir rutas seguras
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Importa el paquete de jsonwebtoken
const SECRET_KEY = "Tu-clave";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/frontend', express.static('frontend')); //Para que se vean la imagenes

//Middlewere

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token no proporcionado o mal formado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Usuario no autorizado" });
    }
};

// Token para el logins
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin") {
        const token = jwt.sign({ username }, SECRET_KEY);
        res.status(200).json({ token });
        console.log("Ingresaste correctamente");
    } else {
        res.status(401).json({ message: "Usuario o contraseña incorrecta" });
    }
});


// Caraga categorias
app.get('/cats', authMiddleware, (req, res) => {
    const filePath = path.join(__dirname, 'data', 'cats', 'cat.json');
    res.sendFile(filePath);
});

//Carga productos por categoria
app.get('/cats_products/:id', authMiddleware, (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, `data`, `cats_products`, `${id}.json`);
    res.sendFile(filePath);
});

//Carga info de un producto
app.get('/products/:id', authMiddleware,  (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, `data`, `products`, `${id}.json`);
    res.sendFile(filePath);
});

//Carga los comentarios
app.get('/products_comments/:id', authMiddleware, (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, `data`, `products_comments`, `${id}.json`);
    res.sendFile(filePath);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
