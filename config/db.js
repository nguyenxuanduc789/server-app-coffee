const mongoose = require('mongoose');

const connectDb = () => {
    const mongoURI = process.env.MONGODB_URI;

    mongoose
        .connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Kết nối MongoDB thành công');
        })
        .catch((err) => {
            console.error('Lỗi kết nối MongoDB:', err);
        });
};

module.exports = connectDb;
