const mongoose = require("mongoose")
const config = require('../configs/db.config');
require("dotenv").config();

exports.connect= () => {
    let url = config.url;
    mongoose.connect(url,
        {
            useNewUrlParser : true,
            useUnifiedTopology : true
        }).then(
            () =>{
                console.log('Successfully connect to database');
            }).catch(
                err =>{
                    console.log('couldn"t not connect to database',err);
                    process.exit(-1);
                }
            )
        }
