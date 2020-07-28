const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String },
    phno: { type: Number }
});

module.exports = mongoose.model('user', userSchema);