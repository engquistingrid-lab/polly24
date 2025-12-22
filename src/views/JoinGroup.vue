<template>
    <header>
        <h1>{{ uiLabels.JoinGroup }}</h1>
        <button v-on:click="ReturnToHomepage">
            <router-link to='/'>{{ uiLabels.ReturnToHomepage}}</router-link>
        </button>
    </header>
    <div>
        <h3>{{ uiLabels.EnterNameBox }}</h3>
        <input type="text" v-model="userName">
        <h3>{{ uiLabels.EnterYourCode }}</h3>
        <input type="text" v-model="groupCode">
        
    </div>
    <div>
        <label>
            {{ uiLabels.YourWishes }}
            <input type="text" v-model="Wish1">
            <input type="text" v-model="Wish2">
            <input type="text" v-model="Wish3"> 
        </label>
    </div>
    <div>
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
        groupCode: "",
        userName: "",
        Wish1: "",
        Wish2: "",
        Wish3: ""  
    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang )
     socket.on("joinedGroup", (data)=> {
        if (data.success) {
            console.log("You have joined the group");
            localStorage.setItem("myName", this.userName);
            this.$router.push('/participantgrouppage/' + this.groupCode);
        }
        else {
            console.error(data.message);
        }
     });
    },
    methods:{
        ReturnToHomepage:function(){
            this.$router.push('/');
        },
        Continue:function(){
            if (!this.groupCode || !this.userName) {
                alert(this.uiLabels.PleaseEnterGroupName);
                return;
            }
            socket.emit("joinGroup", {
                groupCode: this.groupCode,
                userName: this.userName,
                wish1: this.Wish1,
                wish2: this.Wish2,
                wish3: this.Wish3
            });
        } 
}
}


</script>


<style>

</style>