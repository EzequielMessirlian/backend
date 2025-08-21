const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const { requireAuth } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/authorization.middleware');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Función para leer productos del archivo
const readProducts = async () => {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

// Función para escribir productos al archivo
const writeProducts = async (products) => {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

// Rutas

// GET / - Listar todos los productos (opcional ?limit)
router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await readProducts();
    res.json(limit ? products.slice(0, limit) : products);
});

// GET /:pid - Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    const products = await readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

// POST / - Crear un nuevo producto
router.post(requireAuth, authorizeRoles('admin'), '/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "Todos los campos son obligatorios, excepto thumbnails" });
    }

    const products = await readProducts();
    const newProduct = {
        id: (products.length + 1).toString(),
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails: thumbnails || [],
        status: true
    };

    products.push(newProduct);
    await writeProducts(products);

    res.status(201).json(newProduct);
});

// PUT /:pid - Actualizar un producto
router.put(requireAuth, authorizeRoles('admin'), '/:pid', async (req, res) => {
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);

    if (productIndex === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updatedProduct = { ...products[productIndex], ...req.body };
    delete updatedProduct.id; // Asegurarse de no modificar el ID
    products[productIndex] = updatedProduct;

    await writeProducts(products);
    res.json(updatedProduct);
});

// DELETE /:pid - Eliminar un producto
router.delete(requireAuth, authorizeRoles('admin'), '/:pid', async (req, res) => {
    const products = await readProducts();
    const newProducts = products.filter(p => p.id !== req.params.pid);

    if (products.length === newProducts.length) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    await writeProducts(newProducts);
    res.status(204).send();
});

module.exports = router;
