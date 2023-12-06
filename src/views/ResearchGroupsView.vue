<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Grupo de Pesquisa</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="grupo_de_pesquisa.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <v-dialog persistent v-model="dialog" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="researchGroup = { ...defaultResearchGroup }"></v-btn>
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
                    <v-col cols="12" md="8">
                      <v-text-field v-model="researchGroup.name" :rules="[
                        () => !!researchGroup.name || 'Nome é requerido!',
                        () => !(researchGroup.name.length > 60) || 'Nome maior que o suportado',
                      ]" label="Nome" :counter="60" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="researchGroup.abbr_name" label="Nome Abreviado" :rules="[
                        () => !(researchGroup.abbr_name.length > 20) || 'Nome Abreviado maior que o suportado',
                      ]" :counter="20"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-switch color="primary" v-model="researchGroup.removed" inset label="Extinto"></v-switch>
                    </v-col>
                    <v-col cols="12" md="10">
                      <v-text-field v-model="researchGroup.lattes_url" label="Página no Diretório da Plataforma Lattes"
                        :rules="[
                          () => !(researchGroup.lattes_url.length > 20) || 'Página no Diretório da Plataforma Lattes maior que o suportado',
                        ]" :counter="20"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="researchGroup.email" label="E-mail" :rules="[
                        (v) => /.+@.+\..+/.test(v) || 'E-mail inválido',
                      ]" :counter="20"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="researchGroup.site_url" label="Website" :counter="20"></v-text-field>
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
          <v-dialog v-model="researchGroupDelete" max-width="420px">
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
                <v-btn color="blue-darken-1" variant="plain" @click="researchGroupDelete = false">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="deleteGroupConfirm">
                  Excluir
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogMembers" width="auto" activator="parent">
            <v-card>
              <ResearchGroupsMembersView />
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="primary" variant="tonal" @click="dialogMembers = false; initialize();">
                  Sair
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.removed="{ item }">
        {{ getRemoved(item.raw.removed) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-btn variant="tonal" size="small" icon="mdi-dots-horizontal" flat color="primary">
          <v-icon>mdi-dots-horizontal</v-icon>
          <v-menu activator="parent" color="secondary">
            <v-list>
              <v-list-item prepend-icon="mdi-pencil" title="Editar" size="small"
                @click="editResearchGroup(item.raw)"></v-list-item>
              <v-list-item prepend-icon="mdi-delete" title="Excluir" size="small"
                @click="deleteGroup(item.raw)"></v-list-item>
              <v-list-item prepend-icon="mdi-account-multiple" title="Membros"
                @click="dialogMembers = true"></v-list-item>

            </v-list>
          </v-menu>
        </v-btn>
      </template>
      <template v-slot:no-data> Não há dados para exibir!</template>
    </v-data-table>
  </div>
</template>
  
  
<script>
import ResearchGroupsMembersView from '../views/ResearchGroupsMembersView.vue'
export default {
  components: {
    ResearchGroupsMembersView,
  },
  data: () => ({
    valid: false,
    dialog: false,
    researchGroupDelete: false,
    headers: [
      {
        title: "Nome",
        align: "start",
        key: "name",
      },
      { title: "Nome Abreviado", key: "abbr_name" },
      { title: "Extinto", key: "removed" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    researchGroup: {},
    dialogMembers: false,
    defaultResearchGroup: {
      id_: null,
      name: null,
      abbr_name: null,
      lattes_url: null,
      email: null,
      site_url: null,
    },
  }),

  computed: {
    formTitle() {
      return !this.researchGroup._id ? "Novo grupo de pesquisa" : "Editar grupo de pesquisa";
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
        .get("research-groups/")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editResearchGroup(item) {
      this.researchGroup = item;
      this.dialog = true;
    },

    deleteGroup(item) {
      this.researchGroup = item;
      this.researchGroupDelete = true;
    },

    deleteGroupConfirm() {
      this.$axios
        .delete("research-groups/" + this.researchGroup._id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize();
            this.researchGroupDelete = false;
            this.$toast.success(response.statusText);
          } else {
            this.$toast.error(response.statusText);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.researchGroup = this.defaultResearchGroup;
    },

    save() {
      if (this.researchGroup._id) {
        this.$axios
          .put("research-groups/" + this.researchGroup._id, this.researchGroup)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.researchGroup = this.defaultResearchGroup;
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
          .post("research-groups/", this.researchGroup)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.researchGroup = this.defaultResearchGroup;
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
    getRemoved(isRemoved) {
      return isRemoved ? 'Sim' : 'Não';
    }
  },
}
</script>
<style></style>
  