<template>
    <header>
        <h1>{{ uiLabels.StartNewGroup }}</h1>
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
            <h3>{{ uiLabels.EnterNameBox}}</h3>
                <input type="text" v-model="userName">
            <h3>{{ uiLabels.EnterGroupName }}</h3>
                <input type="text" v-model="groupName">
        </div>

        <div class="wish-section">
            <h3>{{ uiLabels.YourWishes }}</h3>
                <input type="text" v-model="wish1">
                <input type="text" v-model="wish2">
                <input type="text" v-model="wish3"> 
        </div>

        <div>
            <button class="create-button" v-on:click="CreateGroup">
                {{ uiLabels.CreateGroup }}
            </button>
        </div>
    </div>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("serverIP"));

export default{
    name:'StartNewGroup',
    components:{
        ResponsiveNav
    },
    data:function(){
        return{
            userName:"",
            groupName:"",
            wish1:"",
            wish2:"",
            wish3:"",
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
        }
    },
    created:function(){
        socket.on("groupCreated", (data)=> {

            this.$router.push('/grouppage/'+ data.groupCode);
        });
        socket.on( "uiLabels", labels => {
            this.uiLabels = labels;
            console.log(labels) ;
        });
        socket.emit( "getUILabels", this.lang );
    },
    methods:{
        CreateGroup:function () {
            if (!this.groupName || !this.userName) {
                alert(this.uiLabels.PleaseEnterGroupName);
                return;
            }
            if (!this.userName) {
                alert(this.uiLabels.PleaseEnterUserName);
                return;
            }
            if (!this.wish1 && !this.wish2 && !this.wish3) {
                alert(this.uiLabels.PleaseEnterWish);
                return;
            }
            
            localStorage.setItem("myName", this.userName);

            socket.emit("createGroup", {
                groupName: this.groupName,
                userName: this.userName,
                wishes: [this.wish1, this.wish2, this.wish3].filter(w => w.trim() !== "")
            });

        }
    },

}
</script>

<style>

</style>