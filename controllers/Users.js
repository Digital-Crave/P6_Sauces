const { User } = require("../mongo")

function createUser(req, res) {
    const { email, password } = req.body
    const user = new User({ email, password })

    user.save()
        .then(() => res.send({ message: "Nouvel utilisateur enregistré !" }))
        .catch((err) => console.log("Utilisateur pas enregistré", err))
}

module.exports = { createUser }