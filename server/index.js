const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();
const router = require('./routes/router');
const config = require('./config');
const PORT = config.PORT || 5000;
const errorMiddleware = require('./middleware/errorMiddleware');

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);
app.use(errorMiddleware);


const start = () => {
    try{
        mongoose.connect(config.DB_LINK, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        app.listen(PORT, () => console.log(`Server started on ${PORT}`));
    }catch(e){
        console.log(e)
    }
}



start();