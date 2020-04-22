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

    const foundMember = data.members.find(function(member) {
        return id == member.id;
    });
    
    if (!foundMember){
        return res.send("Member não encontrado.");
    }

    const member = {
        ...foundMember,
        age: age(foundMember.birth),
        // birthDay: birthDay(foundMember.birth).iso,
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundMember.created_at),
    }

    return res.render("members/show", { member });
};

// edit
exports.edit = function(req, res) {
    const { id } = req.params;

    const foundMember = data.members.find(function(member) {
        return id == member.id;
    });
    
    if (!foundMember){
        return res.send("Member não encontrado.");
    }

    const member = {
        ...foundMember,
        birth: date(foundMember.birth),
    }
    
    return res.render("members/edit", { member });
}

// update - PUT
exports.put = function(req, res) {
    const { id } = req.body;
    let index = 0;

    const foundMember = data.members.find(function(member, foundIndex) {
        if (id == member.id) {
            index = foundIndex;
            return true;
        };
    });
    
    if (!foundMember){
        return res.send("Member não encontrado.");
    }

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
    }

    data.members[index] = member;

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

    const filteredMembers = data.members.filter(function(member) {
        return member.id != id;
    });

    data.members = filteredMembers;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) {
            return res.send("Erro ao salvar o arquivo.");
        };
    });

    return res.redirect("/members");
};
