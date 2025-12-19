<template>
    <header>
        <h1>{{ uiLabels.StartNewGroup }}</h1>
        <button v-on:click="ReturnToHomepage">  
            <router-link to='/'>{{ uiLabels.ReturnToHomepage}}</router-link>
        </button>
   
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
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
        }
    },
    created:function(){
        socket.on("groupCreated", (data)=> {

            this.$router.push('/administratorgrouppage/'+ data.groupCode);
        });
        socket.on( "uiLabels", labels => {
            this.uiLabels = labels;
            console.log(labels) ;
        });
        socket.emit( "getUILabels", this.lang );
    },
    methods:{
        CreateGroup:function () {
            if (!this.GroupName) {
                alert(this.uiLabels.PleaseEnterGroupName);
                return;
            }
            socket.emit("createGroup", {
                groupName: this.GroupName
            });
        },
    },

}
</script>

<style>

</style>