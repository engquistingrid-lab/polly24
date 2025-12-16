<template>
    <header>
        <h1>{{ uiLabels.StartNewGroup }}</h1>
   
    </header>
     <div>
        <label>
        {{ uiLabels.PriceRange }}
            <input type="text" v-model="ChoosePriceRange">
        </label>
    </div>
    <div>
        <label>
            {{uiLabels.GroupName}}
            <input type="text" v-model="GroupName">
        </label> 
    </div>
    <button v-on:click="CreateGroupFunction">
            {{ uiLabels.CreateGroup }}
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
        socket.on("createGroupResponse", (result)=>{
            if(result.success){
                alert(this.uiLabels.GroupCreatedSuccessfully);
                this.$router.push('/AdministratorGroupPage/');
            } else {
                alert(this.uiLabels.GroupCreationFailed + ": " + result.message);
            }
        });
    },// + result.group.groupCode detta för att få fram gruppkoden
    methods:{
        CreateGroupFunction:function(){
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            socket.emit("CreateGroup",{
                email:currentUser.email,
                groupName:this.GroupName,
                priceRange:this.ChoosePriceRange});
        }
    },

}
</script>

<style>

</style>