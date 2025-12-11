<template>
<header>
<div>
    <h1>{{uiLabels.signup}}</h1>
    <router-link to="/" class="langbtn">
        {{uiLabels.Returntostart}}
    </router-link>
</div>
</header>
<body>
<div class="login-wrapper">
<div class="login-box">
<label>Email</label>
 <input type="email" v-model="email" required>
 <label>{{uiLabels.Yourname }}</label>
 <input type="name" v-model="yourname" required>
 <label>{{uiLabels.Password }}</label>
 <input type="password" v-model="password" required>
 <label>{{uiLabels.Confirmpassword }}</label>
 <input type="password" v-model="confirmpassword" required>
</div>

<button @click="signup">
        {{uiLabels.signup}}
</button>
</div>

</body>


</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
export default {
    name:"SignupView",
    data: function () {
    return {
        uiLabels: {},
        lang: localStorage.getItem("lang") || "en",
        yourname: '',
        email: '',
        password: '',
        confirmpassword: '',
        message: '',
        users: []
    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang );
     socket.on("signupResponse", this.handleSignupResponse);
    },

    methods: {
        signup: function() {
            if ( !this.email || !this.yourname || !this.password || !this.confirmpassword ) {
                alert(this.uiLabels.FillAllFields);
                return;
            }

            if (this.password !== this.confirmpassword) {
                alert("Passwords do not match");
                return;
            }

            socket.emit("signup", {
                name: this.yourname,
                email: this.email,
                password: this.password
            });

        },
        handleSignupResponse: function(result) {
            if(result.success) {
                alert(result.message);

                console.log("Konto skapat", "Medlemmar:", result.users);

                this.$router.push('/homepage/');

            } else {
                this.message = result.message || 'Kunde inte registrera kontot.';
                console.error("Registreringsfel:", result.message);
            }
        }
    }
}

</script>

<style>
    .login-wrapper{
    display: flex;
    color: white;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    height: 100vh;
    justify-content: top;
    align-items: center;
    flex-direction: column;
    background-color: rgb(206, 15, 15);

}
.login-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 200px;
    text-align: left;
}  
</style>


