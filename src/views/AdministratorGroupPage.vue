<template>

<header>
    <h1>Secret Santa</h1>
    <router-link to='/'>{{ uiLabels.BackToHomePage }}</router-link>
    <h3>{{ uiLabels.AdministratorGroupPage }}</h3>
    <h2>{{ uiLabels.GroupIs }} {{ groupCode }}, {{ uiLabels.ShareWith }}</h2>
    <h4>{{ uiLabels.Group }} {{ groupName }}</h4>
</header>

<div class="MembersWrapper">
    <div class="MembersList">
        <h2>{{ uiLabels.Members }}</h2>
        <ul>    
            <li v-for="member in members" :key="member.name">
                {{ member.name }}
            </li>
        </ul>
    </div>
    <div class="AllWishes">
        <h2>{{ uiLabels.AllWishes }}</h2>
        här ska alla önskningar visas 
        <button v-on:click="GoToGame">
        <router-link to='/wishlist/'>{{uiLabels.GoToGame}}</router-link>
        </button>
    </div>
    <div>
        <button v-on:click="youreassigned">
            <router-link to="/yourassignedpage">{{uiLabels.Generate}}</router-link>
        </button>
    <p>{{ uiLabels.OBSaboutGenerating }}</p>
    </div>
</div>

</template>

<script>    
import io from 'socket.io-client';
const socket = io("localhost:3000");
    export default {
            name:"AdministratorGroupPage",
        data: function () {
        return {
            groupCode: this.$route.params.groupCode,
            groupName: "",
            members: [],
            uiLabels: {},
            members: [],
            lang: localStorage.getItem("lang") || "en"
    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang );
     socket.emit("getGroupInfo", {groupCode: this.groupCode});
     socket.on("groupInfo", (data)=>{
        if (data.success) {
            this.groupName=data.groupName;
            this.members=data.members;
        }
        else {console.error(data.message)}
     });
    },
    beforeUnmount() {
        socket.off("groupInfo");
    }
}
</script>

<style scoped>
</style>