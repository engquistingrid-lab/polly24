<template>
    <header>
        <h1>Secret Santa</h1>
        <div>
          <button class="lang-button" v-on:click="switchLanguage">
              {{ uiLabels.ChangeLanguage }}
          </button>

          <button v-if="hasActiveGroup"  @click="rejoinGroup">
              {{ uiLabels.BackToGroup }}
          </button>

        </div>
    </header>
   
    <div class="menu-buttons-container">
      <button class="menu-button" @click="goToCreate"> 
            {{ uiLabels.StartNewGroup }}
      </button>
      
      <button class="menu-button" @click="goToJoin">
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
      myIp: "192.168.0.117", 
      socket: null,
      hasActiveGroup: null
    }
  },

  created() {
    const fullAddress = "http://" + this.myIp + ":3000";
    sessionStorage.setItem("serverIP", fullAddress);
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

<style scoped>

.menu-buttons-container {
  display: flex;
  flex-wrap: wrap;       
  justify-content: center;
  align-items: center;
  width: 100%;           
  margin: 0 auto;        
  min-height: calc(100vh - 80px); 
  padding: 20px;
  padding-bottom: 200px;
  box-sizing: border-box;
  position: relative;
}


.menu-button {
  
  width: clamp(200px, 40vw, 280px);
  height: 160px; 
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  font-weight: bold;
  background: linear-gradient(30deg, var(--main-color-red), var(--main-color-light-red));
  color: var(--main-color-ivory);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 10px 20px var(--shadow-color);
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 10;
}



  
@media (max-width: 700px) {

  .menu-button {
    width: 100%;
    max-width: 320px;
    height: 140px;
  }
  
  .menu-buttons-container {
    padding-bottom: 250px;
  }
}
</style>