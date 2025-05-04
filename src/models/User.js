const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate: {
            validator: function(v){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: '{VALUE} is not a valid email'
        }
    },

    password: {
        type: String,
        required: true,
        minLength: 8
    },
    
    role:{
        type: String,
        enum: ['admin', 'author'],
        default: 'author'
    }
});

//hash password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//compare passwords
userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports =  mongoose.model('User', userSchema);