const fs = require('fs');

// Create (POST)
exports.post = function(req, res) {

    const keys = Object.keys(req.body);

    for(key of keys) {
        // req.body.key == ""
        if (req.body[key] == "") {
            return res.send('Por favor, preencha todos os campos');
        }
        
    }

    fs.writeFile("data.json", JSON.stringify(req.body), function(err) {
        if (err) return res.send("Write file error!");

        return res.redirect("/instructors");
    })

    return res.send(req.body);
}
// Update ()

// Delete ()