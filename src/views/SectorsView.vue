<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Setores</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="setores.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <!--dialog 1-->
          <v-dialog persistent v-model="dialogView" max-width="800px">
            <v-card>
              <v-card-title class="bg-primary">
                <v-spacer></v-spacer>
                <span class="text-h5">{{ `Membros - ${sectors.name}` }}</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-list lines="one" :items="sectors.members" item-title="name" item-value="id"></v-list>
              <v-divider></v-divider>
              <v-card-actions class="bg-secondary d-flex justify-center">
                <v-btn color="primary" variant="tonal" @click="
                  dialogView = false
                  ">
                  Fechar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!--dialog 2 -->
          <v-dialog persistent v-model="dialogEdit" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="sectors = { ...defaultSector }"></v-btn>
            </template>
            <v-card>
              <v-card-title class="bg-primary">
                <v-spacer></v-spacer>
                <span class="text-h5">{{ formTitle }}</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" lazy-validation>
                    <v-row dense>
                      <v-col cols="12">
                        <v-text-field v-model="sectors.name" :rules="[
                          () => !!sectors.name || 'Nome é requerido!',
                        ]" label="Nome" :counter="120" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="sectors.abbr_name" label="Nome Abreviado" :rules="[
                          () => !(sectors.abbr_name !== null && sectors.abbr_name.length < 20) || 'Nome Abreviado maior que o suportado',
                        ]" :counter="20"></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-text-field v-model="sectors.code" label="Código da DGA" :rules="[
                          () =>
                            !!sectors.code ||
                            'Código da DGA é requerido!',
                        ]" :counter="20"></v-text-field>
                      </v-col>

                      <v-col cols="12">
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="blue-darken-1" variant="plain" @click="dialogEdit = false; initialize();">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="formSubmit">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Confirm delete -->
          <v-dialog v-model="sectorsDelete" max-width="420px">
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
                <v-btn color="blue-darken-1" variant="plain" @click="sectorsDelete = false">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="deleteSectorsConfirm">
                  Excluir
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Confirm delete -->
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.type="{ item }">
        {{ getTypeTitle(item.type) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.country_code="{ item }">
        {{ getCountryCodeTitle(item.country_code) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-btn variant="tonal" size="small" icon="mdi-dots-vertical" flat color="primary">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent" color="secondary">
            <v-list>
              <v-list-item prepend-icon="mdi-pencil" title="Editar" size="small"
                @click="editSectors(item)"></v-list-item>
              <v-list-item prepend-icon="mdi-delete" title="Excluir" size="small"
                @click="deleteSectors(item)"></v-list-item>
              <v-list-item prepend-icon="mdi-eye" title="Visualizar membros"
                @click="visualizeMembers(item)"></v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
      <template v-slot:no-data> Não há dados para exibir! </template>
    </v-data-table>
  </div>
</template>
  
  
<script>

export default {
  data: () => ({
    valid: false,
    dialogEdit: false,
    dialogView: false,
    sectorsDelete: false,
    tic: [
      {
        name: "Matheus Barbosa",
        id: 1,
      },
      {
        name: "Renato Tartori",
        id: 2,
      },
      {
        name: "Rafael Bellagama",
        id: 3,
      },
      {
        name: "Daniel",
        id: 4,
      },
    ],
    headers: [
      {
        title: "Nome",
        align: "start",
        key: "name",
      },
      { title: "Código da DGA", key: "code" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    sectors: [],
    itemsPeople: [],
    defaultSector: {
      id_: null,
      name: null,
      abbr_name: null,
      code: null,
      members: null,
      people_id: null,
    },
  }),

  created() {
    this.initialize();
    this.initializePeople()
  },

  computed: {
    formTitle() {
      return !this.sectors._id ? "Novo Setor" : "Editar Setor";
    },
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
        .get("sectors/")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    initializePeople() {
      this.$axios.get("people/").then((response) => {
        this.itemsPeople = response.data
      }).catch((error) => {
        console.error(error);
      });
    },
    editSectors(item) {
      this.sectors = item;
      this.dialogEdit = true;
    },

    deleteSectors(item) {
      this.sectors = item;
      this.sectorsDelete = true;
    },

    deleteSectorsConfirm() {
      this.$axios
        .delete("sectors/" + this.sectors._id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize();
            this.sectorsDelete = false;
            this.$toast.success(response.statusText);
          } else {
            this.$toast.error(response.statusText);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.sectors = this.defaultSector;
    },

    save() {
      if (this.sectors._id) {
        this.$axios
          .put("sectors/" + this.sectors._id, this.sectors)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.sectors = this.defaultSector;
              this.$toast.success(response.statusText);
              this.dialogEdit = false;
            } else {
              this.$toast.error(response.statusText);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.$axios
          .post("sectors/", this.sectors)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.sectors = this.defaultSector;
              this.$toast.success(response.statusText);
              this.dialogEdit = false;
            } else {
              this.$toast.error(response.statusText);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    visualizeMembers(item) {
      this.sectors = item;
      this.dialogView = true;
      this.sectors.members = this.tic
    },
  },
};
</script>

<style></style>