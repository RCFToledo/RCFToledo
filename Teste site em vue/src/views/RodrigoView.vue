<template>
  <v-container class="py-6">
    <!-- 1. FILEIRA DE CARDS SUPERIOR -->
    <v-row class="mb-6">
      <!-- Card 1: Props -->
      <v-col cols="12" md="4">
        <v-card
          title="This is a title"
          subtitle="This is a card subtitle"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!"
          elevation="2"
        ></v-card>
        <div class="text-center text-caption mt-2">Using Props Only</div>
      </v-col>

      <!-- Card 2: Slots -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <template v-slot:title>This is a title</template>
          <template v-slot:subtitle>This is a card subtitle</template>
          <template v-slot:text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!
          </template>
        </v-card>
        <div class="text-center text-caption mt-2">Using Slots Only</div>
      </v-col>

      <!-- Card 3: Markup -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-item>
            <v-card-title>This is a title</v-card-title>
            <v-card-subtitle>This is a card subtitle</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!
          </v-card-text>
        </v-card>
        <div class="text-center text-caption mt-2">Using Markup Only</div>
      </v-col>
    </v-row>

    <v-divider class="my-8"></v-divider>

    <!-- 2. ÁREA DO DADO CENTRALIZADO LOGO ABAIXO -->
    <v-row justify="center">
      <v-col cols="12" class="d-flex flex-column align-center">
        <!-- Card do Dado Sorteado -->
        <div class="dice-card-container mb-6">
          <div :class="['dice-display', `shape-d${selectedSides}`, { rolling: isRolling }]">
            <span class="dice-label">d{{ selectedSides }}</span>
            <span class="dice-value">{{ diceValue }}</span>
          </div>
        </div>

        <!-- Botões de Formatos dos Dados -->
        <div class="dice-selector-container">
          <button 
            v-for="sides in diceTypes" 
            :key="sides" 
            @click="rollDice(sides)" 
            :disabled="isRolling"
            :class="['btn-dice', `shape-d${sides}`, { active: selectedSides === sides }]"
          >
            <span>d{{ sides }}</span>
          </button>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const diceTypes = [4, 6, 8, 10, 12, 20]
const selectedSides = ref(6)
const diceValue = ref(1)
const isRolling = ref(false)

const rollDice = (sides) => {
  if (isRolling.value) return

  selectedSides.value = sides
  isRolling.value = true

  setTimeout(() => {
    diceValue.value = Math.floor(Math.random() * sides) + 1
    isRolling.value = false
  }, 600)
}
</script>

<style scoped>
/* Estilos do Dado Central */
.dice-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}

.dice-display {
  width: 130px;
  height: 130px;
  background-color: #42b883;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.6s ease-out;
}

.dice-label {
  font-size: 14px;
  font-weight: bold;
  opacity: 0.85;
}

.dice-value {
  font-size: 44px;
  font-weight: bold;
}

.dice-display.rolling {
  animation: spin 0.6s ease-in-out;
}

/* Seletor de Botões */
.dice-selector-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  align-items: center;
  max-width: 400px;
}

.btn-dice {
  width: 54px;
  height: 54px;
  border: none;
  background-color: #35495e;
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.15s ease;
}

.btn-dice.active {
  background-color: #42b883;
}

.btn-dice:hover:not(:disabled) {
  transform: translateY(-3px);
  filter: brightness(1.15);
}

.btn-dice:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Formatos Geométricos (clip-path) */
.shape-d4 { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
.shape-d6 { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); border-radius: 8px; }
.shape-d8 { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
.shape-d10 { clip-path: polygon(50% 0%, 100% 35%, 50% 100%, 0% 35%); }
.shape-d12 { clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); }
.shape-d20 { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }

</style>