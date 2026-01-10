<template>
    <header>
        <h1>Secret Santa</h1>
        <div class="header-buttons">
          <button class="lang-button" v-on:click="switchLanguage">
              {{ uiLabels.ChangeLanguage }}
          </button>

          <button v-if="hasActiveGroup" class="rejoin-button" @click="rejoinGroup">
              {{ uiLabels.BackToGroup }}
          </button>

        </div>
    </header>
   
    <div class="main-wrapper">
      <button class="menu-button start-new" @click="goToCreate"> 
            {{ uiLabels.StartNewGroup }}
      </button>
      
      <button class="menu-button join-group" @click="goToJoin">
          {{ uiLabels.JoinGroup }}
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
      socket: null,
      hasActiveGroup: null
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

  mounted() {
      this.checkActiveGroup();
  },

  methods: {
    switchLanguage: function() {
      if (this.lang === "en") this.lang = "sv";
      else this.lang = "en";
      localStorage.setItem("lang", this.lang);
      this.socket.emit("getUILabels", this.lang);
    },
  
    goToCreate() { 
      this.$router.push('/StartNewGroup/'); 
    },

    goToJoin() { 
      this.$router.push('/joingroup/'); 
    },

  checkActiveGroup() {
        const storedCode = sessionStorage.getItem("myGroupCode");
        if (storedCode && storedCode !== "null" && storedCode !== "undefined") {
            this.hasActiveGroup = storedCode;
        } else {
            this.hasActiveGroup = null;
        }
    },

  rejoinGroup() {
        if (this.hasActiveGroup) {
            this.$router.push('/grouppage/' + this.hasActiveGroup);}
    },
  }
}
</script>

<style>

</style>