<template>
    <header>
        <h1>Secret Santa</h1>
        <button class="langbtn" v-on:click="switchLanguage">
            {{ uiLabels.changeLanguage  }}
        </button>
        <button class="logoutbtn" v-on:click="">
            {{ uiLabels.Logout }}
        </button>
    </header>
   
    <div>
        <h1>{{ uiLabels.Welcome }}, Gruppnamn</h1>
        <router-link to ='/administratorstart/'>
            {{ uiLabels.Startnewgroup }}
        </router-link>
    
        <router-link to="/joingroup/">
          {{uiLabels.Joingroup}}
        </router-link>
        <router-link to="/mygroupspage/">
            {{ uiLabels.Showmygroup }}
      </router-link>
    </div>

</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
    export default {
        name:"HomePage",

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

h1 {
    color:black;
}

.logoutbtn{
  display: flex;
  top: 0px;
  left: 10px;

}
</style>