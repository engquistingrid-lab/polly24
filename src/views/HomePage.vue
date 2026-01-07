<template>
    <header>
        <h1>Secret Santa</h1>
        <div class="header-buttons">
          <button class="lang-button" v-on:click="switchLanguage">
              {{ uiLabels.ChangeLanguage || 'Ändra språk' }}
          </button>
        </div>
    </header>
   
    <div class="main-wrapper">
      <button class="menu-button start-new" @click="goToCreate"> 
            {{ uiLabels.StartNewGroup || 'Starta ny grupp' }}
      </button>
      
      <button class="menu-button join-group" @click="goToJoin">
          {{ uiLabels.JoinGroup || 'Gå med i grupp' }}
      </button>
    
    </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: "HomePage",
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      // ÄNDRA DIN IP HÄR:
      myIp: "192.168.0.117", 
      socket: null
    }
  },
  created: function () {
    // 1. Skapa hela adressen
    const fullAddress = "http://" + this.myIp + ":3000";
    
    // 2. Spara den så andra sidor hittar den (Gruppens metod)
    sessionStorage.setItem("serverIP", fullAddress);
    
    // 3. Starta anslutningen
    this.socket = io(fullAddress);
    
    this.socket.on("uiLabels", labels => this.uiLabels = labels);
    this.socket.emit("getUILabels", this.lang);
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en") this.lang = "sv";
      else this.lang = "en";
      localStorage.setItem("lang", this.lang);
      this.socket.emit("getUILabels", this.lang);
    },
    goToCreate() { this.$router.push('/StartNewGroup/'); },
    goToJoin() { this.$router.push('/joingroup/'); }
  }
}
</script>

<style>
</style>