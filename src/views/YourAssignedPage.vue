<template>
    <main>
    <header>
        <router-link to='/'>{{ uiLabels.BackToHomePage }}</router-link>
            <h1>{{uiLabels.YourAssigned}}</h1>
            
    </header>

    <div v-if="assignedPerson"> 
        <div>
            <h1>{{ assignedPerson.name }}</h1>
            <img src="/img/ElvinsGlad.jpeg" class="AssignedImg"></img>
            <router-link to="/wishlist">{{uiLabels.GoToWishList}}</router-link>
        </div>

        <div>
        Dina vänner tror att {{ assignedPerson.name }} vill ha detta i julklapp:
           
        </div>
    </div>

     <div v-else>
        <p>Hämtar din hemliga vän...</p>
    </div>

</main>
</template>

<script>    
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("serverIP"));

export default {
    name: "YourAssignedPage",
    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            groupCode: this.$route.params.groupCode,
            myName: localStorage.getItem("myName"),
            members: [],
            assignedPerson: null
        }
    },
    created: function () {
        socket.on("uiLabels", labels => this.uiLabels = labels);
        socket.emit("getUILabels", this.lang);
        socket.emit("getGroupInfo", { groupCode: this.groupCode });

        socket.on("groupInfo", (data) => {
            if (data.success) {
                console.log("Medlemmar mottagna från server:", data.members); // DEBUG
                this.members = data.members;
                this.findMyAssigned();
            }
        });
    },
        beforeUnmount() {
            socket.off("groupInfo");
    },
   methods: {
        findMyAssigned: function() {
            // 1. Hitta mig själv i listan
            const me = this.members.find(m => m.name === this.myName);
            
            if (me && me.assignedTo) {
                // 2. Hitta personen jag ska ge till
                this.assignedPerson = this.members.find(m => m.name === me.assignedTo);
            }
        }
    }
}
</script>

<style scoped>

.AssignedImg {
    width: 300px;
    height: auto;
    border-radius: 10px;
    margin-top: 20px;
}
</style>