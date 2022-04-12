const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuctionSchema = new Schema({
    product:{
        title:{
            type:String,
            required:true      
        },
        description:{
            type:String,
            required:true
        },
        initialPrice:{
            type:Number,
            required:true,
        },
        image:{
            type:String,
            required:true
        }
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastBid:{
        mount:{
            type:Number
        },
        user:{
            type:Schema.Types.ObjectId,
            ref: 'User',
        },
        setup_intent_client_secret:{
            type:String,
        },
    },
    status:{
        type:String,
        required:true
    }
    
})


module.exports = mongoose.model('Auction', AuctionSchema); 

