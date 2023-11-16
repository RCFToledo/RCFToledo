<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Ações (Temas Relacionados)</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="ações.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <v-dialog persistent v-model="dialog" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="actionSubject = { ...defaultActionSubject }"></v-btn>
            </template>
            <v-card>
              <v-card-title class="bg-primary">
                <v-spacer></v-spacer>
                <span class="text-h5">{{ formTitle }}</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" lazy-validation>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field v-model="actionSubject.subject" :rules="[
                        () => !!actionSubject.subject || 'Tema é requerido',
                        () => !(actionSubject.subject.length > 60) || 'Tema maior que o suportado',
                      ]" label="Tema" :counter="60" required></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="blue-darken-1" variant="plain" @click="dialog = false; initialize();">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="formSubmit">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Confirm delete -->
          <v-dialog v-model="itemsDelete" max-width="420px">
            <v-card class="rounded-lg">
              <v-card-title class="bg-primary">
                Confirmar exclusão
              </v-card-title>
              <v-card-text class="text-body-1 text-md-center pa-4 ma-4">
                <v-icon icon="mdi-alert" size="large"></v-icon> Tem certeza que deseja
                excluir esse item?
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="bg-secondary d-flex justify-center">
                <v-btn color="blue-darken-1" variant="plain" @click="itemsDelete = false">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="deleteActionConfirm">
                  Excluir
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon title="Editar" size="small" class="me-2" @click="editActionSubject(item.raw)">mdi-pencil</v-icon>
        <v-icon title="Excluir" size="small" @click="deleteActionSubject(item.raw)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data> Não há dados para exibir!</template>
    </v-data-table>
  </div>
</template>


<script>
export default {
  data: () => ({
    valid: false,
    dialog: false,
    itemsDelete: false,
    headers: [
      {
        title: "Tema",
        align: "start",
        key: "subject",
      },
      { title: "Ações", align: "end", key: "actions", sortable: false }
    ],
    items: [],
    editedIndex: -1,
    actionSubject: {},
    relatedSubjectsItems: [],
    defaultActionSubject: {
      id_: null,
      subject: null,
    },
  }),


  computed: {
    formTitle() {
      return !this.actionSubject._id ? "Novo Tema" : "Editar Tema";
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    formSubmit() {
      this.$refs.form.validate().then((isValid) => {
        if (isValid.valid) {
          this.save();
        }
      });
    },
    initialize() {
      this.$axios
        .get("action-subjects/")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editActionSubject(item) {
      this.actionSubject = item;
      this.dialog = true;
    },

    deleteActionSubject(item) {
      this.actionSubject = item;
      this.itemsDelete = true;
    },

    deleteActionSubjectConfirm() {
      this.$axios
        .delete("action-subjects/" + this.actionSubject._id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize();
            this.itemsDelete = false;
            this.$toast.success(response.statusText);
          } else {
            this.$toast.error(response.statusText);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.actionSubject = this.defaultActionSubject;
    },

    save() {
      if (this.actionSubject._id) {
        this.$axios
          .put("action-subjects/" + this.actionSubject._id, this.actionSubject)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.actionSubject = this.defaultActionSubject;
              this.$toast.success(response.statusText);
              this.dialog = false;
            } else {
              this.$toast.error(response.statusText);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.$axios
          .post("action-subjects/", this.actionSubject)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.actionSubject = this.defaultActionSubject;
              this.$toast.success(response.statusText);
              this.dialog = false;
            } else {
              this.$toast.error(response.statusText);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
}
</script>
<style></style>
