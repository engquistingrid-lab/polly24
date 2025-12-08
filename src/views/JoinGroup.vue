<template>
    <header>
        <h1>{{ uiLabels.JoinGroup }}</h1>
        <button v-on:click="ReturnToHomepage">
            {{ uiLabels.ReturnToHomepage}}
        </button>
    </header>
    <div>
        <h3>{{ uiLabels.EnterYourCode }}</h3>
        <input type="text" v-model="groupCode">
        <button v-on:click="Continue">
            {{ uiLabels.Continue}}
        </button>
    </div>
</template>

<script>

import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000"); 

export default {
    name:"JoinGroup",
    components:{
        ResponsiveNav
    },

    data: function () {
    return {
        uiLabels: {},
        lang: localStorage.getItem("lang") || "en",
        JoinGroup:"",
        ReturnToHomepage:"",
        EnterYourCode:"",   
        Continue:"",
        groupCode: "",
    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang )
    },
    methods:{
        ReturnToHomepage:function(){
            this.$router.push('/');
        },
        Continue:function(){
            this.$router.push('/lobby/' + this.groupCode); 
        } 
}
}


</script>


<style>

</style>