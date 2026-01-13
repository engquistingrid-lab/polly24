<template>
    <header>
        <h1>Secret Santa</h1>  
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
        <h1>{{ uiLabels.StartNewGroup }}</h1>
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
            <button class="create-button" @click="createGroup">
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
            socket: null, 
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            userName: "",
            groupName: "",
            wish1: "", wish2: "", wish3: "",
            errorMessage: ""
        }
    },

    created() {
        const serverUrl = sessionStorage.getItem("serverIP") || "http://localhost:3000";
        this.socket = io(serverUrl);
        this.socket.on("uiLabels", labels => this.uiLabels = labels);
        this.socket.emit("getUILabels", this.lang);
        this.socket.on("groupCreated", (data) => {
            sessionStorage.setItem("myName", this.userName);
            sessionStorage.setItem("myGroupCode", data.groupCode);
            this.$router.push('/grouppage/' + data.groupCode);
        });
    },

    beforeUnmount() {
        if (this.socket) this.socket.disconnect();
    },

    methods: {
        ReturnToHomepage() { this.$router.push('/'); },
        
        createGroup: function() {
            if (!this.groupName || !this.userName) {
                this.errorMessage = this.uiLabels.PleaseEnterGroupName;
                return;
            }
            const wishes = [this.wish1, this.wish2, this.wish3].filter(w => w && w.trim() !== "");
            
            if (wishes.length === 0) {
                this.errorMessage = this.uiLabels.AddWish;
                return;
            }
         
            this.socket.emit("createGroup", {
                groupName: this.groupName,
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

.create-button {
    width: 200px;
    height:60px;
    font-size: 1.5rem;
}

</style>