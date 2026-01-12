<template>
  <div class="page-container">
    
    <header>
      <h1>Secret Santa</h1>
      
      <div class="header-buttons">
          <router-link to="/">
              <button>{{ uiLabels.ReturnToHomepage }}</button>
          </router-link>
      </div>
    </header>

    <div class="game-layout">

      <aside class="left-sidebar">
          <router-link :to="'/yourassignedpage/' + groupCode">
              <button class="santa-btn"> {{ uiLabels.YourAssignedShort }}</button>
          </router-link>

          <h4 class="InfoGame">{{ uiLabels.GameRules }}</h4>
      </aside>

      <main class="center-game-area">
        
        <h2 class="page-title">{{ uiLabels.WhoWishedWhat }}</h2>

        <div v-if="!gameIsOver">
            <p class="instruction-text">{{ uiLabels.GuessInstructions }}</p>

            <div class="wishes-grid">
              <div v-for="(wishItem, index) in otherPeoplesWishes" :key="index" class="wish-card">
                  
                  <div class="wish-content">
                    <p class="wish-text">{{ wishItem.text }}</p>
                  </div>

                  <div class="guess-section">
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
                <button @click="sendGuesses" :disabled="hasSubmitted || !allGuessed" class="submit-game-btn">
                    {{ hasSubmitted ? uiLabels.GuessesSubmitted : uiLabels.SubmitGuesses }}
                </button>
                
                <p v-if="!allGuessed && !hasSubmitted" class="warning-text">
                    {{ uiLabels.MustGuessAll }}
                </p>
            </div>
        </div>

        <div v-else class="result-screen">
            <h2>{{ uiLabels.GameEnded }}</h2>
            <h1> {{ uiLabels.WinnerIs }} {{ sortedMembers[0]?.name }}!</h1>
            
            <div class="result-list">
                <h3>{{ uiLabels.CorrectAnswers }}</h3>
                <ul>
                    <li v-for="wish in wishes" :key="wish.text">
                        <span>{{ wish.text }}</span> 
                        {{ uiLabels.WishedBy }} 
                        <strong>{{ wish.ownerName }}</strong>
                    </li>
                </ul>
            </div>
        </div>

      </main>

      <aside class="right-sidebar">
        <div class="leaderboard-card">
          <h3> {{ uiLabels.Leaderboard }}</h3>
          <ul>
              <li v-for="m in sortedMembers" :key="m.name" class="leaderboard-item">
                  <span>{{ m.name }}</span>
                  <span>{{ m.score || 0 }}%</span>
              </li>
          </ul>
        </div>

        <button v-if="amIAdmin" @click="endGame" class="admin-btn">
              {{ uiLabels.EndGame }}
          </button>
      </aside>

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
@import "../assets/main.css";
@import "../assets/base.css";

.game-layout {
  display: grid;
  grid-template-columns: 200px 1fr 250px;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  align-items: start;
}

.page-title, 
.instruction-text, 
.leaderboard-item, 
.result-screen h1 {
  color: white;
  text-shadow: 1px 1px 2px var(--text-shadow-color);
}

.leaderboard-card h3 {
  color: var(--main-color-gold);
  border-bottom: 1px solid var(--border-color);
  margin-top: 0;
  padding-bottom: 10px;
}

.wishes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.left-sidebar {
    border: var(--main-color-ivory) 2px solid;
    padding: 15px;
    border-radius: 15px;
    line-height: 1.2;
    background-color: var(--box-background-color-light);
}

.InfoGame {
    text-align: left;
    white-space: pre-wrap;
    color: var(--main-color-text);
}

.wish-card {
  background-color: var(--main-color-ivory);
  border: 2px solid var(--main-color-light-red);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px var(--shadow-color);
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wish-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--main-color-text);
  margin-bottom: 15px;
}

.leaderboard-card {
  background-color: var(--box-background-color-light);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  padding: 15px;
}

.leaderboard-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
}

.submit-game-btn {
  margin-top: 60px;
  padding: 15px 30px; 
  background-color: var(--submit-button-color); 
}

.submit-game-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}


.result-screen {
  background-color: var(--box-background-color);
  padding: 30px;
  border-radius: 15px;
  color: var(--main-color-text);
  border-color: var(--border-color);
}

.result-list {
  text-align: left;
  display: inline-block;
}

@media (max-width: 900px) {
  header {
    flex-direction: column;
    height: auto;
    gap: 15px;
  }

  header h1 {
    position: static;
    transform: none;
    order: 1;
  }
  
  .header-buttons { order: 2; }

  .game-layout { grid-template-columns: 1fr; }
  .wishes-grid { grid-template-columns: 1fr; }

  .center-game-area { order: 1; }
  .right-sidebar { order: 2; }
  .left-sidebar { order: 3; }
}
</style>
