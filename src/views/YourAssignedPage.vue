<template>
    <main>
    <header>
        <router-link to='/'>{{ uiLabels.BackToHomePage }}</router-link>
            <h1>{{uiLabels.YourAssigned}}</h1>
            
    </header>

    <div> 
        <h1>Namnet du blev assigned</h1>
        <img src="/img/ElvinsGlad.jpeg" class="AssignedImg"></img>
        <router-link to="/wishlist">{{uiLabels.GoToWishList}}</router-link>
    </div>
    <div>Dina vänner tror NAMN vill ha detta i julklapp:
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
            name:"YourAssignedPage",
        data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en"
    }
   },
   created: function () {
     socket.on( "uiLabels", labels => this.uiLabels = labels );
     socket.emit( "getUILabels", this.lang )
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