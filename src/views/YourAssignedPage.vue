<template>
    <header>
        <router-link to='/'>
            <button class="return-home-button">
                {{ uiLabels.ReturnToHomepage }}
            </button>
        </router-link>
        <h1>Secret Santa</h1>  
    </header>

    <div class="main-wrapper">
        <h2>{{uiLabels.YourAssigned}}</h2>  
        <div class="assigned-section" v-if="assignedPerson"> 
            
            <div class="info-card">
                <h1 class="highlight">{{ assignedPerson.name }}</h1>
            </div>
            
            <div class="inspiration-box">
                <h4> {{ uiLabels.ExplainingText }} </h4>
                
                <h3>{{ uiLabels.Inspiration }}</h3>
                
                <ul v-if="inspirationList.length > 0">
                    <li v-for="wish in inspirationList" :key="wish" class="inspiration-item"> {{ wish }}</li>
                </ul>
                <p v-else class="inspiration-item">{{ uiLabels.NoInspiration }}</p>
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

<style scoped>
    .inspiration-item{
        color: rgb(199, 197, 197);

    }
    

    .inspiration-box {
    border: 2px solid pink;
    border-radius: 30px;
    background-color: var(--box-background-color);
    flex-grow: 1;
    }


    @media (max-width: 700px) {
     header {
    flex-direction: column; 
    height: auto;           
    padding-top: 20px;
    padding-bottom: 20px;
    gap: 15px;              
  }

    header h1 {
    position: static; 
    transform: none;
    font-size: 2.5rem; 
    order: 1
}

}

    
</style>