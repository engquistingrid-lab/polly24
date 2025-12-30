<template>
    <header>
        <h1>{{ uiLabels.StartNewGroup }}</h1>
        <div class="header-buttons">
            <button class="return-home-button" @click="ReturnToHomepage">Hem</button>
        </div>
    </header>

    <div class="main-wrapper">
        <div class="input-section">
            <h3>Ditt namn (Du blir Admin):</h3>
            <input type="text" v-model="userName" placeholder="Namn">

            <h3>Gruppens namn:</h3>
            <input type="text" v-model="groupName" placeholder="Gruppnamn">
        </div>

        <div class="wish-section">
            <h3>Dina önskningar:</h3>
            <input type="text" v-model="wish1" placeholder="Önskning 1">
            <input type="text" v-model="wish2" placeholder="Önskning 2">
            <input type="text" v-model="wish3" placeholder="Önskning 3"> 
        </div>

        <div>
            <button class="create-button" @click="CreateGroup">
                Starta Grupp
            </button>
        </div>
    </div>
</template>

<script>
import socket from '@/socket';

export default{
    name:'StartNewGroup',
    data:function(){
        return{
            userName:"",
            groupName:"",
            wish1:"", wish2:"", wish3:"",
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
        }
    },
    created:function(){
        socket.on("uiLabels", labels => this.uiLabels = labels);
        socket.emit("getUILabels", this.lang);

        socket.on("groupCreated", (data)=> {
            localStorage.setItem("myName", this.userName);
            localStorage.setItem("myGroupCode", data.groupCode);
            this.$router.push('/grouppage/'+ data.groupCode);
        });
    },
    methods:{
        ReturnToHomepage() { this.$router.push('/'); },
        
        CreateGroup:function () {
            if (!this.groupName || !this.userName) {
                alert("Fyll i både ditt namn och gruppnamn!");
                return;
            }
            const wishes = [this.wish1, this.wish2, this.wish3].filter(w => w.trim() !== "");
            if (wishes.length === 0) {
                alert("Skriv minst en önskning!");
                return;
            }
            
            socket.emit("createGroup", {
                groupName: this.groupName,
                userName: this.userName, 
                wishes: wishes
            });
        }
    }
}
</script>

<style>

</style>