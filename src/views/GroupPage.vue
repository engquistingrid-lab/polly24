<template>
    <header>
        <h1>Secret Santa</h1>
        <div>
              <button class="lang-button" @click="switchLanguage">
              {{ uiLabels.ChangeLanguage }}
          </button>
            <router-link to='/'>
                <button>
                    {{ uiLabels.ReturnToHomepage}}
                </button>
            </router-link>
        </div>
    </header>

    <div class="page-wrapper">
    <div class="group-wrapper">
        <h1> {{ groupName }}</h1>
        <h3>{{ uiLabels.GroupIs }}: {{ groupCode }}</h3>
        <div class="member-list">
            <h3>{{ uiLabels.Members }}</h3>
            <h5>
            <ul>    
                <li v-for="member in members" :key="member.id || member.name">
                    {{ member.name }}
                    <span v-if="member.isAdmin" class="admin-tag"> (Admin)</span>
                </li>
            </ul>
            </h5>
        </div>
        </div>

        <div class="generate-santa-wrapper">
            <div class="admin-section" v-if="amIAdmin">
                <h5>{{ uiLabels.AdminPanel }}</h5>
                <h5>{{ uiLabels.AdminInstructions }}</h5>
                <h5>{{ uiLabels.ClickToStart }}</h5>
            
                <button class="generate-button" @click="generateSecretSanta" :disabled="members.length <2">
                    {{ uiLabels.Generate }}
                </button>

                <p v-if="members.length <2" class="warning-text">
                    {{ uiLabels.NeedAtLeastTwo }}
                </p>
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
        const serverUrl = sessionStorage.getItem("serverIP") || "http://localhost:3000";
        this.socket = io(serverUrl);

        this.socket.on("uiLabels", labels => this.uiLabels = labels);
        this.socket.emit("getUILabels", this.lang);

        this.socket.emit("getGroupInfo", {groupCode: this.groupCode});

        this.socket.on("uiLabels", labels => this.uiLabels = labels);
        this.socket.emit("getUILabels", this.lang);

        this.socket.on("groupInfo", (data)=>{
            if (data.success) {
                this.groupName = data.groupName;
                this.members = data.members || [];
                const me = this.members.find(m => m.name === this.myName);
                if (me && me.assignedTo) {
                    this.$router.push('/yourassignedpage/' + this.groupCode);} 
            }
        });

        this.socket.on("updateGame", (group) => {
             this.groupName = group.name;
             this.members = group.members || [];
        });

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
        },
        switchLanguage: function() {
      if (this.lang === "en") this.lang = "sv";
      else this.lang = "en";
      localStorage.setItem("lang", this.lang);
      this.socket.emit("getUILabels", this.lang);
    }
    }
}
</script>

<style>

.group-wrapper {
    border: 2px solid var(--border-color);
    border-radius: 30px;
    background-color: var(--box-background-color);
    flex-grow: 0;
    width: 99%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;

}

.generate-santa-wrapper {
    background-color: var(--box-background-color);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2px 10px;
    box-sizing: border-box;
    border-radius: 10px;
    line-height: 0.7;
    white-space: nowrap;
    box-sizing: border-box;
    max-width: fit-content;
    align-self: center;
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    height: 90vh; 
    padding: 20px;
    box-sizing: border-box;
    gap: 20px; 

}

.member-list {  
  display: inline-block; 
  background-color: var(--box-background-color-light);
  padding: 4px 8px;          
  border-radius: 6px;
  box-sizing: border-box;
  line-height: 1.2;              
  white-space: nowrap;       
  height: 300px;
  border: 2px solid var(--border-color);

}

.member-list ul {
    list-style: none;
}

.member-list li {
    border-bottom: 1px solid var(--border-color);
    text-align: center;
    margin-right: 40px;
}

.generate-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

</style>