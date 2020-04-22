const fs = require('fs');
const data = require('../data.json');
const { age, date, birthDay } = require('../utils');

// index
exports.index = function(req, res) {
    return res.render("members/index", { members: data.members });
};

// Exibe a página create
exports.create = function(req, res) {
    return res.render("members/create");
};

// create - POST
exports.post = function(req, res) {
    
    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Por favor, preencha todos os campos.");
        }
    }

    let { avatar_url, name, birth, email, anoescolar, ch } = req.body;

    birth = Date.parse(birth);
    const created_at = Date.now();
    const id = Number(data.members.length + 1);

    data.members.push({
        id, 
        avatar_url, 
        name, 
        email, 
        birth,
        anoescolar,
        ch,
        created_at
    });

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Erro ao salvar o arquivo.");

        return res.redirect("/members");
    });
};

// show
exports.show = function(req, res) {
    const { id } = req.params;

    const foundAluno = data.members.find(function(aluno) {
        return id == aluno.id;
    });
    
    if (!foundAluno){
        return res.send("Aluno não encontrado.");
    }

    const aluno = {
        ...foundAluno,
        age: age(foundAluno.birth),
        birthDay: birthDay(foundAluno.birth).iso,
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundAluno.created_at),
    }

    return res.render("members/show", { aluno });
};

// edit
exports.edit = function(req, res) {
    const { id } = req.params;

    const foundAluno = data.members.find(function(aluno) {
        return id == aluno.id;
    });
    
    if (!foundAluno){
        return res.send("Aluno não encontrado.");
    }

    const aluno = {
        ...foundAluno,
        birth: date(foundAluno.birth),
    }
    
    return res.render("members/edit", { aluno });
}

// update - PUT
exports.put = function(req, res) {
    const { id } = req.body;
    let index = 0;

    const foundAluno = data.members.find(function(aluno, foundIndex) {
        if (id == aluno.id) {
            index = foundIndex;
            return true;
        };
    });
    
    if (!foundAluno){
        return res.send("Aluno não encontrado.");
    }

    const aluno = {
        ...foundAluno,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
    }

    data.members[index] = aluno;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) {
            return res.send("Erro ao salvar o arquivo.");
        }
        return res.redirect(`/members/${id}`);
    })

};

// delete - DELETE
exports.delete = function(req, res) {
    const { id } = req.body;

    const filteredMembers = data.members.filter(function(aluno) {
        return aluno.id != id;
    });

    data.members = filteredMembers;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) {
            return res.send("Erro ao salvar o arquivo.");
        };
    });

    return res.redirect("/members");
};
