<template>
  
    <header>
        <h1>SECRET SANTA</h1>
        <div class="language-button-container">
          <button class="lang-button" v-on:click="switchLanguage">
              {{ uiLabels.ChangeLanguage }}
          </button>
        </div>
    </header>
   
    <div class="menu-buttons-container">
      <button class="menu-button" @click="goToCreate"> 
            {{ uiLabels.StartNewGroup}}
      </button>

      <button class="menu-button" @click="goToJoin">
          {{ uiLabels.JoinGroup}}
      </button>
      <img src="https://png.pngtree.com/png-vector/20240813/ourmid/pngtree-3d-merry-christmas-cartoon-character-santa-claus-png-image_13469615.png" alt="santa-claus" id="santa-claus-image"/> 
      <img src="https://i.pinimg.com/originals/a4/d5/30/a4d5308cdb356260d519aea72fdf1003.png" alt="christmas-tree" id="christmas-tree-image"/>
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
      myIp: "192.168.0.113", 
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
@import "../assets/base.css";
.menu-buttons-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px); /* Justera höjden så den inte krockar med headern */
  gap: 40px;
}

.menu-button {
  /* Se till att knappen har tillräcklig storlek för texten */
  min-width: 250px; 
  min-height: 150px;
  padding: 20px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-size: 1.5em;
  font-weight: bold;
  
  /* Din gradient */
  background: linear-gradient(30deg, var(--main-color-red), var(--main-color-light-red));
  color: var(--main-color-ivory); /* En mörk röd färg så texten syns mot det gula */
  
  border: none;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 0 15px var(--main-color-ivory);
}

#santa-claus-image {
  position: absolute;
  bottom: 10px;
  left: 10px;
  height: 250px;
}
#christmas-tree-image {
  position: absolute;
  bottom: 10px;
  right: 10px;
  height: 400px;
}
</style>