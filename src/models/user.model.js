const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    lastname:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    adress:{
        fullAdress:{
            type:String,
            required:true
        },
        zipcode:{
            type:Number,
            required:true
        },
        city:{
            type:String,
            required:true
        },
    },
    phoneNumber:{
        type:String,
        required: true
    },
    auctions:[
        {
            auction: {
                type:Schema.Types.ObjectId,
                ref: 'Auction',
                required: true
            },
        }
    ],
    favorites:[
        {
            favorite:{
                type:Schema.Types.ObjectId,
                ref: 'Auction',
            }
        }
    ],
    id_customer:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    }
})

module.exports = mongoose.model('User', UserSchema); 
