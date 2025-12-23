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
      <button> 
        <router-link to ='/StartNewGroup/'>
            {{ uiLabels.Startnewgroup }}
        </router-link>
      </button>
      <button>
        <router-link to="/joingroup/">
          {{uiLabels.Joingroup}}
        </router-link>
      </button>
    </div>

</template>

<script>
import io from 'socket.io-client';

sessionStorage.setItem("serverIP", "http://10.0.0.10:3000") //Måste ändras till din lokala IP-adress

const socket = io(sessionStorage.getItem("serverIP"));
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