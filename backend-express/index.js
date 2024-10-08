const express = require('express');
const cors = require('cors');
const router = require('./routes');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})