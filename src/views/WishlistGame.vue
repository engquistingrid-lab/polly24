<template>
  <div class="game-container">
    <div class="game-header">
      
      <div class="header-left">
          <router-link to="/">
              <button class="nav-btn home-btn">Hem</button>
          </router-link>
          
          <router-link :to="'/yourassignedpage/' + groupCode">
              <button class="nav-btn santa-btn">🎅 Min Secret Santa</button>
          </router-link>
      </div>

      <div class="leaderboard-section">
        <h3>Topplista</h3>
        <ul>
            <li v-for="m in sortedMembers" :key="m.name">
                {{ m.name }}: {{ m.score || 0 }}%
            </li>
        </ul>
      </div>

      <div v-if="amIAdmin" class="admin-controls">
          <button @click="endGame" class="end-btn">AVSLUTA SPELET</button>
      </div>

    </div>

    <div class="main-game">
      <h1>Vem önskade vad?</h1>
      
      <div v-if="!gameIsOver">
          <p>Gissa vem som önskat vad i listan nedan!</p>
          
          <div class="wishes-grid">
            <div v-for="(wishItem, index) in wishes" :key="index" 
                 class="wish-card" 
                 :class="{ 'my-wish': wishItem.ownerName === myName }">
                
                <p class="wish-text">"{{ wishItem.text }}"</p>

                <div v-if="wishItem.ownerName === myName" class="own-tag">
                    (Din önskning)
                </div>

                <div v-else>
                    <select v-model="myGuesses[wishItem.text]" :disabled="hasSubmitted">
                        <option disabled value="">Välj person...</option>
                        <option v-for="member in otherMembers" :key="member.name" :value="member.name">
                            {{ member.name }}
                        </option>
                    </select>
                </div>
            </div>
          </div>

          <div class="actions">
              <button @click="sendGuesses" :disabled="hasSubmitted || !allGuessed" class="submit-btn">
                  {{ hasSubmitted ? 'Gissningar skickade!' : 'Skicka in gissningar' }}
              </button>
              
              <p v-if="!allGuessed && !hasSubmitted" style="color:red; font-weight:bold;">
                  Du måste gissa på alla (utom dina egna)!
              </p>
          </div>
      </div>

      <div v-else class="result-screen">
          <h2>Spelet är slut!</h2>
          <h1>🏆 Vinnaren är: {{ sortedMembers[0]?.name || 'Ingen' }}!</h1>
          
          <div class="result-list">
              <h3>Rätt svar:</h3>
              <ul>
                  <li v-for="wish in wishes" :key="wish.text">
                      "{{ wish.text }}" önskades av <strong>{{ wish.ownerName }}</strong>
                  </li>
              </ul>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
import socket from '@/socket';

export default {
  name: "WishlistGame",
  data() {
    return {
      groupCode: localStorage.getItem("myGroupCode"),
      myName: localStorage.getItem("myName"),
      members: [],
      wishes: [], // Håller alla önskningar
      myGuesses: {}, 
      hasSubmitted: false,
      gameIsOver: false
    };
  },
  computed: {
    sortedMembers() {
        return [...this.members].sort((a, b) => (b.score || 0) - (a.score || 0));
    },
    otherMembers() {
        return this.members.filter(m => m.name !== this.myName);
    },
    amIAdmin() {
        if(!this.members.length) return false;
        const me = this.members.find(m => m.name === this.myName);
        return me ? me.isAdmin : false;
    },
    allGuessed() {
        // Filtrera fram andras önskningar
        const othersWishes = this.wishes.filter(w => w.ownerName !== this.myName);
        if (othersWishes.length === 0) return true;
        
        // Kolla att vi har en gissning för varje
        return othersWishes.every(w => this.myGuesses[w.text]);
    }
  },
  created() {
    // Hämta info direkt när sidan laddas
    socket.emit("getGroupInfo", { groupCode: this.groupCode });

    // Ta emot uppdateringar (poäng, nya gissningar etc)
    socket.on("updateGame", (group) => {
        this.members = group.members || [];
        // Blanda önskningarna så man inte ser vem som är vem via ordningen
        if (group.wishes) {
            // Spara en blandad kopia om vi inte redan har laddat dem
            if(this.wishes.length === 0 || this.wishes.length !== group.wishes.length) {
                 this.wishes = [...group.wishes].sort(() => Math.random() - 0.5);
            }
        }
    });

    socket.on("gameEnded", () => {
        this.gameIsOver = true;
    });
  },
  methods: {
    sendGuesses() {
        socket.emit("submitGuesses", {
            groupCode: this.groupCode,
            userName: this.myName,
            guesses: this.myGuesses
        });
        this.hasSubmitted = true;
    },
    endGame() {
        if(confirm("Vill du avsluta spelet och visa rätt svar för alla?")) {
            socket.emit("endGame", { groupCode: this.groupCode });
        }
    }
  }
};
</script>

<style>

</style>