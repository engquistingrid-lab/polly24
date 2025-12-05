<template>
    <div class="login-wrapper">
        <h1>{{uiLabels.login}}</h1>
        <div class="login-box">
            <label>Email</label>
            <input type="email" v-model="email">
            <label>{{ uiLabels.password }}</label>
            <input type="password" v-model="password">
        
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
    }
}
   
 </script>

<style scoped>
.login-wrapper{
    display: flex;
    color: white;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    height: 100vh;
    justify-content: center;
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