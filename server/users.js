'use strict';

function generateGroupCode() { 
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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
            password: password,
            myGroups: []
        };

        this.users.push(newUser);

        console.log(this.users);
        return {success: true, message: 'Konto skapat'};
    };
};
 Users.prototype.validateUser = function(email, password) {
        const user= this.users.find(u=> u.email === email);
        if (!user) {
            return {success:false, message: "No user with that email" };

        }
         if (user.password !== password) {
            return {success:false, message: "wrong password" };
         }
        return {success:true, message: "login succesful", user: user};
    };
Users.prototype.createGroup = function(userEmail,groupName,priceRange){
    const user = this.users.find(u => u.email === userEmail);
    if(user){
        const groupCode = generateGroupCode();
        const newGroup = {
            groupName: groupName,
            groupCode: groupCode,
            priceRange: priceRange,
            members: [user.name]
        };
        user.myGroups.push(newGroup);
        return {success:true, message: "Group created", group: newGroup};
    } else{
        return {success:false, message: "User not found"};

    }
}



export { Users };