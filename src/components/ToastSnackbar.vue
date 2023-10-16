<template>
  <div>
    <v-snackbar
      v-model="snackbarModel"
      :color="snackbarColor"
      :timeout="snackbarTimeout"
      :location="snackbarLocation"
    >
      <v-row align="center">
        <v-col cols="10">
          <v-icon
            :icon="snackbarIcon"
            size="large"
            class="mr-2"
            :class="snackbarType === 'warning' ? 'icon-warning' : ''"
          ></v-icon>
          <span :style="snackbarType === 'warning' ? 'color: black;' : ''">{{ snackbarText }}</span>
        </v-col>
        <v-col cols="2" class="d-flex justify-end">
          
            <v-icon small @click="snackbarModel = false">mdi-close</v-icon>
          
        </v-col>
      </v-row>
    </v-snackbar>
     </div>
</template>

<script>
export default {
  name: "ToastSnackbar",
  props: {
    snackbarText: String,
    snackbarType: String,
    snackbarLocation: {
      type: String,
      default: "top right",
    },
    modelValue: Boolean,
  },
  data() {
    return {
      snackbarTimeout: 5000,
    };
  },
  computed: {
    snackbarColor() {
      if (this.snackbarType === "success") {
        return this.$vuetify.theme.themes.light.colors.fesuccess;
      } else if (this.snackbarType === "warning") {
        return this.$vuetify.theme.themes.light.colors.fewarning;
      } else if (this.snackbarType === "error") {
        return this.$vuetify.theme.themes.light.colors.feerror;
      }
      return "";
    },
    snackbarIcon() {
      if (this.snackbarType === "success") {
        return "mdi-check-circle-outline";
      } else if (this.snackbarType === "warning") {
        return "mdi-alert-circle-outline";
      } else if (this.snackbarType === "error") {
        return "mdi-close-circle-outline";
      }
      return "";
    },
    snackbarModel: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  watch: {
    snackbarText: "updateSnackbar",
    snackbarType: "updateSnackbar",
  },
};
</script>

<style scoped>
.icon-warning {
  color: black;
}
</style>
