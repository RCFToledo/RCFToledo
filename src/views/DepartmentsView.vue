<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Departamentos</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="departamentos.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <!--dialog 1-->
          <v-dialog persistent v-model="dialogView" max-width="800px">
            <v-card>
              <v-card-title class="bg-primary">
                <v-spacer></v-spacer>
                <span class="text-h5">{{ `Membros - ${departments.name}` }}</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-list lines="one" :items="departments.members" item-title="name" item-value="id"></v-list>
              <v-divider></v-divider>
              <v-card-actions class="bg-secondary d-flex justify-center">
                <v-btn color="primary" variant="tonal" @click="
                  dialogView = false
                  ">
                  Sair
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!--dialog 2 -->
          <v-dialog persistent v-model="dialogEdit" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="departments = { ...defaultDepartment }"></v-btn>
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
                        <v-text-field v-model="departments.name" :rules="[
                          () => !!departments.name || 'Nome é requerido!',
                        ]" label="Nome" :counter="120" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="departments.abbr_name" label="Nome Abreviado" :rules="[
                          () => !((departments.abbr_name !== null) && (!departments.abbr_name.length > 20)) || 'Nome Abreviado maior que o suportado',
                        ]" :counter="20"></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-text-field v-model="departments.code" label="Código da DGA" :rules="[
                          () =>
                            !!departments.code ||
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
          <v-dialog v-model="departmentsDelete" max-width="420px">
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
                <v-btn color="blue-darken-1" variant="plain" @click="departmentsDelete = false">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="deleteDepartmentsConfirm">
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
        {{ getTypeTitle(item.raw.type) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.country_code="{ item }">
        {{ getCountryCodeTitle(item.raw.country_code) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
          <v-btn variant="tonal" size="small" icon="mdi-dots-horizontal" flat color="primary">
          <v-icon>mdi-dots-horizontal</v-icon>
          <v-menu activator="parent" color="secondary">
            <v-list>
            <v-list-item prepend-icon="mdi-pencil" title="Editar" size="small" @click="editDepartments(item.raw)"></v-list-item>
            <v-list-item prepend-icon="mdi-delete" title="Excluir" size="small" @click="deleteDepartments(item.raw)"></v-list-item>
            <v-list-item prepend-icon="mdi-eye" title="Visualizar membros" @click="visualizeMembers(item.raw)"></v-list-item>
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
    departmentsDelete: false,
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
      { title: "Nome Abreviado", key: "abbr_name" },
      { title: "Código da DGA", key: "code" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    departments: [],
    itemsPeople: [],
    defaultDepartment: {
      id_: null,
      name: null,
      abbr_name: null,
      code: null,
      members: null,
    },
  }),

  created() {
    this.initialize();
    this.initializePeople()
  },

  computed: {
    formTitle() {
      return !this.departments._id ? "Novo Departamento " : "Editar Departamento";
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
        .get("departments/")
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
      })
    },
    editDepartments(item) {
      this.departments = item;
      this.dialogEdit = true;
    },

    deleteDepartments(item) {
      this.departments = item;
      this.departmentsDelete = true;
    },

    deleteDepartmentsConfirm() {
      this.$axios
        .delete("departments/" + this.departments._id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize();
            this.departmentsDelete = false;
            this.$toast.success(response.statusText);
          } else {
            this.$toast.error(response.statusText);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.departments = this.defaultDepartment;
    },

    save() {
      if (this.departments._id) {
        this.$axios
          .put("departments/" + this.departments._id, this.departments)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.departments = this.defaultDepartment;
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
          .post("departments/", this.departments)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.departments = this.defaultDepartment;
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
      this.departments = item;
      this.dialogView = true;
      this.departments.members = this.tic
    },

  },
};
</script>

<style></style>