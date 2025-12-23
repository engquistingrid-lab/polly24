<template>
    <header>
        <h1>{{ uiLabels.JoinGroup }}</h1>
        <div class="header-buttons">
            <router-link to='/'>
                <button class="return-home-button"> 
                    {{ uiLabels.ReturnToHomepage}}
                </button>
            </router-link>
        </div>
    </header>

    <div class="main-wrapper">
        <div class="input-section">
            <h3>{{ uiLabels.EnterNameBox }}</h3>
                <input type="text" v-model="userName">
            <h3>{{ uiLabels.EnterYourCode }}</h3>
                <input type="text" v-model="groupCode">
        </div>

        <div class="wish-section">
            <h3>{{ uiLabels.YourWishes }}</h3>
                <input type="text" v-model="wish1">
                <input type="text" v-model="wish2">
                <input type="text" v-model="wish3"> 
        </div>

        <div>
            <button class="continue-button" v-on:click="Continue">
                {{ uiLabels.Continue}}
            </button>
        </div>
    </div>
</template>

<script>

import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("serverIP"));

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
        wish1: "",
        wish2: "",
        wish3: ""  
    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang )
     socket.on("joinedGroup", (data)=> {
        if (data.success) {
            console.log("You have joined the group");
            localStorage.setItem("myName", this.userName);
            this.$router.push('/grouppage/' + this.groupCode);
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
            if (!this.groupCode) {
                alert(this.uiLabels.PleaseEnterGroupCode);
                return;
            }
            if (!this.userName) {
                alert(this.uiLabels.PleaseEnterName);
                return;
            }
            socket.emit("joinGroup", {
                groupCode: this.groupCode,
                userName: this.userName,
                wish1: this.wish1,
                wish2: this.wish2,
                wish3: this.wish3
            });
        } 
}
}


</script>


<style>

</style>