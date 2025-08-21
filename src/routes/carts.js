const express = require('express');
const fs = require('fs').promises; 
const path = require('path'); 

const router = express.Router();
const { requireAuth } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/authorization.middleware');
 
const CARTS_FILE = path.join(__dirname, '../data/carts.json'); 

// Función para leer carritos del archivo
const readCarts = async () => {
    try {
        const data = await fs.readFile(CARTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

// Función para escribir carritos al archivo
const writeCarts = async (carts) => {
    await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
};

// Rutas

// POST / - Crear un nuevo carrito
router.post(requireAuth, authorizeRoles('user'), '/', async (req, res) => {
    const carts = await readCarts();
    const newCart = {
        id: (carts.length + 1).toString(),
        products: []
    };

    carts.push(newCart);
    await writeCarts(carts);

    res.status(201).json(newCart);
});

// GET /:cid - Listar productos de un carrito
router.get('/:cid', async (req, res) => {
    const carts = await readCarts();
    const cart = carts.find(c => c.id === req.params.cid);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: "Carrito no encontrado" });
    }
});

// POST /:cid/product/:pid - Agregar producto al carrito
router.post(requireAuth, authorizeRoles('user'), '/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const carts = await readCarts();

    const cart = carts.find(c => c.id === cid);
    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productInCart = cart.products.find(p => p.product === pid);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    await writeCarts(carts);

    res.status(200).json(cart);
});

module.exports = router; 
