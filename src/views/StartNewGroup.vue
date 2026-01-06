<template>
    <header>
        <h1>{{ uiLabels.StartNewGroup || 'Start New Group' }}</h1>
        <div class="header-buttons">
            <button class="return-home-button" @click="ReturnToHomepage">
                {{ uiLabels.ReturnToHomepage || 'Hem' }}
            </button>
        </div>
    </header>

    <div class="main-wrapper">
        <div class="input-section">
            <h3>{{ uiLabels.EnterNameBox || 'Ditt namn' }} (Admin):</h3>
            <input type="text" v-model="userName" :placeholder="uiLabels.YourName || 'Namn'">

            <h3>{{ uiLabels.EnterGroupName || 'Gruppnamn' }}:</h3>
            <input type="text" v-model="groupName" :placeholder="uiLabels.EnterGroupName || 'Gruppnamn'">
        </div>

        <div class="wish-section">
            <h3>{{ uiLabels.YourWishes || 'Dina önskningar' }}:</h3>
            <input type="text" v-model="wish1" :placeholder="uiLabels.AddWishPlaceholder || 'Önskning 1'">
            <input type="text" v-model="wish2" :placeholder="uiLabels.AddWishPlaceholder || 'Önskning 2'">
            <input type="text" v-model="wish3" :placeholder="uiLabels.AddWishPlaceholder || 'Önskning 3'"> 
        </div>

        <div>
            <button class="create-button" @click="CreateGroup">
                {{ uiLabels.CreateGroup || 'Starta Grupp' }}
            </button>
        </div>
    </div>
</template>

<script>
import socket from '@/socket';

export default{
    name:'StartNewGroup',
    data:function(){
        return {
            userName: "",
            groupName: "",
            // HÄR FIXAR VI SYNTAXFELET (Varje variabel på egen rad):
            wish1: "", 
            wish2: "", 
            wish3: "",
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en"
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
                alert(this.uiLabels.PleaseEnterGroupName || "Fyll i namn och gruppnamn!");
                return;
            }
            const wishes = [this.wish1, this.wish2, this.wish3].filter(w => w && w.trim() !== "");
            
            if (wishes.length === 0) {
                alert(this.uiLabels.AddWish || "Skriv minst en önskning!");
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