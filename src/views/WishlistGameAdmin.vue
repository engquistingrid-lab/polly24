<template>
  <div class="game-container admin-theme"> <div class="game-header"> 
      
      <div class="game-leaderboard">
        <h2>{{ uiLabels.Leaderboard }}</h2>
        <ul>
          <li v-for="(player, index) in sortedLeaderboard" :key="player.id">
            #{{ index + 1 }} {{ player.name }} - {{ player.points }}p
          </li>
        </ul>
      </div>

      <div class="game-timer">
        <h3>{{ uiLabels.TimeState }} (Admin)</h3>
        <p class="timer-display">{{ formattedTime }}</p>
        
        <div class="admin-timer-controls">
            <div class="quick-buttons">
                <button @click="adjustTimer(-60)">-1 min</button>
                <button @click="togglePause">{{ isPaused ? '▶ Start' : '⏸ Paus' }}</button>
                <button @click="adjustTimer(60)">+1 min</button>
            </div>
            
            <div class="manual-set">
                <input type="number" v-model.number="manualTimeInput" placeholder="Sekunder">
                <button @click="setTimerManual">Sätt tid</button>
            </div>
        </div>
      </div>

      <div class="game-main">
        <h1>{{ uiLabels.Wishes }}</h1>

        <div class="wish-input">
          <input 
            v-model="newWishText"
            @keyup.enter="addWish"
            :placeholder="uiLabels.AddWishPlaceholder"
            :class="{ 'input-error': hasInputError }" 
          />
          <button @click="addWish">{{ uiLabels.AddWish }}</button>
        </div>

        <p v-if="errorMessage">{{ errorMessage }}</p>

        <div class="wish-list">
          <div
            v-for="wish in wishes"
            :key="wish.id"
            class="wish-guesseble"
            :class="{
              'my-wish': wish.userId === currentUserId, 
              'guessed-correct': wish.status === 'correct',
              'guessed-incorrect': wish.status === 'incorrect',
              'clickable': wish.userId !== currentUserId && wish.status === 'pending'
            }"
            @click="openGuessModal(wish)"> 
            <p>{{ wish.text }}</p>

            <span v-if="wish.status === 'correct'">🟢 {{ uiLabels.Correct }} ({{ wish.ownerName }})</span>
            <span v-if="wish.status === 'incorrect'">🔴 {{ uiLabels.Incorrect }}</span>
          </div>
        </div>
      </div>

      <div class="assigned-person">
        <h4>{{ uiLabels.Assigned }} {{ assignedPersonName }}</h4>
      </div>

      <div v-if="showModal" class="guess-maker-view">
        <div class="guess-banner">
          <h3>{{ uiLabels.WhosWish }} {{ selectedWish?.text }}?</h3>
          
          <div class="guess-options">
            <button 
              v-for="member in otherMembers"
              :key="member.id"
              class="member-button"
              :class="{ 'selected': selectedMemberId === member.id }"
              @click="selectedMemberId = member.id">
              {{ member.name }}
            </button>
          </div>

          <div class="guess-actions">
            <button @click="submitGuess" :disabled="!selectedMemberId">{{ uiLabels.Guess }}</button>
            <button @click="closeModal">{{ uiLabels.Cancel }}</button>
          </div>
        </div>
      </div>
                    
    </div>

    <div>
      <router-link to="/">{{ uiLabels.ReturnToHomepage }}</router-link>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: "WishlistGameAdmin", // Uppdaterat namn

  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      
      currentUserId: 1, // I ett riktigt scenario är admin kanske ID 0 eller liknande
      assignedPersonName: 'Elvin',
      
      members: [
          { id: 1, name: 'Elvin', points: 999 },
          { id: 2, name: 'Ida', points: 15 },
          { id: 3, name: 'Estelle', points: 8 },
          { id: 4, name: 'Linn', points: 12 },
          { id: 5, name: 'Ingrid', points: 20 }
      ],

      wishes: [
          { id: 101, text: 'Cykel', userId: 2, ownerName: 'Ida', status: 'pending' },
          { id: 201, text: 'Bok om Vue.js', userId: 3, ownerName: 'Estelle', status: 'pending' },
          { id: 301, text: 'Spelkonsol', userId: 4, ownerName: 'Linn', status: 'pending' }
      ],

      newWishText: '', 
      errorMessage: '',
      hasInputError: false,

      showModal: false, 
      selectedWish: null,
      selectedMemberId: null,

      // --- TIMER INSTÄLLNINGAR ---
      timeRemaining: 600, 
      manualTimeInput: null, // För admin-inputfältet
      isPaused: false, // För att kunna pausa
    };
  },

  computed: {
    sortedLeaderboard() {
      return [...this.members].sort((a, b) => b.points - a.points);
    },
    
    otherMembers() {
      return this.members.filter(m => m.id !== this.currentUserId);
    },

    formattedTime() {
      const m = Math.floor(this.timeRemaining / 60);
      const s = this.timeRemaining % 60;
      return `${m}:${s < 10 ? '0' + s : s}`;
    }
  },

  created: function () {
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.emit("getUILabels", this.lang);

    // Timer-loop
    setInterval(() => {
      if (!this.isPaused && this.timeRemaining > 0) {
        this.timeRemaining--;
        // Här kan du senare skicka tiden till servern så alla ser samma:
        // socket.emit("syncTimer", this.timeRemaining);
      }
    }, 1000);
  },

  methods: {
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      } else {
        this.lang = "en"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("getUILabels", this.lang);
    },

    // --- NYA ADMIN METODER ---
    
    // Lägg till eller dra bort tid (sekunder)
    adjustTimer(seconds) {
        this.timeRemaining += seconds;
        if (this.timeRemaining < 0) this.timeRemaining = 0;
        this.emitTimerUpdate();
    },

    // Sätt tiden exakt från input-fältet
    setTimerManual() {
        if (this.manualTimeInput !== null && this.manualTimeInput >= 0) {
            this.timeRemaining = this.manualTimeInput;
            this.manualTimeInput = null; // Rensa fältet
            this.emitTimerUpdate();
        }
    },

    // Pausa/Starta
    togglePause() {
        this.isPaused = !this.isPaused;
        // socket.emit("adminPauseTimer", this.isPaused);
    },

    // Hjälpfunktion för att meddela servern (förberett)
    emitTimerUpdate() {
        // socket.emit("adminUpdateTimer", this.timeRemaining);
        console.log("Admin ändrade tiden till: " + this.timeRemaining);
    },

    // --- BEFINTLIGA SPELMETODER ---
    addWish() {
      this.errorMessage = "";
      this.hasInputError = false;
      const text = this.newWishText.trim();

      if (text.length < 2) return;
    
      const regex = /^[a-zA-Z0-9 åäöÅÄÖ]*$/;
      if (!regex.test(text)) {
          this.triggerError(this.uiLabels.NoSpacielChars || "Inga specialtecken");
          return;
      }

      this.wishes.push({
          id: Date.now(),
          text: text,
          userId: this.currentUserId,
          ownerName: "Jag",
          status: 'pending'
      });
      this.newWishText = "";
    },

    triggerError(msg) {
        this.errorMessage = msg;
        this.hasInputError = true;
        setTimeout(() => { this.hasInputError = false; }, 500);
    },

    openGuessModal(wish) {
        if (wish.userId === this.currentUserId || wish.status !== 'pending') return;
        
        this.selectedWish = wish;
        this.selectedMemberId = null;
        this.showModal = true;
    },

    closeModal() {
        this.showModal = false;
        this.selectedWish = null;
    },

    submitGuess() {
        if (!this.selectedMemberId || !this.selectedWish) return;
      
        const isCorrect = this.selectedWish.userId === this.selectedMemberId;
        
        if (isCorrect) {
          this.selectedWish.status = 'correct';
          const me = this.members.find(m => m.id === this.currentUserId);
          if (me) me.points += 1;
        } else {
          this.selectedWish.status = 'incorrect';
        }
        this.closeModal();
    }
  } 
}; 
</script>
