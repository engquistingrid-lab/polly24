<template>
    <header>
        <h1>{{ uiLabels.StartNewGroup }}</h1>
         
            <router-link to='/'>
                <button> {{ uiLabels.ReturnToHomepage}}</button>
            </router-link>
        
   
    </header>
    <div>
        <label>
            {{ uiLabels.EnterNameBox}}
            <input type="text" v-model="UserName">
        </label>
        <label>
            {{ uiLabels.EnterGroupName }}
            <input type="text" v-model="GroupName">
        </label>


    </div>
    <div>
        <label>
            {{ uiLabels.YourWishes }}
            <input type="text" v-model="Wish1">
            <input type="text" v-model="Wish2">
            <input type="text" v-model="Wish3"> 
        </label>
    </div>
    <button v-on:click="CreateGroup">
            {{ uiLabels.CreateGroup }}
   
    </button>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default{
    name:'StartNewGroup',
    components:{
        ResponsiveNav
    },
    data:function(){
        return{
            UserName:"",
            GroupName:"",
            Wish1:"",
            Wish2:"",
            Wish3:"",
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
            if (!this.GroupName || !this.UserName) {
                alert(this.uiLabels.PleaseEnterGroupName);
                return;
            }
            if (!this.UserName) {
                alert(this.uiLabels.PleaseEnterUserName);
                return;
            }
            if (!this.Wish1 && !this.Wish2 && !this.Wish3) {
                alert(this.uiLabels.PleaseEnterWish);
                return;
            }
            
            localStorage.setItem("myName", this.UserName);

            socket.emit("createGroup", {
                groupName: this.GroupName,
                userName: this.UserName,
                wishes: [this.Wish1, this.Wish2, this.Wish3].filter(w => w.trim() !== "")
            });

        }
    },

}
</script>

<style>

</style>