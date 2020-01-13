const express = require('express');
const app = express();

const port = 3023;

const static = express.static('static');
app.use(static);

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.listen(port, () => {
    console.log(`示例应用正在监听 ${port} 端口！`)
});