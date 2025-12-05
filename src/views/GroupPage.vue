<template>
<header>
<h1>Group Page</h1>
</header>
<div class="ParticipantWrapper">
<div class="ParticipantList">
<h1>Gruppnamn</h1>
<h2>Medlemmar</h2>
<ul>    
    <li>Medlem 1</li>
    <li>Medlem 2</li>
    <li>Medlem 3</li>
</ul>
</div>
<button>Väntar på att administrör ska generera Secret Santa</button>
</div>

</template>

<script>    
import io from 'socket.io-client';
const socket = io("localhost:3000");
export default {
  name: 'AdministratorGroupPage'
}
</script>

<style scoped>
</style>