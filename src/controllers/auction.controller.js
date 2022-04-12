const Auction = require('../models/auction.model')
const User = require('../models/user.model')


exports.getAuctions = (req, res) => {
    Auction.find()
    .populate('owner')
    .then(auctions => {
        res.status(200).send({
            success: true,
            data:auctions
        })
    }).catch(err => {
        res.status(500).send({
            success:false,
            message: "Un problème est survenu lors de la récupération des enchères.",
            errMessage: err.message
        })
    })
}
exports.getFilteredAuctions = (req, res) => {
    console.log(req.body.filter)
    Auction.find(req.body.filter)
    .populate('owner')
    .populate({
        path:"lastBid",
        populate:{
            path:"user",
            model:"User"
        }
    })
    .then(auctions => {
        console.log(auctions)
        res.status(200).send({
            success: true,
            data:auctions
        })
    }).catch(err => {
        res.status(500).send({
            success:false,
            message: "Un problème est survenu lors de la récupération des enchères.",
            errMessage: err.message
        })
    })
}
exports.getAuction = (req, res) => {
    Auction.findById(req.params.id)
    .populate('owner')
    .populate({
        path: "lastBid",
        populate:{
          path:"user",
          model:"User"
        }
      })
    .then(auction => {
        res.status(200).send({
            success: true,
            data:auction
        })
    }).catch(err => {
        res.status(500).send({
            success:false,
            message: "Un problème est survenu lors de la récupération de l'enchère.",
            errMessage: err.message
        })
    })
}
exports.createAuction = (req, res) => {

    const auction = new Auction({
        product:{
            title : req.body.product.title,
            description : req.body.product.description,
            initialPrice : req.body.product.initialPrice,
            image : req.body.product.image,
        },
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        owner:req.body.owner,
        lasBid:{}
    })
    auction.save()
    .then(auction => {
        console.log(auction._id)
        console.log(auction.owner)
        User.findByIdAndUpdate({_id:auction.owner}, { $push: {auctions: {auction: auction._id}}}, {new:true}).then(data => {
            console.log(data)
        })
        res.status(200).send({
            success:true,
            data:auction
        })
    }).catch(err => {
        res.status(500).send({
            success:false,
            message: "Une erreur s'est produite lors de la création de l'enchère",
            errMessage: err.message
        })
    })
}
exports.updateAuction = (req,res) => {
    Auction.findOneAndUpdate({_id: req.params.id}, req.body, {new:true})
    .populate({
        path:"lastBid",
        populate:{
            path:"user",
            model:"User"
        }
    })
    .then(data => {
        res.status(200).send({
            success: true,
            data: data
        })
    }).catch(err => {
        res.status(500).send({
            success:false,
            message: "Une erreur s'est produite lors de la mise à jour de l'enchère",
            errMessage: err.message
        })
    })
}

exports.deleteAuction = (req, res) => {
    Auction.findByIdAndRemove(req.params.id)
    .then(data => {
        res.status(200).send({
            sucess:true,
            data: data
        })
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: "Une erreur s'est produite lors de la suppression de l'enchère",
            errMessage: err.message
        })
    })
}

exports.deleteAuctions = (req, res) => {
    Auction.remove()
    .then(data => {
        res.status(200).send({
            success: true,
            data: data
        })
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: "Une erreur s'est produite lors de la suppression des enchères",
            errMessage: err.message
        })
    })
}
exports.searchAuction = (req,res) => {
    console.log(req.params.search)
    Auction.find({$text: {$search: req.params.search}})
    .then(data => {
        res.send({
            success:true,
            data:data
        })
    }).catch(err=>{
        res.send({
            success:false,
            errMessage: err.message
        })
    }) 
}