const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})


app.post("/", (req, res) => {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;


    const data = {
        "update_existing": true,
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);


    const options = {
        method: "post",
        auth: "jay:56ef333f839a5576c2f760c47b21c026-us13",

    }

    const url = "https://us13.api.mailchimp.com/3.0/lists/f760b9922b"

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(path.join(__dirname, 'success.html'))
        } else {
            res.sendFile(path.join(__dirname, 'failure.html'))
        }

        response.on('data', (data) => {
            console.log(response.statusCode);
            console.log(JSON.parse(data));
        })

    }).on('error', (error) => {
        console.error(error);
    })

    request.write(jsonData);
    request.end()

})


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})



// apiKey: 9fa61e1f9a7c69134a0092d897dd8877 - us13

// list id: f760b9922b


