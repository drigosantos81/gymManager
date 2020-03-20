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

    let {avatar_url, birth, name, services, gender} = req.body;

    birth = Date.parse(birth);
    const created_at = Date.now();
    const id = Number(data.instructors.length + 1);

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,
    }); // [{...}, {...}]

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error!");

        return res.redirect("/instructors");
    })
}

// Mostrar
exports.show = function(req, res) {
    // req.query.id => Direto na barra de endereço usando '?id=1'
    // req.body => Pega do formulário (corpo da requisição) através do POST
    // req.params.id => 

    const { id } = req.params;

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id;
    })

    if (!foundInstructor) return res.send("Instrutor não encontrado!");

    function age(timestamp) {
        const today = new Date();
        const birthDate = new Date(timestamp);
    
        // 2019 - 1985 = 34
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
    
        // 11 - 12 = -1
        // 11 - 11 = 0
        if (month < 0 ||
            month == 0 &&
            today.getDate() <= birthDate.getDate()) {
                age = age - 1;
        }
    
        return age;
    }

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: "",
    }

    return res.render("instructors/show", { instructor })
}
// Update ()

// Delete ()