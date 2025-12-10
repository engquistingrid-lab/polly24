'use strict';

function Users() {
    this.users = [];
}

Users.prototype.addUser = function (name, email, password) {
    if (this.users.some(user => user.email === email)) {
        return {success: false, message: 'E-postadressen är redan registrerad.'};
    }

    else {
        const newUser = {
            name: name,
            email: email,
            password: password
        };

        this.users.push(newUser);

        return {success: true, message: 'Konto skapat'};
    };
}

export { Users };