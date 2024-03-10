const UserModel = require("../Models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

const maxAge = 3*24*60*60;

const createToken =(id)=>{
    return  jwt.sign({id}, "userKey",{
        expiresIn:maxAge,
    })
}

module.exports.register = async (req, res, next)=>{
    try{
        const {email, password} =req.body;
        const user = await UserModel.create({email, password});
        const token =createToken(user._id);
        res.cookie('Jwt',token,{
            withCrdentials: true,
            httpOnly : true,
            maxAge: maxAge * 1000,
            sameSite:'none',
            secure: true
        })

        res.status(201).json({user:user._id, created:true});
    }catch(err){
        const errors = handleErrors(err);
        res.json({errors,create:false});
    }
};

const handleErrors = (err)=>{

    let errors = {email:"", password:""};

    if(err.message == "Incorrect Email"){
        errors.email = "Email is wrong"
    }

    if(err.message == "Incorrect Password"){
        errors.email = "Password is wrong"
    }

    if(err.message == "USER_UNDEFINED"){
        errors.email = "Email not found"
    }

    if(err.code ===11000){
        errors.email = "Email is already taken";
        return errors;
    }
    console.log(err);
    if(err.message.includes("Users validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message
        })
    }

    return errors;
}

module.exports.login = async(req, res, next)=>{
    try{
        const {email, password} =req.body;
        const user = await UserModel.login(email, password);
        const token =createToken(user._id);
        res.cookie('Jwt',token,{
            withCrdentials: true,
            httpOnly : true,
            maxAge: maxAge * 1000,
            sameSite:'none',
            secure: true,
        })
        res.status(200).json({user:user, status:true, _token:token});
    }catch(err){
        const errors = handleErrors(err);
        res.json({errors,status:false});
    }
};

module.exports.forget_password = async (req, res, next)=>{
    try {
        const {email} =req.body;
        const user = await UserModel.forget_password(email);
        const userId = user._id;
        const token =jwt.sign({userId}, "userKey",{
                        expiresIn:'5m',
                    });

        res.cookie('Jwt',token,{
            withCrdentials: true,
            httpOnly : true,
            sameSite:'none',
            secure: true,
        });

        const link=`${process.env.BACK_DEV_URL}/reset-password/${userId}/${token}`;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'prasanth.pksl99@gmail.com',
              pass: 'ezddawpggiijivdl'
            }
          });
          
          var mailOptions = {
            from: 'prasanth.pksl99@gmail.com',
            to: email,
            subject: 'Password reset link from node backend',
            text: `Click the link to reset password:  ${link} `
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        res.status(200).json({user:user._id, verification:true});
    } catch (err) {
        const errors = handleErrors(err);
        res.json({errors,verification:false});
    }
}


module.exports.reset_password = async (req, res, next)=>{

    try {
        const {id, token} = req.params;

        if (token) {
            jwt.verify(token, "userKey", async (err, decodedToken) => {
                if (err) {
                    res.render("error_password_reset");
                } else {
                    const user = await UserModel.findById(id);
                    if (user )res.render("index",{email: user.email});
                    else res.send('not verified');
                }
            })
        } else {

            res.render("error_password_reset");
        }
    } catch (error) {

        res.render("error_password_reset");
    }
}


module.exports.update_password = async (req, res, next)=>{

    try {
        const {id, token} = req.params;
        const {password} = req.body;

        if (token) {
            jwt.verify(token, "userKey", async (err, decodedToken) => {
                if (err) {
                    console.log(err);
                    res.render("error_password_reset");
                } else {
                    const encryptpassword = await bcrypt.hash(password,10);
                    await UserModel.updateOne(
                        {
                            _id: id
                        },
                        {
                            $set:{
                                password:encryptpassword,
                            }
                        }
                    );
                   res.render("reset_password_successfull");
  
                }
            })
        } else {

            res.render("error_password_reset");
        }
    } catch (error) {
        const errors = handleErrors(error);
        res.render("error_password_reset");
    }

}