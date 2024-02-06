<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1" :page="currentPage" :items-per-page="configPagination.per_page">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Departamentos</v-toolbar-title>
          <v-spacer></v-spacer>
          <ExportCSV url="https://test-people.fe.unicamp.br/api/departments" name="departamentos" :lastPage="configPagination.last_page" />
          <!--dialog 1-->
          <v-dialog persistent v-model="dialogView" max-width="800px">
            <v-card>
              <v-card-title class="bg-primary">
                <v-spacer></v-spacer>
                <span class="text-h5">{{ `Membros - ${departments.name}` }}</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-list v-if="Object.keys(departments.members).length > 0">
              <v-list-item v-for="(member, index) in departments.members" :key="index" :value="member.id">
                  <v-list-item-title>{{member.full_name}}</v-list-item-title>
              </v-list-item>
              </v-list>
              <v-list v-else>
                <v-list-item>
                  <v-list-item-title>Não há membros</v-list-item-title>
              </v-list-item>
              </v-list>
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
                          () => !!departments.abbr_name || 'Nome Abreviado requerido',
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
                <v-btn color="blue-darken-1" variant="plain" @click="dialogEdit = false; initialize(currentPage);">
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
                @click="editDepartments(item)"></v-list-item>
              <v-list-item prepend-icon="mdi-delete" title="Excluir" size="small"
                @click="deleteDepartments(item)"></v-list-item>
              <v-list-item prepend-icon="mdi-eye" title="Visualizar membros"
                @click="initializeMembers(item.id, item.name)"></v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
      <template v-slot:bottom>
        <v-footer flat color="secondary">
          <v-spacer></v-spacer>
          <p style="margin-right: 1vw">total de itens: <strong>{{ configPagination.total }}</strong></p>
          <p>Itens na página: <strong>{{ items.length }}</strong></p>
          <v-pagination rounded="circle" show-first-last-page :length="configPagination.last_page" :total-visible="1" v-model="currentPage"
            @next="initialize(currentPage)" @prev="initialize(currentPage)" @first="initialize(1)"
            @last="initialize(configPagination.last_page)">
          </v-pagination>
        </v-footer>
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
    currentPage: 1,
    configPagination: [],
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
      id: null,
      name: null,
      abbr_name: null,
      code: null,
      members: null,
    },
  }),

  created() {
    this.initialize(1);
    this.initializePeople()
  },

  computed: {
    formTitle() {
      return !this.departments.id ? "Novo Departamento " : "Editar Departamento";
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
    initialize(page) {
      this.$axios
        .get(`https://test-people.fe.unicamp.br/api/departments?page=${page}`)
        .then((response) => {
          this.items = response.data.data;
          this.configPagination = response.data.meta;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    initializeMembers(id, departmentName) {
      this.$axios
        .get(`https://test-people.fe.unicamp.br/api/departments/${id}/members`)
        .then((response) => {
          delete response.data.data.message;
          this.departments.members = response.data.data;
          this.departments.name = departmentName;
          this.dialogView = true;

        })
        .catch((error) => {
          console.error(error);
        });
    },
    initializePeople() {
      this.$axios.get("https://test-people.fe.unicamp.br/api/people").then((response) => {
        this.itemsPeople = response.data.data;
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
        .delete("https://test-people.fe.unicamp.br/api/departments/" + this.departments.id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize(this.currentPage);
            this.departmentsDelete = false;
            this.$toast.success(response.data.message);
          } else {
            this.$toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.departments = this.defaultDepartment;
    },

    save() {
      if (this.departments.id) {
        this.$axios
          .put("https://test-people.fe.unicamp.br/api/departments/" + this.departments.id, this.departments)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize(this.currentPage);
              this.departments = this.defaultDepartment;
              this.$toast.success(response.data.message);
              this.dialogEdit = false;
            } else {
              this.$toast.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.$axios
          .post("https://test-people.fe.unicamp.br/api/departments", this.departments)
          .then((response) => {
            console.log(response);
            if (response.status == 201) {
              this.initialize(this.currentPage);
              this.departments = this.defaultDepartment;
              this.$toast.success(response.data.message);
              this.dialogEdit = false;
            } else {
              this.$toast.error(response.data.message);
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
    },
  },
};
</script>

<style></style>