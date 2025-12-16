<template>
    <header>
    <h1>{{uiLabels.login}}</h1>
     <router-link to="/" class="langbtn">
        {{uiLabels.Returntostart}}
    </router-link>
    </header>
    <div class="login-wrapper">
        <div class="login-box">
            <label>Email</label>
            <input type="email" v-model="email">
            <label>{{ uiLabels.password }}</label>
            <input type="password" v-model="password">
            <button @click="login">
            {{ uiLabels.login }}
            </button>
        </div>
    </div>


</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
export default {
    name:"loginView",
    data: function () {
    return {
        uiLabels: {},
        lang: localStorage.getItem("lang") || "en",
        email: "",
        password: ""

    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang );
     socket.on ("loginResponse", this.handleLoginResponse);
    },

    methods: {
        login: function() {
            if ( !this.email || !this.password ) {
                alert(this.uiLabels.FillAllFields);
                return;
            }
            socket.emit("login", {
                email: this.email,
                password: this.password

            })
            
        },

         handleLoginResponse(response) {
            if (response.success){
                localStorage.setItem("currentUser", JSON.stringify(response.user));
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userEmail", this.email);
                this.$router.push("/homepage/");
            } else {
                alert(response.message ||"Login Failed");
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
    justify-content:top;
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