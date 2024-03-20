const bcrypt = require('bcryptjs')


function hash_pw(password){
    var salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    return hash
}

function compare_pass(password, hash){
    return bcrypt.compareSync(password, hash)
}

module.exports = {hash_pw, compare_pass}