<template>
    <header>
        <h1>Secret Santa</h1>
        <button >
            Change to English
        </button>
        <button >
            Logga ut
        </button>
    </header>
   
    <div>
        <h1>Välkommen, Gruppnamn</h1>
        <button >
            Starta ny grupp
        </button>
        <button >
            Gå med i grupp
        </button>
        <button >
            Visa mina grupper
        </button>
    </div>

</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
    export default {
        name:"HomePage",

    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
        }
    }
    }


</script>

<style>

h1 {
    color:black;
}

</style>