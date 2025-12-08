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
 <input type="email" v-model="email">
 <label>{{uiLabels.Yourname }}</label>
 <input type="name" v-model="yourname">
 <label>{{uiLabels.Password }}</label>
 <input type="password" v-model="password">
 <label>{{uiLabels.Confirmpassword }}</label>
 <input type="password" v-model="password">
</div>
<router-link to="/homepage/" class="signin">
        {{uiLabels.signup}}
    </router-link>
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
        lang: localStorage.getItem("lang") || "en"
    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang )
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


