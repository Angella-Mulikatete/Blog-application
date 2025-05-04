const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try{
        const{name, email,password} = req.body;

        //check if user exists
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                error:'Emalil already exists'
            })
        }

        //create a new user

        const newUser = await User.create({
            name,
            email,
            password
        });

        //generate jwt token
        const token = jwt.sign(
            {userId: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );
        
        res.status(201).json({
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });
    }catch(error){
        res.status(500).json({
            error: 'Registration failed',
            details: error.message
        });
    }
}

exports.login  = async(req, res) => {
    try{
        const{ email, password} =req.body

        //find user
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                error: 'invalid credentials'
            });
        }

        //verify password
        const isValid = await user.isValidPassword(password);
        if(!isValid){
            return res.status(401).json({
                error: 'invalid credentials'
            });
        }

        //generate jwt token
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        res.json({
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        })
    }catch(error){
        res.status(500).json({
            error: 'Login failed',
            details: error.message
        });
    }
}