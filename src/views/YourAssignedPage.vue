<template>
    <main>
    <header>
        <router-link to='/'>{{ uiLabels.BackToHomePage }}</router-link>
            <h1>{{uiLabels.YourAssigned}}</h1>
            
    </header>

    <div> 
        <h1>{{ assignedPerson.name }}</h1>
        <img src="/img/ElvinsGlad.jpeg" class="AssignedImg"></img>
        <router-link to="/wishlist">{{uiLabels.GoToWishList}}</router-link>
    </div>

    <div>
        Dina vänner tror NAMN vill ha detta i julklapp:
        <ul>
            <li>Önskning 1</li>
            <li>Önskning 2</li>
            <li>Önskning 3</li>
        </ul>
    </div>

</main>
</template>

<script>    
import io from 'socket.io-client';
const socket = io("localhost:3000");

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
                this.findMyAssignment();
            }
        });
    },
   methods: {
        findMyAssignment: function() {
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