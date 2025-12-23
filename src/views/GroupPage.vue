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
            <h1>{{ groupName }}</h1>
            <h3>{{ uiLabels.GroupIs }} {{ groupCode }}, {{ uiLabels.ShareWith }}</h3>
    </header>

    <div class="main-wrapper">
        <div class="member-section">
            <div class="member-list">
                <h2>{{ uiLabels.Members }}</h2>
                <ul>    
                    <li v-for="member in members" :key="member.name">
                        {{ member.name }}
                    </li>
                </ul>
            </div>
            
            <div class="all-wishes-list">
                <h2>{{ uiLabels.AllWishes }}</h2>
                <ul>
                    <template v-for="member in members" :key="member.name">
                        <li v-for="(wish, index) in member.wishes" :key="member.name + index">
                            {{ wish }}
                        </li>
                    </template>
                </ul>   
            </div>
        </div>

        <div class="button-section">
            <router-link to='/wishlist/'>
                <button class="game-button">
                    {{uiLabels.GoToGame}}
                </button>
            </router-link>
    
            <div v-if="amIAdmin">
                <button class="generate-button" v-on:click="generateSecretSanta">
                    {{uiLabels.Generate}}
                </button>
                <p>{{ uiLabels.ObsAboutGenerating }}</p>
            </div>

            <!-- <div v-if="!amIAdmin && myAssignment">
                <button v-on:click="goToAssignment">
                    {{uiLabels.YourAssigned}}
                </button>
            </div> -->

            <div v-else>
                <p>{{ uiLabels.WaitingForAdmin }}</p>
            </div>
        </div>
    </div>
</template>

<script>    
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("serverIP"));


    export default {
            name:"GroupPage",
        data: function () {
        return {
            groupCode: this.$route.params.groupCode,
            groupName: "",
            members: [],
            wishes: [],
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            myName: localStorage.getItem("myName") || ""
    }
   },

   computed: {
        amIAdmin() {
            const me = this.members.find(m => m.name === this.myName);
            return me ? me.isAdmin : false;
        },
        myAssignment() {
            const me = this.members.find(m => m.name === this.myName);
            return me ? me.assignedTo : null;
        }
    },
methods: {
        generateSecretSanta: function() {
            socket.emit("generateSecretSanta", { groupCode: this.groupCode });
            
        },
        goToAssignment: function() {
            this.$router.push('/yourassignedpage/' + this.groupCode);
        },

},
 created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );

     socket.emit( "getUILabels", this.lang );

     socket.emit("getGroupInfo", {groupCode: this.groupCode});

     socket.on("groupInfo", (data)=>{
        if (data.success) {
            this.groupName=data.groupName;
            this.members=data.members;
            this.wishes=data.wishes;
            console.log(this.wishes);
        }
        else {console.error(data.message)}
     });

     socket.on("secretSantaGenerated", (data)=> {
        this.$router.push('/yourassignedpage/' + this.groupCode);
     });

    },
    beforeUnmount() {
        socket.off("groupInfo");
    }
}
</script>

<style scoped>
</style>