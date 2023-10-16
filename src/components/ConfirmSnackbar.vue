<template>
    <v-snackbar v-model="snackbarModel" color="primary" :location="snackbarLocation" :timeout="-1">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <span class="white--text">{{ snackbarText }}</span>
        </v-col>
        <v-col cols="12" class="d-flex justify-end mt-2">
          <v-btn text  @click="cancel">
            Cancelar
          </v-btn>
          <v-btn text @click="confirm">
            Confirmar
          </v-btn>
        </v-col>
      </v-row>
    </v-snackbar>
  </template>
  
  <script>
  export default {
    name: "ConfirmSnackbar",
    props: {
      snackbarText: String,
      snackbarLocation: {
        type: String,
        default: "center",
      },
      modelValue: Boolean,
    },
    computed: {
      snackbarModel: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit("update:modelValue", value);
        },
      },
    },
    methods: {
      confirm() {
        this.snackbarModel = false;
        this.$emit("confirm");
      },
      cancel() {
        this.snackbarModel = false;
        this.$emit("cancel");
      },
    },
  };
  </script>
  
  <style scoped>
  .v-snack__wrapper {
    background-color: rgba(0, 0, 0, 0.7);
  }
  </style>
  