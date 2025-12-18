<template>
    <header>
        <h1>{{ uiLabels.StartNewGroup }}</h1>
        <button v-on:click="ReturnToHomepage">  
            <router-link to='/'>{{ uiLabels.ReturnToHomepage}}</router-link>
        </button>
   
    </header>
    <div>
        <label>
            {{ uiLabels.EnterNameBox }}
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
        <router-link to='/administratorgrouppage/'>
            {{ uiLabels.CreateGroup }}
      </router-link>
    </button>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default{
    name:'AdministratorStart',
    components:{
        ResponsiveNav
    },
    data:function(){
        return{
            StartNewGroup:"",
            ChoosePriceRange:"",
            GroupName:"",
            CreateGroup:"",
            uiLabels: {},
            lang: localStorage.getItem( "lang") || "en",
        }
    },
    created:function(){
        socket.on( "uiLabels", labels => {
            this.uiLabels = labels;
            console.log(labels) ;
        });
        socket.emit( "getUILabels", this.lang );
    },
    methods:{
        CreateGroupFunction:function(){
            socket.emit("CreateGroup",{PriceRange:this.ChoosePriceRange,GroupName:this.GroupName});
        }
    },

}
</script>

<style>

</style>