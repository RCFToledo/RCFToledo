<template>
  <v-card
    class="mx-auto"
    width="300"
  >
    <v-img
      height="200px"
      src="https://marketplace.canva.com/qRjlg/MAG7-3qRjlg/1/tl/canva-MAG7-3qRjlg.jpg"
      cover
    ></v-img>

    <v-card-title>
      Praia
    </v-card-title>

    <v-card-subtitle>
      Caribe
    </v-card-subtitle>

    <v-card-actions class="justify-center">
  <v-btn
    :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    @click="show = !show"
  ></v-btn>
</v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          32 graus celsius
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
  <v-card
    class="mx-auto"
    width="300"
  >
    <v-img
      height="200px"
      src="https://png.pngtree.com/thumb_back/fh260/background/20230926/pngtree-a-mountain-with-a-cloud-over-it-that-looks-like-a-image_13365286.jpg"
      cover
    ></v-img>

    <v-card-title>
      Montanhas
    </v-card-title>

    <v-card-subtitle>
      China
    </v-card-subtitle>

    <v-card-actions class="justify-center">
  <v-btn
    :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    @click="show = !show"
  ></v-btn>
</v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          -3 graus celsius
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
  <v-card
    class="mx-auto"
    width="300"
  >
    <v-img
      height="200px"
      src="https://marketplace.canva.com/MADaqDMKHms/1/thumbnail_large-1/canva-floresta-verde-MADaqDMKHms.jpg"
      cover
    ></v-img>

    <v-card-title>
      Floresta
    </v-card-title>

    <v-card-subtitle>
      Brasil
    </v-card-subtitle>

    <v-card-actions class="justify-center">
  <v-btn
    :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    @click="show = !show"
  ></v-btn>
</v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          26 graus celsius
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script setup>
  import { ref } from 'vue'

  const show = ref(false)
</script>