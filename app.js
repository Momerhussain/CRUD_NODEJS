const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const fs = require('fs');
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({
        status: true,
        response: "Hello world"
    })
})
app.get('/get-user', async (req, res) => {
    try {

        const userData = await getData()
        res.setHeader('Content-Type', 'application/json');
        res.json({
            status: true,
            response: userData
        })
    } catch (e) {
        console.log(e);
    }
})

app.post('/create-user', async (req, res) => {
    try {

        const existData = await getData();
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
    } catch (e) {
        console.log(e);
    }

})
app.patch('/update-user', async (req, res) => {
    try {

        const existData = await getData();
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
    }
    catch (e) {
        console.log(e);
    }
})
app.delete('/delete-user/:id', async (req, res) => {
    try {

        const id = req.params.id
        const existData = await getData();
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
    } catch (e) {
        console.log(e);
    }
})
app.post('/login', (req, res) => {
    try {

        const existData = getData();
        const body = req.body;
        const found = existData.find(data => data.email === req.body.email && data.password === req.body.password)
        if (found) {
            res.send("user login success")
        } else {
            res.send("user login fail")
        }
    }
    catch (e) {
        console.log(e);
    }
})


const saveData = async (data) => {
    const stringData = JSON.stringify(data);
    const file = path.join(process.cwd(), 'users.json');
    const stringified = await fs.writeFileSync(file, stringData)
    // fs.writeFileSync('users.json', stringData)
}
const getData = async () => {
    // const stringData = fs.readFileSync('users.json')
    const file = path.join(process.cwd(), 'users.json');
    const stringified = await fs.readFileSync(file, 'utf8');
    return JSON.parse(stringified)
}
module.exports = app