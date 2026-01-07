<template>
    <header>
        <h2>Secret Santa</h2>
        <div class="header-buttons">
            <router-link to='/'>
                <button class="return-home-button">Hem</button>
            </router-link>
        </div>
        <h1>Grupp: {{ groupName }}</h1>
        <h3>Kod: {{ groupCode }}</h3>
    </header>

    <div class="main-wrapper">
        <div class="member-list">
            <h2>Deltagare i lobbyn:</h2>
            <ul>    
                <li v-for="member in members" :key="member.id || member.name">
                    {{ member.name }}
                    <span v-if="member.isAdmin"> (Admin)</span>
                </li>
            </ul>
        </div>

        <div class="admin-section" v-if="amIAdmin">
            <h3>👑 Admin Panel</h3>
            <p>Du styr spelet! Vänta tills alla vänner syns i listan ovan.</p>
            <p>När alla är med, klicka på knappen för att starta:</p>
            
            <button class="generate-button" @click="generateSecretSanta">
                Dela ut tomtar & Starta spelet
            </button>
        </div>
        
        <div v-else class="waiting-message">
            <h3>Väntar på att Admin ska starta spelet...</h3>
            <p>Stanna kvar på denna sida. Sidan uppdateras automatiskt.</p>
            <div class="spinner">🎁</div>
        </div>
    </div>
</template>

<script>    
import io from 'socket.io-client';
const serverUrl = sessionStorage.getItem("serverIP") || "http://localhost:3000";
const socket = io(serverUrl);

export default {
    name: "GroupPage",
    data: function () {
        return {
            groupCode: this.$route.params.groupCode,
            groupName: "",
            // Måste vara en tom lista från början för att undvika krasch
            members: [], 
            myName: localStorage.getItem("myName") || "",
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en"
        }
   },
   computed: {
        amIAdmin() {
            // Om listan inte laddat än, returnera false
            if (!this.members || this.members.length === 0) return false;

            const me = this.members.find(m => m.name === this.myName);
            return me ? me.isAdmin : false;
        }
    },
    created: function () {
        // 1. Gå med i rummet för att lyssna
        socket.emit("getGroupInfo", {groupCode: this.groupCode});

        // 2. Ta emot grundinfo
        socket.on("groupInfo", (data)=>{
            if (data.success) {
                this.groupName = data.groupName;
                this.members = data.members || []; // Skydd om det är tomt
            }
        });

        // 3. LYSSNA PÅ UPPDATERINGAR 
        socket.on("updateGame", (group) => {
             console.log("Uppdatering mottagen!", group);
             this.groupName = group.name;
             this.members = group.members || [];
        });

        // 4. Starta spelet
        socket.on("secretSantaGenerated", () => {
            this.$router.push('/yourassignedpage/' + this.groupCode);
        });
    },
    methods: {
        generateSecretSanta() {
            socket.emit("generateSecretSanta", { groupCode: this.groupCode });
        }
    }
}
</script>

<style>

</style>