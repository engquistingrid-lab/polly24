<template>
    <div class="wrapper">
         <button class="langbtn" v-on:click="switchLanguage">
            {{ uiLabels.changeLanguage }}
         </button>

        <h1> SecretSanta </h1>
        <div class="options">
        <router-link to="/signup/" class="signin">
             {{ uiLabels.signup }}</router-link>
        <router-link to="/login/" class="login"> 
            {{ uiLabels.login }}
        </router-link>
        <router-link to="/wishlist">
            <button class="wishGame">
              Gå till WishlistGame
            </button>
        </router-link>


        </div>

    </div>



</template>

<script>import io from 'socket.io-client';
const socket = io("localhost:3000");
    export default {
        name:"StartView1",

    data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem( "lang") || "en",
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    }
  }
    }
</script>

<style>

.wrapper{
    position: relative;
    background-color: rgb(206, 15, 15);
    color: aliceblue;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
} 
.signin {
    padding: 15px 50px;
    background: linear-gradient(45deg, #ed779b, #e7114a);
    border-radius: 15px;
    box-shadow: 0 0 15px white;
    color: white;


}
.login{
    padding: 15px 50px;
    background:linear-gradient(45deg, green, rgb(5, 72, 5));
    border-radius: 15px;
    box-shadow: 0 0 15px white;
    color: white;

}
.options {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 70px;
}

h1 {
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 49px;
    padding: 20px;
    border: 2px solid white;
}
.langbtn{
    position: absolute;
    top: 20px;
    right: 20px;
    background: white;
}
</style>


