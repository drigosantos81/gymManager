// Create (POST)
exports.post = function(req, res) {

    const keys = Object.keys(req.body);

    for(key of keys) {
        // req.body.key == ""
        if (req.body[key] == "") {
            return res.send('Por favor, preencha todos os campos');
        }
        
    }

    return res.send(req.body);
}
// Update ()

// Delete ()