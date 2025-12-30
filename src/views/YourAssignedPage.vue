<template>
    <header>
        <router-link to='/'>{{ uiLabels.BackToHomePage || 'Hem' }}</router-link>
        <h1>{{uiLabels.YourAssigned}}</h1>     
    </header>

    <div class="main-wrapper">
        <div class="assigned-section" v-if="assignedPerson"> 
            
            <div class="info-card">
                <h2>Du ska köpa julklapp till:</h2>
                <h1 class="highlight">{{ assignedPerson.name }}</h1>
                <img src="/img/ElvinsGlad.jpeg" class="AssignedImg">
            </div>
            
            <div class="inspiration-box">
                <h3>🔍 Inspiration</h3>
                <p>Här är vad andra tror att {{ assignedPerson.name }} önskat sig:</p>
                
                <ul v-if="inspirationList.length > 0">
                    <li v-for="wish in inspirationList" :key="wish">🎁 {{ wish }}</li>
                </ul>
                <p v-else style="font-style:italic;">Ingen har gissat på denna person i spelet än...</p>
            </div>

            <div style="margin-top: 30px;">
                <router-link to='/wishlist'>
                    <button class="game-btn"> 
                        {{uiLabels.GoToWishlist || 'Gå till Gissningsspelet'}}
                    </button>
                </router-link>
                <p>Gå hit för att gissa på vem som önskat vad!</p>
            </div>
        </div>

        <div v-else>
            <p>Laddar...</p>
        </div>
    </div>
</template>

<script>    
import socket from '@/socket';

export default {
    name: "YourAssignedPage",
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            groupCode: this.$route.params.groupCode,
            myName: localStorage.getItem("myName"),
            members: [],
            assignedPerson: null,
            inspirationList: []
        }
    },

    created: function () {
        socket.on("uiLabels", labels => this.uiLabels = labels);
        socket.emit("getUILabels", this.lang);
        socket.emit("getGroupInfo", { groupCode: this.groupCode });

        socket.on("groupInfo", (data) => {
            if (data.success) {
                this.members = data.members;
                this.findMyAssigned();
            }
        });

        // Ta emot inspiration
        socket.on("inspirationData", (data) => {
            this.inspirationList = data;
        });
    },
    methods: {
        findMyAssigned: function() {
            const me = this.members.find(m => m.name === this.myName);
            if (me && me.assignedTo) {
                this.assignedPerson = this.members.find(m => m.name === me.assignedTo);
                
                // Hämta inspiration
                socket.emit("getInspiration", { 
                    groupCode: this.groupCode, 
                    targetName: this.assignedPerson.name 
                });
            }
        }
    }
}
</script>

<style>

</style>