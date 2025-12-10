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
            <router-link to="/homepage/" class="login"> 
            Logga in
            </router-link>
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
        lang: localStorage.getItem("lang") || "en"
    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang )
    },

    methods: {
        login: function() {
            
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