<template>
    <header>
        <div>
              <button class="lang-button" v-on:click="switchLanguage">
              {{ uiLabels.ChangeLanguage }}
          </button>
            <router-link to='/'>
                <button>
                    {{ uiLabels.ReturnToHomepage}}
                </button>
            </router-link>
        </div>
        <h1>Secret Santa</h1>
        
    </header>

    <div class="page-wrapper">
    <div class="group-wrapper">
        <h1> {{ groupName }}</h1>
        <h3>{{ uiLabels.GroupIs }}: {{ groupCode }}</h3>
        <div class="member-list">
            <h2>{{ uiLabels.MembersInLobby }}</h2>
            <h4>
            <ul>    
                <li v-for="member in members" :key="member.id || member.name">
                    {{ member.name }}
                    <span v-if="member.isAdmin" class="admin-tag"> (Admin)</span>
                </li>
            </ul>
            </h4>
        </div>
        </div>

        <div class="generate-santa-wrapper">
            <div class="admin-section" v-if="amIAdmin">
                <h5>👑 {{ uiLabels.AdminPanel }}</h5>
                <h5>{{ uiLabels.AdminInstructions }}</h5>
                <h5>{{ uiLabels.ClickToStart }}</h5>
            
                <button class="generate-button" @click="generateSecretSanta">
                    {{ uiLabels.Generate }}
                </button>
            </div>
        
            <div v-else class="waiting-message">
                <h5>{{ uiLabels.WaitingForAdmin }}</h5>
                <h5>{{ uiLabels.StayOnPage }}</h5>
            </div>
        </div>
    </div>

   
</template>

<script>    
import io from 'socket.io-client';

export default {
    name: "GroupPage",
    data: function () {
        return {
            socket: null,
            groupCode: this.$route.params.groupCode,
            groupName: "",
            members: [], 
            myName: sessionStorage.getItem("myName") || "",
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en"
        }
   },
   computed: {
        amIAdmin() {
            if (!this.members || this.members.length === 0) return false;
            const me = this.members.find(m => m.name === this.myName);
            return me ? me.isAdmin : false;
        }
    },
    created: function () {
        // 1. Koppla upp mot servern (inuti created för att klara refresh)
        const serverUrl = sessionStorage.getItem("serverIP") || "http://localhost:3000";
        this.socket = io(serverUrl);

        // 2. Hämta språk
        this.socket.on("uiLabels", labels => this.uiLabels = labels);
        this.socket.emit("getUILabels", this.lang);

        // 3. Gå med i rummet
        this.socket.emit("getGroupInfo", {groupCode: this.groupCode});

        // 4. Ta emot grundinfo
        this.socket.on("groupInfo", (data)=>{
            if (data.success) {
                this.groupName = data.groupName;
                this.members = data.members || [];
                const me = this.members.find(m => m.name === this.myName);
                if (me && me.assignedTo) {
                    this.$router.push('/yourassignedpage/' + this.groupCode);} 
            }
        });

        // 5. Lyssna på när nya medlemmar går med
        this.socket.on("updateGame", (group) => {
             this.groupName = group.name;
             this.members = group.members || [];
        });

        // 6. När spelet startar -> Skicka vidare alla
        this.socket.on("secretSantaGenerated", () => {
            this.$router.push('/yourassignedpage/' + this.groupCode);
        });
    },
    beforeUnmount() {
        if(this.socket) this.socket.disconnect();
    },
    methods: {
        generateSecretSanta() {
            this.socket.emit("generateSecretSanta", { groupCode: this.groupCode });
        }
    }
}
</script>

<style>

@import "../assets/base.css";

.group-wrapper {
    border: 2px solid pink;
    border-radius: 30px;
    background-color: #4e8565;
    flex-grow: 1;

}

.generate-santa-wrapper {
    background-color: #4e8565;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 10px;
    box-sizing: border-box;
    border-radius: 10px;
    line-height: 1.4;
    white-space: nowrap;
    box-sizing: border-box;
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    height: 90vh; /* Tar hela skärmens höjd */
    padding: 20px;
    box-sizing: border-box;
    gap: 20px; 
}

@media (max-width: 700px) {
  
  /* 1. FIX FÖR HEADERN: Stapla rubrik och knapp på hög */
  header {
    flex-direction: column; /* Lägg dem under varandra */
    height: auto;           /* Låt headern växa på höjden */
    padding-top: 20px;
    padding-bottom: 20px;
    gap: 15px;              /* Luft mellan rubrik och knapp */
  }

  header h1 {
    /* Stäng av den absoluta positioneringen på mobil */
    position: static; 
    transform: none;
    
    /* Justera texten lite */
    font-size: 2.5rem; 
    order: 1; /* Se till att rubriken hamnar överst */
  }

.generate-santa-wrapper {
    margin-top: 90px;

}
}



</style>