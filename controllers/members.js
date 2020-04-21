const fs = require('fs');
const data = require('../data.json');
const { age, date, birthDay } = require('../utils');

// index
exports.index = function(req, res) {
    return res.render("alunos/index", { alunos: data.alunos });
};

exports.create = function(req, res) {
    return res.render("alunos/create");
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
    const id = Number(data.alunos.length + 1);

    data.alunos.push({
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

        return res.redirect("/alunos");
    });
};

// show
exports.show = function(req, res) {
    const { id } = req.params;

    const foundAluno = data.alunos.find(function(aluno) {
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

    return res.render("alunos/show", { aluno });
};

// edit
exports.edit = function(req, res) {
    const { id } = req.params;

    const foundAluno = data.alunos.find(function(aluno) {
        return id == aluno.id;
    });
    
    if (!foundAluno){
        return res.send("Aluno não encontrado.");
    }

    const aluno = {
        ...foundAluno,
        birth: date(foundAluno.birth),
    }
    
    return res.render("alunos/edit", { aluno });
}

// update - PUT
exports.put = function(req, res) {
    const { id } = req.body;
    let index = 0;

    const foundAluno = data.alunos.find(function(aluno, foundIndex) {
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

    data.alunos[index] = aluno;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) {
            return res.send("Erro ao salvar o arquivo.");
        }
        return res.redirect(`/alunos/${id}`);
    })

};

// delete - DELETE
exports.delete = function(req, res) {
    const { id } = req.body;

    const filteredAlunos = data.alunos.filter(function(aluno) {
        return aluno.id != id;
    });

    data.alunos = filteredAlunos;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) {
            return res.send("Erro ao salvar o arquivo.");
        };
    });

    return res.redirect("/alunos");
};
