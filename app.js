const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const fs = require('fs')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({
        status: true,
        response: "Hello world"
    })
})
app.get('/get-user', (req, res) => {
    const userData = getData()
    res.json({
        status: true,
        response: userData
    })
})

app.post('/create-user', (req, res) => {
    const existData = getData();
    console.log(existData);
    const body = req.body;
    const found = existData.find(data => data.phone === req.body.phone)
    if (found) {
        res.json({
            status: false,
            response: "Phone already exist"
        })
    } else {
        body.id = uuidv4();
        existData.push(body)
    }
    saveData(existData)
    res.json({
        status: true,
        response: "Successfully Added"
    })

})
app.patch('/update-user', (req, res) => {
    const existData = getData();
    const body = req.body;
    const found = existData.find(data => data.phone === req.body.phone && data.id !== req.body.id)
    if (found) {
        res.json({
            status: false,
            response: "Phone already exist"
        })
    } else {
        console.log(body);
        const updateUser = existData.filter(user => user.phone !== body.phone)
        updateUser.push(body)
        saveData(updateUser)
        res.json({
            status: true,
            response: "Data updated successfully"
        })
    }
})
app.delete('/delete-user/:id', (req, res) => {
    const id = req.params.id
    const existData = getData();
    const found = existData.find(data => data.id === id)
    if (found) {

        const updateUser = existData.filter(user => user.id !== id)

        saveData(updateUser)
        res.json({
            status: true,
            response: "Data deleted successfully"
        })
    } else {
        res.json({
            status: false,
            response: "Data not found"
        })
    }
})
app.post('/login', (req, res) => {
    const existData = getData();
    const body = req.body;
    const found = existData.find(data => data.email === req.body.email && data.password === req.body.password)
    if (found) {
        res.send("user login success")
    } else {
        res.send("user login fail")
    }

})


const saveData = (data) => {
    const stringData = JSON.stringify(data);
    fs.writeFileSync('users.json', stringData)
}
const getData = () => {
    const stringData = fs.readFileSync('users.json')
    return JSON.parse(stringData)
}
module.exports = app