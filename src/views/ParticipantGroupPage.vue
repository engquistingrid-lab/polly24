<template>

<header>
    <h1>Secret Santa</h1>
    <router-link to='/'>{{ uiLabels.BackToHomePage }}</router-link>
    <h1>{{ uiLabels.ParticipantGroupPage }}</h1>
</header>

<div class="ParticipantWrapper">
    <div class="ParticipantList">
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
<p>{{ uiLabels.WaitingForAdmin }}</p>
</div>

</template>

<script>    
import io from 'socket.io-client';
const socket = io("localhost:3000");
    export default {
            name:"ParticipantGroupPage",
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

<style >
</style>