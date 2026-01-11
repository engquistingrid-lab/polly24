<template>
    <header>
        <router-link to='/'>
            <button class="return-home-button">
                {{ uiLabels.ReturnToHomepage }}
            </button>
        </router-link>
        <h1>{{uiLabels.YourAssigned}}</h1>     
    </header>

    <div class="main-wrapper">
        <div class="assigned-section" v-if="assignedPerson"> 
            
            <div class="info-card">
                <h1 class="highlight">{{ assignedPerson.name }}</h1>
            </div>
            
            <div class="inspiration-box">
                <h3>{{ uiLabels.Inspiration }}</h3>
                
                <ul v-if="inspirationList.length > 0">
                    <li v-for="wish in inspirationList" :key="wish"> {{ wish }}</li>
                </ul>
                <p v-else style="font-style:italic;">{{ uiLabels.NoInspiration }}</p>
            </div>

            <div style="margin-top: 30px;">
                <router-link to='/wishlist'>
                    <button class="game-btn"> 
                        {{uiLabels.GoToWishlist }}
                    </button>
                </router-link>
            </div>
        </div>

    </div>
</template>

<script>    
import io from 'socket.io-client';
const serverUrl = sessionStorage.getItem("serverIP") || "http://localhost:3000";
const socket = io(serverUrl);

export default {
    name: "YourAssignedPage",
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            groupCode: this.$route.params.groupCode,
            myName: sessionStorage.getItem("myName"),
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

        socket.on("inspirationData", (data) => {
            this.inspirationList = data;
        });
    },
    methods: {
        findMyAssigned: function() {
            const me = this.members.find(m => m.name === this.myName);
            if (me && me.assignedTo) {
                this.assignedPerson = this.members.find(m => m.name === me.assignedTo);
                
                socket.emit("getInspiration", { 
                    groupCode: this.groupCode, 
                    targetName: this.assignedPerson.name 
                });
            }
        }
    }
}
</script>

<style scooped>

    
</style>