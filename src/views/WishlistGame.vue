<template>
    <div class="game-container">
        <div class="game-header"> 
            <div class="game-leaderboard">
                <h2>Topplista</h2>
                <ul>
                    <li v-for="(player, index) in sortedLeaderboard" v-bind:key="player.id">
                        #{{  index + 1 }} {{  player.name }} - {{ player.points }}p
                    </li>
                </ul>
            </div>
        </div>
    </div>

  <div style="padding: 50px;">
    <h1>Här är Secret Santa-spelet!</h1>
    <p>Om du ser detta så fungerar knappen.</p>
    <router-link to="/">Gå tillbaka till start</router-link>
  </div>
</template>

<script>
export default {
  name: 'WishlistGame'
}
</script>