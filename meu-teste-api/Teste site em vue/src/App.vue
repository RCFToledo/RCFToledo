<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="primary">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My files</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" permanent>
      <v-list nav>
        <v-list-item
          v-for="item in items"
          :key="item.value"
          :to="item.to"
          :title="item.title"
          :prepend-icon="item.icon"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center min-vh-100">
      <v-container class="fill-height d-flex justify-center align-center text-center">
        <RouterView />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue'

const items = [
  {
    title: 'Home',
    value: 'home',
    to: '/',
    icon: 'mdi-home'
  },
  {
    title: 'Rodrigo Roll 20',
    value: 'rodrigo',
    to: '/rodrigo',
    icon: 'mdi-account'
  },
  {
    title: 'Biomas',
    value: 'biomas',
    to: '/biomas',
    icon: 'mdi-account'
  }
]

const drawer = ref(true)
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
</style>