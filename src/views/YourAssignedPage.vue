<template>
    <header>
        <h1>Secret Santa</h1>  
        <router-link to='/'>
            <button>
                {{ uiLabels.ReturnToHomepage }}
            </button>
        </router-link>
    </header>

    <div>
        <h2>{{uiLabels.YourAssigned}}</h2>  
        <div v-if="assignedPerson"> 

            <div>
                <h1>{{ assignedPerson.name }}</h1>
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
                    <button> 
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
        color: var(--main-color-ivory);
    }
    
    .inspiration-box {
    border: 2px solid var(--border-color);
    border-radius: 30px;
    background-color: var(--box-background-color);
    flex-grow: 1;
    }

</style>