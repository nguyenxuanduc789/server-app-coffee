const router = require('express').Router();
const Coffeeshop = require('../model/coffeeshop');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const secret = 'mysecret';
const Product = require('../model/product');
const paypal = require('paypal-rest-sdk');
const moment = require('moment-timezone');
paypal.configure({
    mode: 'sandbox', // Chế độ sandbox cho môi trường phát triển, chuyển thành 'live' trong môi trường sản phẩm thực
    client_id: 'Acoy1LSwh_eUjhKTb2PIBreXCGQEYW39ELKHgve4-AA8C4P23Gm8iPTk0nqBKC-kCwFEylSVuHlV1UpI',
    client_secret: 'EAQXgiFzv9B0_JhBYRiGu1RUeBbaoMgQaYKxL_3v0zUOpaVH04DZw5B_y1BXk1qwqW_0cwP7VJauFT2V',
});
router.post('/addshop', async (req, res) => {
    const { usernameshop, latitude, longitude, total } = req.body;
    try {
        // Tạo một cửa hàng mới
        const newCoffeeShop = new Coffeeshop({
            usernameshop,
            latitude,
            longitude,
            total: 0,
        });
        // Lưu vào cơ sở dữ liệu
        const savedCoffeeShop = await newCoffeeShop.save();

        res.json({ success: true, coffeeShop: savedCoffeeShop });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/addproduct', async (req, res) => {
    const { usernameshop, product } = req.body;

    try {
        // Find the coffee shop by usernameshop
        const coffeeShop = await Coffeeshop.findOne({ usernameshop });

        if (!coffeeShop) {
            return res.status(404).json({ success: false, message: 'Coffee shop not found' });
        }

        // Add the product to the coffee shop
        coffeeShop.products.push(product);

        // Save the updated coffee shop
        const updatedCoffeeShop = await coffeeShop.save();

        res.json({ success: true, coffeeShop: updatedCoffeeShop });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/getall', async (req, res) => {
    const data = await Coffeeshop.find();
    res.json(data);
});
module.exports = router;
