<template>
    <header>
        <h2>Secret Santa</h2>
        <div class="header-buttons">
            <router-link to='/'>
                <button class="return-home-button">
                    {{ uiLabels.ReturnToHomepage}}
                </button>
            </router-link>
        </div>
        <h1>{{ uiLabels.Group }}: {{ groupName }}</h1>
        <h3>{{ uiLabels.GroupIs }}: {{ groupCode }}</h3>
    </header>

    <div class="main-wrapper">
        <div class="member-list">
            <h2>{{ uiLabels.MembersInLobby }}</h2>
            <ul>    
                <li v-for="member in members" :key="member.id || member.name">
                    {{ member.name }}
                    <span v-if="member.isAdmin" class="admin-tag"> (Admin)</span>
                </li>
            </ul>
        </div>

        <div class="admin-section" v-if="amIAdmin">
            <h3>👑 {{ uiLabels.AdminPanel }}</h3>
            <p>{{ uiLabels.AdminInstructions }}</p>
            <p>{{ uiLabels.ClickToStart }}</p>
            
            <button class="generate-button" @click="generateSecretSanta">
                {{ uiLabels.Generate }}
            </button>
        </div>
        
        <div v-else class="waiting-message">
            <h3>{{ uiLabels.WaitingForAdmin }}</h3>
            <p>{{ uiLabels.StayOnPage }}</p>
            <div class="spinner">🎁</div>
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
            myName: localStorage.getItem("myName") || "",
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
            }
        });

        // 5. Lyssna på när nya medlemmar går med
        this.socket.on("updateGame", (group) => {
             console.log("Uppdatering mottagen!", group);
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

</style>