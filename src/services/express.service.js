const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('../routes/index.route')
const cors = require('cors')
const path = require('path');
require('dotenv').config();

let corsOptions = {
    origin: [ 'http://localhost:3001', 'http://localhost:3000' ]
};

const app = express()



app.use(bodyParser.json());
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/v1',apiRouter);
exports.start = () => {
    let port = 4000;
    app.listen(port, (err) => {
        if(err){
            console.log(`Erreur: ${err}`)
            process.exit(-1);
        }
        console.log(`L'application est en marche sur le port ${port}`)
    })
}