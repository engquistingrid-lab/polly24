<template>
    <header>
        <h1>{{ uiLabels.JoinGroup }}</h1>
        <div>
            <button class="lang-button" @click="switchLanguage">
                {{ uiLabels.ChangeLanguage }}
            </button>
            <button @click="ReturnToHomepage">
                {{ uiLabels.ReturnToHomepage }}
            </button>
        </div>
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

        <p v-if="errorMessage" class="warning-text">{{ errorMessage }}</p>

        <div>
            <button  class="join-button" @click="joinGame">
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
            userName: "",
            groupCode: "",
            wish1: "", wish2: "", wish3: "",
            errorMessage: ""
        }
    },

    created() {
        const serverUrl = sessionStorage.getItem("serverIP") || "http://localhost:3000";
        this.socket = io(serverUrl);
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
            
            if (!this.userName || !this.groupCode) {
                this.errorMessage = this.uiLabels.PleaseEnterGroupCode;
                return;
            }

            if ( wishes.length === 0) {
                this.errorMessage = this.uiLabels.AddWish;
                return;
            }

            this.socket.emit("joinGame", {
                groupCode: this.groupCode,
                userName: this.userName,
                wishes: wishes
            });
        },
        switchLanguage: function() {
            if (this.lang === "en") this.lang = "sv";
            else this.lang = "en";
            localStorage.setItem("lang", this.lang);
            this.socket.emit("getUILabels", this.lang);
        }
    }
}
</script>

<style scoped>


.content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    min-height: 80vh; 
    width: 100%;
    padding: 2rem;
    box-sizing: border-box;
}


.join-button {
    width: 250px;
    height:60px;
    font-size: 1.5rem;
}


</style>