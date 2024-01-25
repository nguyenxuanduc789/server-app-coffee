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
    const { usernameshop, latitude, longitude, name, prices, image, description, included, products } = req.body;
    // if (!Array.isArray(prices) || prices.some((item) => !item.size || !item.price)) {
    //     return res.status(400).json({ error: 'Prices array is invalid' });
    // }
    try {
        // Tạo một cửa hàng mới
        const newCoffeeShop = new Coffeeshop({
            usernameshop,
            latitude,
            longitude,
            name,
            products,
            prices,
            image,
            description,
            included,
        });
        // Lưu vào cơ sở dữ liệu
        const savedCoffeeShop = await newCoffeeShop.save();

        res.json({ success: true, coffeeShop: savedCoffeeShop });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/getall', async (req, res) => {
    const data = await Coffeeshop.find();
    res.json(data);
});
module.exports = router;
