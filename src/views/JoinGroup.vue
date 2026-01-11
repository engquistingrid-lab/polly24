<template>
    <header>
        <h1>{{ uiLabels.JoinGroup }}</h1>
        <button @click="ReturnToHomepage">
            {{ uiLabels.ReturnToHomepage }}
        </button>
    </header>

    <div class="content-wrapper">
        <div>
            <h3 >{{ uiLabels.EnterNameBox }}:</h3>
            <input class= "text-boxes" type="text" v-model="userName" :placeholder="uiLabels.YourName">
            
            <h3>{{ uiLabels.EnterYourCode }}:</h3>
            <input class= "text-boxes" type="text" v-model="groupCode" :placeholder="uiLabels.PleaseEnterGroupCode">
        </div>

        <div>
            <h3>{{ uiLabels.YourWishes }}</h3>
            <input class= "text-boxes" type="text" v-model="wish1" :placeholder="uiLabels.AddWishPlaceholder">
            <input class= "text-boxes" type="text" v-model="wish2" :placeholder="uiLabels.AddWishPlaceholder">
            <input class= "text-boxes" type="text" v-model="wish3" :placeholder="uiLabels.AddWishPlaceholder"> 
        </div>

        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

        <div>
            <button class="join-button" @click="joinGame">
                {{ uiLabels.JoinGroup }}
            </button>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';

export default {
    name: "JoinGroup",
    data() {
        return {
            socket: null,
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            groupCode: "",
            userName: "",
            wish1: "", wish2: "", wish3: "",
            errorMessage: ""
        }
    },
    created() {
        // 1. Hämta IP och anslut
        const serverUrl = sessionStorage.getItem("serverIP") || "http://localhost:3000";
        this.socket = io(serverUrl);

        // 2. Lyssna på events
        this.socket.on("uiLabels", labels => this.uiLabels = labels);
        this.socket.emit("getUILabels", this.lang);

        this.socket.on("joinedSuccess", (data) => {
            sessionStorage.setItem("myName", this.userName);
            sessionStorage.setItem("myGroupCode", this.groupCode);
            this.$router.push('/grouppage/' + this.groupCode);
        });

        this.socket.on("joinedError", (data) => {
            this.errorMessage = data.message;
        });
    },
    beforeUnmount() {
        if (this.socket) this.socket.disconnect();
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

            this.socket.emit("joinGame", {
                groupCode: this.groupCode,
                userName: this.userName,
                wishes: wishes
            });
        } 
    }
}
</script>

<style>
@import "../assets/main.css";

.content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    min-height: 80vh; /* Tar upp minst 80% av skärmhöjden */
    width: 100%;
    padding: 2rem;
    box-sizing: border-box;
}

.text-boxes {
    width: 300px;
    padding: 10px;
    margin: 10px 10px;
    font-size: 16px;
    border-color: var(main-color-text);
    border-radius: 10px;
}

.join-button {
    width: 200px;
    height:60px;
    font-size: 1.5rem;
}


</style>