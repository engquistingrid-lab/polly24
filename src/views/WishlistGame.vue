<template>
  <div class="game-container">
    <div class="game-header">
      
      <div class="header-left">
          <router-link to="/">
              <button class="nav-btn home-btn">{{ uiLabels.ReturnToHomepage }}</button>
          </router-link>
          
          <router-link :to="'/yourassignedpage/' + groupCode">
              <button class="nav-btn santa-btn">🎅 {{ uiLabels.YourAssignedShort }}</button>
          </router-link>
      </div>

      <div class="leaderboard-section">
        <h3>{{ uiLabels.Leaderboard }}</h3>
        <ul>
            <li v-for="m in sortedMembers" :key="m.name">
                {{ m.name }}: {{ m.score || 0 }}%
            </li>
        </ul>
      </div>

      <div v-if="amIAdmin" class="admin-controls">
          <button @click="endGame" class="end-btn">{{ uiLabels.EndGame }}</button>
      </div>

    </div>

    <div class="main-game">
      <h1>{{ uiLabels.WhoWishedWhat }}</h1>
      
      <div v-if="!gameIsOver">
          
          <p>{{ uiLabels.GuessInstructions }}</p>

          <div class="wishes-grid">
            <div v-for="(wishItem, index) in otherPeoplesWishes" :key="index" class="wish-card">
                
                <p class="wish-text">"{{ wishItem.text }}"</p>

                <div>
                    <select v-model="myGuesses[wishItem.text]" :disabled="hasSubmitted">
                        <option disabled value="">{{ uiLabels.ChoosePerson }}</option>
                        <option v-for="member in otherMembers" :key="member.name" :value="member.name">
                            {{ member.name }}
                        </option>
                    </select>
                </div>
            </div>
          </div>

          <div class="actions">
              <button @click="sendGuesses" :disabled="hasSubmitted || !allGuessed" class="submit-btn">
                  {{ hasSubmitted ? uiLabels.GuessesSubmitted : uiLabels.SubmitGuesses }}
              </button>
              
              <p v-if="!allGuessed && !hasSubmitted" style="color:red; font-weight:bold;">
                  {{ uiLabels.MustGuessAll }}
              </p>
          </div>
      </div>

      <div v-else class="result-screen">
          <h2>{{ uiLabels.GameEnded }}</h2>
          <h1>🏆 {{ uiLabels.WinnerIs }} {{ sortedMembers[0]?.name }}!</h1>

          <div class="result-list">
              <h3>{{ uiLabels.CorrectAnswers }}</h3>
              <ul>
                  <li v-for="wish in wishes" :key="wish.text">
                      "{{ wish.text }}" {{ uiLabels.WishedBy }} <strong>{{ wish.ownerName }}</strong>
                  </li>
              </ul>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: "WishlistGame",
  data() {
    return {
      socket: null,
      groupCode: sessionStorage.getItem("myGroupCode"),
      myName: sessionStorage.getItem("myName"),
      members: [],
      wishes: [], 
      myGuesses: {}, 
      hasSubmitted: false,
      gameIsOver: false,
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en"
    };
  },
  computed: {
    sortedMembers() {
        if (!this.members) return [];
        return [...this.members].sort((a, b) => (b.score || 0) - (a.score || 0));
    },
    otherPeoplesWishes() {
        return this.wishes.filter(w => w.ownerName !== this.myName);
    },
    otherMembers() {
        if (!this.members) return [];
        return this.members.filter(m => m.name !== this.myName);
    },
    amIAdmin() {
        if(!this.members || !this.members.length) return false;
        const me = this.members.find(m => m.name === this.myName);
        return me ? me.isAdmin : false;
    },
    allGuessed() {
        const othersWishes = this.wishes.filter(w => w.ownerName !== this.myName);
        if (othersWishes.length === 0) return true;
        return othersWishes.every(w => this.myGuesses[w.text]);
    }
  },
  created() {
    const serverUrl = sessionStorage.getItem("serverIP") || "http://localhost:3000";
    this.socket = io(serverUrl);

    this.socket.on("uiLabels", labels => this.uiLabels = labels);
    this.socket.emit("getUILabels", this.lang);

    this.socket.emit("getGroupInfo", { groupCode: this.groupCode });

    this.socket.on("updateGame", (group) => {
        this.members = group.members || [];
        if (group.wishes) {
            if(this.wishes.length === 0 || this.wishes.length !== group.wishes.length) {
                 this.wishes = [...group.wishes].sort(() => Math.random() - 0.5);
            }
        }
    });

    this.socket.on("gameEnded", () => {
        this.gameIsOver = true;
    });
  },
  beforeUnmount() {
      if(this.socket) this.socket.disconnect();
  },
  methods: {
    sendGuesses() {
        this.socket.emit("submitGuesses", {
            groupCode: this.groupCode,
            userName: this.myName,
            guesses: this.myGuesses
        });
        this.hasSubmitted = true;
    },
    endGame() {
        const msg = this.uiLabels.EndGameConfirm;
        if(confirm(msg)) {
            this.socket.emit("endGame", { groupCode: this.groupCode });
        }
    }
  }
};
</script>

<style scoped>

</style>

