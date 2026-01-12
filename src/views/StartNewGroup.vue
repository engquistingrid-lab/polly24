<template>
    <header>
        <h1>{{ uiLabels.StartNewGroup }}</h1>
        <button @click="ReturnToHomepage">
            {{ uiLabels.ReturnToHomepage }}
        </button>
    </header>

    <div class="content-wrapper">

        <div>
            <h2>{{ uiLabels.EnterNameBox }}:</h2>
            <input class= "text-boxes" type="text" v-model="userName" :placeholder="uiLabels.YourName">

            <h2>{{ uiLabels.EnterGroupName }}:</h2>
            <input class= "text-boxes" type="text" v-model="groupName" :placeholder="uiLabels.EnterGroupName">
        </div>

        <div>
            <h2>{{ uiLabels.YourWishes }}</h2>
            <input class= "text-boxes" type="text" v-model="wish1" :placeholder="uiLabels.AddWishPlaceholder">
            <input class= "text-boxes" type="text" v-model="wish2" :placeholder="uiLabels.AddWishPlaceholder">
            <input class= "text-boxes" type="text" v-model="wish3" :placeholder="uiLabels.AddWishPlaceholder"> 
        </div>

        <p v-if="errorMessage" class="warning-text">{{ errorMessage }}</p>

        <div>
            <button class="create-button" @click="CreateGroup">
                {{ uiLabels.CreateGroup }}
            </button>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';

export default {
    name: 'StartNewGroup',
    data: function() {
        return {
            socket: null, // Vi sparar kopplingen här
            userName: "",
            groupName: "",
            wish1: "", wish2: "", wish3: "",
            errorMessage: "",
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en"
        }
    },
    created: function() {
        // 1. Hämta IP från minnet och anslut
        const serverUrl = sessionStorage.getItem("serverIP") || "http://localhost:3000";
        this.socket = io(serverUrl);

        // 2. Lyssna på events
        this.socket.on("uiLabels", labels => this.uiLabels = labels);
        this.socket.emit("getUILabels", this.lang);

        this.socket.on("groupCreated", (data) => {
            sessionStorage.setItem("myName", this.userName);
            sessionStorage.setItem("myGroupCode", data.groupCode);
            this.$router.push('/grouppage/' + data.groupCode);
        });
    },
    beforeUnmount() {
        // Stänger kopplingen snyggt när vi lämnar sidan
        if (this.socket) this.socket.disconnect();
    },
    methods: {
        ReturnToHomepage() { this.$router.push('/'); },
        
        CreateGroup: function() {
            if (!this.groupName || !this.userName) {
                this.errorMessage = this.uiLabels.PleaseEnterGroupName;
                return;
            }
            const wishes = [this.wish1, this.wish2, this.wish3].filter(w => w && w.trim() !== "");
            
            if (wishes.length === 0) {
                this.errorMessage = this.uiLabels.AddWish;
                return;
            }
            
            // Skicka via this.socket
            this.socket.emit("createGroup", {
                groupName: this.groupName,
                userName: this.userName, 
                wishes: wishes
            });
        }
    }
}
</script>


<style>

@import "../assets/base.css";

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

.create-button {
    width: 200px;
    height:60px;
    font-size: 1.5rem;
}

</style>