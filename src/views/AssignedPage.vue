<template>
    <header>
        <button>Återgå till startsida</button>
      
        
    </header>
   
    <div>
        <h1>Du är tilldelad:</h1>
         <h1>Namn</h1>
         <button>Gå till önskelistan</button>
       
    </div>

</template>

<script>
import io from 'socket.io-client';
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

</style>