
<template>
  <div class="wrapper">
    <header>
      <div class="header-content">
      <h1> 
        {{ uiLabels.YourGroups }}
      </h1>
        <button class="langbtn" v-on:click="returnToHomepage ">
            <router-link to="/homepage/"> 
              {{ uiLabels.ReturnToHomepage }}
            </router-link>     
        </button>
      </div>
    </header>
    
    <div>
        
         <button>Grupp 1</button>
       
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
    export default {
        name:"MyGroupsPage",

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

</style>