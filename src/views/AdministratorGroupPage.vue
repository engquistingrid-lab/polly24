<template>

<header>
    <router-link to="/homepage">{{ uiLabels.BackToHomePage }}</router-link>
    <h1>{{ uiLabels.AdministratorGroupPage }}</h1>
</header>

<div class="ParticipantWrapper">
    <div class="ParticipantList">
        <h1>{{ uiLabels.GroupName }}</h1>
        <h2>{{ uiLabels.Members }}</h2>
        <ul>    
            <li>Medlem 1</li>
            <li>Medlem 2</li>
            <li>Medlem 3</li>
        </ul>
    </div>
    <button v-on:click="youreassigned">
    <router-link to="/yourassignedpage">{{uiLabels.Generate}}</router-link>
    </button>
</div>

</template>

<script>    
import io from 'socket.io-client';
const socket = io("localhost:3000");
    export default {
            name:"AdministratorGroupPage",
        data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en"
    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang )
    }
}
</script>

<style scoped>
</style>