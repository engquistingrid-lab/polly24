<template>
    <header>
        <h1>{{ uiLabels.JoinGroup || 'Gå med i grupp' }}</h1>
        <div class="header-buttons">
            <button class="return-home-button" @click="ReturnToHomepage">
                {{ uiLabels.ReturnToHomepage || 'Hem' }}
            </button>
        </div>
    </header>

    <div class="main-wrapper">

        <div class="input-section">
            <h3>{{ uiLabels.EnterNameBox || 'Ditt namn' }}:</h3>
            <input type="text" v-model="userName" :placeholder="uiLabels.YourName || 'Namn'">
            
            <h3>{{ uiLabels.EnterYourCode || 'Gruppkod' }}:</h3>
            <input type="text" v-model="groupCode" :placeholder="uiLabels.PleaseEnterGroupCode || 'Kod'">
        </div>

        <div class="wish-section">
            <h3>{{ uiLabels.YourWishes || 'Dina önskningar' }}:</h3>
            <input type="text" v-model="wish1" :placeholder="uiLabels.AddWishPlaceholder || 'Önskning 1'">
            <input type="text" v-model="wish2" :placeholder="uiLabels.AddWishPlaceholder || 'Önskning 2'">
            <input type="text" v-model="wish3" :placeholder="uiLabels.AddWishPlaceholder || 'Önskning 3'"> 
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <div>
            <button class="continue-button" @click="joinGame" :disabled="!isConnected">
                {{ uiLabels.JoinGroup || 'GÅ MED' }}
            </button>
        </div>
    </div>
</template>

<script>
import socket from '@/socket';

export default {
    name: "JoinGroup",
    data() {
        return {
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            groupCode: "",
            userName: "",
            wish1: "", wish2: "", wish3: "",
            errorMessage: "",
            isConnected: false
        }
    },
    created() {
        // Hämta språk
        socket.on("uiLabels", labels => this.uiLabels = labels);
        socket.emit("getUILabels", this.lang);

        socket.on("connect", () => { 
            this.isConnected = true; 
            this.errorMessage = ""; 
        });
        
        socket.on("disconnect", () => { this.isConnected = false; });
        
        socket.on("connect_error", (err) => {
            console.log("Connection Error:", err);
            this.isConnected = false;
        });

        socket.on("joinedSuccess", (data) => {
            localStorage.setItem("myName", this.userName);
            localStorage.setItem("myGroupCode", this.groupCode);
            this.$router.push('/grouppage/' + this.groupCode);
        });

        socket.on("joinedError", (data) => {
            this.errorMessage = data.message;
        });
    },
    methods: {
        ReturnToHomepage() { this.$router.push('/'); },
        
        joinGame() {
            this.errorMessage = "";
            const wishes = [this.wish1, this.wish2, this.wish3].filter(w => w && w.trim() !== "");
            
            if (!this.groupCode || !this.userName || wishes.length === 0) {
                this.errorMessage = this.uiLabels.AddWish || "Fyll i alla fält!";
                return;
            }

            socket.emit("joinGame", {
                groupCode: this.groupCode,
                userName: this.userName,
                wishes: wishes
            });
        } 
    }
}
</script>

<style>

</style>