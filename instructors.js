const fs = require('fs');
const data = require('./data.json');

// Create (POST)
exports.post = function(req, res) {

    const keys = Object.keys(req.body);

    for(key of keys) {
        // req.body.key == ""
        if (req.body[key] == "") {
            return res.send('Por favor, preencha todos os campos');
        }        
    }

    req.body.birth = Date.parse(req.body.birth);
    req.body.created_at = Date.now();

    data.instructors.push(req.body); // [{...}, {...}]

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error!");

        return res.redirect("/instructors");
    })

    // return res.send(req.body);
}
// Update ()

// Delete ()