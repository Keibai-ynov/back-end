const User = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const jwtConfig = require("../configs/jwt.config");
const stripe = require('stripe')('sk_test_51KiQcfFqBxp3dUF0Bj0utMSoCVbahNuZv039AJ2SdbGDdJUiBkcVfKKt1GXMdK3y7002cqQLRh4WKjehfGpKoxUI00TZM7XzGV')



exports.register = async (req,res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 8)
    const customer = await stripe.customers.create()
    console.log(customer)
    const user = new User({
        lastname:req.body.lastname,
        firstname:req.body.firstname,
        email:req.body.email,
        password:hashedPassword,
        adress:{
            fullAdress:req.body.adress.fullAdress,
            zipcode:req.body.adress.zipcode,
            city:req.body.adress.city,
        },
        phoneNumber:req.body.phoneNumber,
        auctions:[],
        id_customer:customer.id,
        isAdmin: req.body.isAdmin
    })
    user
    .save()
    .then((data) => {
        let userToken = jwt.sign(
            {
              id: data._id,
              isAdmin: data.isAdmin,
            },
            jwtConfig.secret,
            {
              expiresIn: 86400,
            }
        );
        res.status(200).send({
            success: true,
            token: userToken
        })
    }).catch((err) => {
        res.status(500).send({
            success:false,
            message: "Un problème est survenu lors de la création de l'utilisateur.",
            errMessage: err.message
        });
    })
    
}
exports.getUsers = (req,res) => {
    User
    .find()
    .then((users) => {
        res.status(200).send({
            data:users,
            success:true,
        })
    }).catch((err) => {
        res.status(500).send({
            success:false,
            message:"Impossible de récupérer tous les utilisateurs",
            errMessage: err.message
        })
    })
}

exports.getUserById = (req,res) => {
    User
    .findById(req.params.id)
    .then(user => {
        res.status(200).send({
            data:user,
            success:true
        })
    }).catch(err => {
        res.status(500).send({
            success: false,
            message:"L'utilisateur est introuvable",
            errMessage: err.message
        })
    })
}
exports.login = (req,res) => {
    User.findOne({
        email: req.body.email
    })
    .then((data) => {
        if (bcrypt.compareSync(req.body.password, data.password)) {
            let userToken = jwt.sign(
                {
                    id: data._id,
                    isAdmin: data.isAdmin,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: 86400,
                }
            );
            res.send({
              token: userToken,
              success:true,
            });
        }else {
            res.status(500).send({
                success:false,
                message: "User not found",
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            success:false,
            message: "User not found",
            errMessage: err.message

        });
    });

}
exports.updateUser = (req,res) => {
    if(req.body.password){
        let hashedPassword = bcrypt.hashSync(req.body.password, 8)
        req.body.password = hashedPassword
    }
    User.findOneAndUpdate({ _id: req.params.id }, req.body, {new:true})
    .then((user) => {
        res.send({
            data:user,
            message: "le compte a bien été mis à jour",
            success:true,
        });
     })
    .catch((err) => {
        res.status(500).send({
            success:false,
            message:"Une erreur s'est produite lors de la mise à jour du compte utilisateur",
            errMessage:err.message 
        });
    });
}
exports.deleteUser = (req,res) => {
User.findByIdAndRemove(req.params.id)
.then((data)=>{
    res.status(200).send({
        success: true,
        data:data
    })
}).catch(err => {
    res.status(500).send({
        success: false,
        message: "Une erreur s'est produite lors de la suppression de l'utilisateur",
        errMessage: err.message
    })
})
}
exports.deleteUsers = (req,res) => {
    User.remove()
    .then((data) => {
        res.status(200).send({
            success: true,
            data: data
        })
    }).catch(err => {
        res.status(500).send({
            sucess:false,
            message: "Une erreur s'est produite lors de la suppression des utilisateurs",
            errMessage: err.message
        })
    })
}
exports.addToFavorites = (req,res) => {
    if(req.body.isFavorite){
        User.findOneAndUpdate({ _id: req.params.id }, { $pull: {favorites: {favorite: req.body.auction}}}, {new:true})
        .then(data => {
            res.send({
                success: true,
                data: data
            })
        }).catch(err => {
            res.status(500).send({
                success:false,
                message: "Une erreur s'est produite lors de l'ajout aux favoris",
                errMessage: err.message
            })
        })
    }else{
       
        User.findOneAndUpdate({ _id: req.params.id }, { $push: {favorites: {favorite: req.body.auction}}}, {new:true})
        .then(data => {
            res.send({
                success: true,
                data: data
            })
        }).catch(err => {
            res.status(500).send({
                success:false,
                message: "Une erreur s'est produite lors de l'ajout aux favoris",
                errMessage: err.message
            })
        })
    }
}
exports.getFavorites = (req,res) => {
    User.findById(req.params.id, "favorites")
    .populate({
        path:"favorites",
        populate:{
            path:"favorite",
            model:"Auction"
        }
    })
    .populate({
        path:"favorites",
        populate:{
            path:"favorite",
            populate:{
                path:"owner",
                model:"User"
            }
        }
    })
    .then(data => {
        res.send({
            success:true,
            data:data
        })
    }).catch(err => {
        res.status(500).send({
            success:false,
            message: "Une erreur s'est produite lors de la récupération des favoris",
            errMessage: err.message
        })
    })
}
exports.getAuctions = (req,res) => {
    User.findById(req.params.id, "auctions")
    .populate({
        path:"auctions",
        populate:{
            path:"auction",
            model:"Auction"
        }
    })
    .then(data => {
        res.send({
            success:true,
            data:data
        })
    }).catch(err => {
        res.status(500).send({
            success:false,
            message: "Une erreur s'est produite lors de la récupération des favoris",
            errMessage: err.message
        })
    })
}