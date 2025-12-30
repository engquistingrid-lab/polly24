<template>
    <header>
        <h1>Gå med i grupp</h1>
        <div class="header-buttons">
            <button class="return-home-button" @click="ReturnToHomepage">Hem</button>
        </div>
    </header>

    <div class="main-wrapper">

        <div class="input-section">
            <h3>Ditt namn:</h3>
            <input type="text" v-model="userName" placeholder="Namn">
            
            <h3>Gruppkod:</h3>
            <input type="text" v-model="groupCode" placeholder="Kod">
        </div>

        <div class="wish-section">
            <h3>Dina önskningar:</h3>
            <input type="text" v-model="wish1" placeholder="Önskning 1">
            <input type="text" v-model="wish2" placeholder="Önskning 2">
            <input type="text" v-model="wish3" placeholder="Önskning 3"> 
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <div>
            <button class="continue-button" @click="joinGame" :disabled="!isConnected">
                GÅ MED
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
            groupCode: "",
            userName: "",
            wish1: "", wish2: "", wish3: "",
            errorMessage: "",
            isConnected: false
        }
    },
    created() {
        socket.on("connect", () => { 
            this.isConnected = true; 
            this.errorMessage = ""; 
        });
        
        socket.on("disconnect", () => { this.isConnected = false; });
        
        socket.on("connect_error", (err) => {
            console.log("Connection Error:", err);
            this.isConnected = false;
        });

        // LYCKAT
        socket.on("joinedSuccess", (data) => {
            console.log("Success!", data);
            localStorage.setItem("myName", this.userName);
            localStorage.setItem("myGroupCode", this.groupCode);
            this.$router.push('/grouppage/' + this.groupCode);
        });

        // MISSLYCKAT (t.ex. fel kod)
        socket.on("joinedError", (data) => {
            console.log("Error:", data);
            this.errorMessage = data.message;
        });
    },
    methods: {
        ReturnToHomepage() { this.$router.push('/'); },
        
        joinGame() {
            this.errorMessage = "";
            const wishes = [this.wish1, this.wish2, this.wish3].filter(w => w && w.trim() !== "");
            
            if (!this.groupCode || !this.userName || wishes.length === 0) {
                this.errorMessage = "Fyll i namn, kod och minst en önskning!";
                return;
            }

            console.log("Skickar förfrågan till servern...");
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