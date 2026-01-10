<template>
  <div class="page-container">
    
    <header>
      <h1>Secret Santa</h1>
      
      <div class="header-buttons">
          <router-link to="/">
              <button>{{ uiLabels.ReturnToHomepage }}</button>
          </router-link>
          
          <button v-if="amIAdmin" @click="endGame" class="admin-btn">
              {{ uiLabels.EndGame }}
          </button>
      </div>
    </header>

    <div class="game-layout">

      <aside class="left-sidebar">
          <router-link :to="'/yourassignedpage/' + groupCode">
              <button class="santa-btn"> {{ uiLabels.YourAssignedShort }}</button>
          </router-link>
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

/* --- LAYOUT --- */
.page-container {
  min-height: 100vh;
}

.game-layout {
  display: grid;
  /* Vänster (Liten) - Mitten (Stor) - Höger (Liten) */
  grid-template-columns: 200px 1fr 250px;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  align-items: start;
}

/* --- TEXT & RUBRIKER --- */
.page-title {
  color: white; 
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  margin-top: 0;
}

.instruction-text {
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
}

/* --- MITTEN: ÖNSKNINGAR (GRID 2 KOLUMNER) --- */
.wishes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Tvingar fram 2 kolumner */
  gap: 20px;
  width: 100%;
}

/* KORTDESIGN */
.wish-card {
  background-color: var(--main-color-ivory); /* Ljus bakgrund */
  border: 2px solid var(--main-color-light-red);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wish-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--main-color-text); /* Mörk text så det syns */
  margin-bottom: 15px;
}

select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

/* --- KNAPPAR --- */
/* (Ärver röd färg från main.css "button", men vi säkrar upp här) */
.santa-btn {
  width: 100%;
  background-color: var(--main-color-light-red); /* Mörkröd */
}

.submit-game-btn {
  margin-top: 30px;
  padding: 15px 30px;
  font-size: 1.2rem;
  background-color: #27ae60; /* Grön för att skicka */
  color: white;
}

.submit-game-btn:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.warning-text {
  color: var(--main-color-red); /* Ljus röd text så det syns mot grön bakgrund */
  font-weight: bold;
  margin-top: 10px;
}

/* --- HÖGER: TOPPLISTA --- */
.leaderboard-card {
  /* Genomskinlig vit bakgrund som du bad om */
  background-color: rgba(255, 255, 255, 0.4); 
  border: 2px solid rgba(255,255,255, 0.6);
  border-radius: 10px;
  padding: 15px;
  color: white; /* Vit text på den mörka bakgrunden */
}

.leaderboard-card h3 {
  color: var(--main-color-gold); /* Guld för rubriken */
  margin-top: 0;
  border-bottom: 1px solid rgba(255,255,255,0.3);
  padding-bottom: 10px;
}

.leaderboard-card ul {
  list-style: none;
  padding: 0;
}

.leaderboard-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  font-weight: bold;
  color: white; /* Tvingar texten att vara vit */
}

/* --- RESULTATVY --- */
.result-screen {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 15px;
  color: var(--main-color-text);
}

.result-list {
  text-align: left;
  display: inline-block;
}

/* --- MOBILANPASSNING --- */
@media (max-width: 900px) {
  
  /* 1. HEADER FIX - Gör så att de staplas och inte krockar */
  header {
    flex-direction: column; /* Stapla på höjden */
    height: auto;
    padding: 20px;
    gap: 15px; /* Luft mellan text och knappar */
  }

  /* Återställ rubriken så den inte ligger "absolut" ovanpå allt */
  header h1 {
    position: static;
    transform: none;
    order: 1; /* Rubrik först */
    margin-bottom: 5px;
  }

  .header-buttons {
    order: 2; /* Knappar sen */
    width: 100%;
    justify-content: center;
  }

  /* 2. Layouten staplas på mobil */
  .game-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .wishes-grid {
    grid-template-columns: 1fr; /* 1 kolumn för korten på mobil */
  }

  /* Ordning: Spelet först, Topplista sen, Meny sist */
  .center-game-area { order: 1; }
  .right-sidebar { order: 2; }
  .left-sidebar { order: 3; }
}
</style>

