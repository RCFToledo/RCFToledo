<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1"
      :page="currentPage" :items-per-page="15">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Pessoas</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="itemsExport" style="margin-right: 10px" name="pessoas.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" :loading="loading" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <v-dialog v-model="dialog" max-width="80%" :persistent="true">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="people = { ...defaultPeople }"></v-btn>
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

                    <v-col cols="12" md="6">
                      <v-select variant="outlined" v-model="people.academic_profile" label="Perfil" item-title="title" item-value="value"
                        :items="profile" :rules="[
                          () =>
                            !!people.academic_profile ||
                            'Perfil é requerido!',
                        ]"></v-select>
                    </v-col>
                    <v-col cols="12" md="6" v-if="people.academic_profile == 'staff' ||
                      people.academic_profile == 'professor' || people.academic_profile == 'researcher'
                      ">
                      <v-text-field variant="outlined" v-model="people.employee_id" :rules="[
                        () =>
                          !!people.employee_id || 'Matrícula é requerida!',
                      ]" label="Matrícula"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" v-if="people.academic_profile == 'student'">
                      <v-text-field  variant="outlined" v-model="people.student_id" :rules="[
                        () => !!people.student_id || 'RA é requerido!',
                      ]" label="RA"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" :md="people.country_code === 'BR' ? 6 : 8">
                      <v-text-field variant="outlined" v-model="people.full_name" :rules="[
                        () =>
                          !!people.full_name || 'Nome Completo é requerido!',
                        () =>
                          !(people.full_name.length > 60) ||
                          'Nome Completo maior que 60 caracteres',
                      ]" label="Nome" :counter="60" required></v-text-field>
                    </v-col>
                    <v-col cols="12" :md="people.country_code === 'BR' ? 2 : 4">
                      <v-text-field variant="outlined" v-model="people.cpf" :rules="[
                        () => !(people.country_code === 'BR' && people.academic_profile !== 'other' && !people.cpf) || 'CPF é requirido',
                      ]" label="CPF" v-mask-cpf></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" v-if="people.country_code !== 'BR'" class="d-flex flex-row">
                      <v-text-field variant="outlined" class="mr-2" v-model="people.rne" label="RNE"></v-text-field>
                      <v-text-field variant="outlined" v-model="people.passport" label="Passaporte"></v-text-field>
                    </v-col>
                    <v-col cols="12" :md="people.country_code === 'BR' ? 4 : 6">
                      <v-autocomplete variant="outlined" v-model="people.country_code" label="País de Origem"
                        :items="institutionsCountryCode" item-title="name" item-value="code"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" v-model="people.default_email" :rules="[
                        () => !!people.default_email || 'E-mail é requerido!',
                        (v) => /.+@.+\..+/.test(v) || 'E-mail inválido',
                      ]" label="E-mail"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" v-model="people.alternative_email" label="E-mail alternativo"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-autocomplete variant="outlined" v-model="people.institution_id" label="Instituição" :items="items"
                        item-title="institution.name" item-value="institution.id" :rules="[
                          () =>
                            !((people.academic_profile !== 'other') && !people.institution_id) ||
                            'Instituição é requerida!',
                        ]"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6"
                      v-if="people.institution_id === $store.getters.getUnicamp_id && people.academic_profile === 'professor'">
                      <v-autocomplete variant="outlined" v-model="people.department_id" label="Departamento" :items="itemsDepartments"
                        item-title="name" item-value="id"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6" v-else-if="people.academic_profile === 'staff'">
                      <v-autocomplete variant="outlined" v-model="people.sector_id" label="Setor" :items="itemsSectors" item-title="name"
                        item-value="id"></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="blue-darken-1" variant="plain" @click="
                  dialog = false;
                initialize(currentPage);
                ">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="formSubmit">
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Confirm delete -->
          <v-dialog v-model="dialogDelete" max-width="420px">
            <v-card class="rounded-lg">
              <v-card-title class="bg-primary">
                Confirmar exclusão
              </v-card-title>
              <v-card-text class="text-body-1 text-md-center pa-4 ma-4"><v-icon icon="mdi-alert" size="large"></v-icon>
                Tem certeza que
                deseja excluir esse item?</v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="bg-secondary d-flex justify-center">
                <v-btn color="blue-darken-1" variant="plain" @click="dialogDelete = false">Cancelar</v-btn>
                <v-btn color="primary" variant="tonal" @click="deletePeopleConfirm">Excluir</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.register="{ item }">
        {{ getRegisterNumberByIds(item.student_id, item.employee_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.academic_profile="{ item }">
        {{ getProfileTitle(item.academic_profile) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.institution_id="{ item }">
        {{item.institution_id && item.institution ? item.institution.name : ""}}
      </template>

      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" title="Editar" size="small" class="me-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon color="primary" title="Excluir" size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:bottom>
        <v-footer flat color="secondary">
          <v-spacer></v-spacer>
          <p style="margin-right: 1vw">total de itens: <strong>{{ configPagination.total }}</strong></p>
          <p>Itens na página: <strong>{{ items.length }}</strong></p>
          <v-pagination rounded="circle" show-first-last-page :length="configPagination.last_page" :total-visible="1"
            v-model="currentPage" @next="initialize(currentPage)" @prev="initialize(currentPage)" @first="initialize(1)"
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
    dialog: false,
    dialogDelete: false,
    register: null,
    currentPage: 1,
    configPagination: [],
    itemsExport: [],
    loading: true,
    headers: [
      {
        title: "Nome Completo",
        align: "start",
        key: "full_name",
      },
      { title: "Instituição", key: "institution_id" },
      { title: "Perfil", key: "academic_profile" },
      { title: "Registro", key: "register" },
      { title: "E-mail", key: "default_email" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    profile: [
      {
        value: "student",
        title: "Estudante",
      },
      {
        value: "staff",
        title: "Funcionário",
      },
      {
        value: "professor",
        title: "Docente",
      },
      {
        value: "researcher",
        title: "Pesquisador",
      },
      {
        value: "other",
        title: "Outros",
      },
    ],
    items: [],
    itemsDepartments: [],
    itemsInstitutions: [],
    institutionsCountryCode: [],
    itemsSectors: [],
    peopleIndex: -1,
    people: [],
    defaultPeople: {
      id: null,
      full_name: null,
      type: null,
      student_id: null,
      rne: null,
      passport: null,
      institution_id: null,
      department_id: null,
      academic_profile: null,
      employee_id: null,
      sector_id: null,
      country_code: 'BR',
      institution: null, 
      department: null,
      sector: null
    },
  }),
  watch: {
    'people.academic_profile'(newValue) {
      if (newValue === 'staff') {
        this.people.department_id = null
        this.people.student_id = null;
      }
      else if ((newValue === 'professor') || (newValue === 'researcher')) {
        this.people.sector_id = null
        this.people.student_id = null;
      }
      else if (newValue === 'student') {
        this.people.employee_id = null;
        this.people.department_id = null;
        this.people.sector_id = null;
      }
      else {
        this.people.employee_id = null;
        this.people.department_id = null;
        this.people.sector_id = null;
        this.people.student_id = null;
      }
    },
    'people.institution_id'(newValue, oldValue) {
      if ((newValue !== oldValue) && (oldValue !== undefined)) {
        this.people.department_id = null;
      }
    },
    'people.country_code'(newValue, oldValue) {
      if ((newValue !== oldValue) && (newValue == 'BR')) {
        this.people.rne = null;
        this.people.passport = null;
      }
    }
  },
  computed: {
    formTitle() {
      return !this.people.id ? "Nova Pessoa" : "Editar Informações";
    },
  },

  created() {
    this.initialize(1);
    this.initializeDepartments();
    this.initializeInstitutions();
    this.initializeSectors();
    this.initializeCountries();
    this.initializeExportData();
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
        .get(`https://test-people.fe.unicamp.br/api/people?page=${page}&include[]=department&include[]=sector&include[]=institution`)
        .then((response) => {
          this.items = response.data.data;
          this.configPagination = response.data.meta;
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeExportData() {
      this.$axios
        .get(`https://test-people.fe.unicamp.br/api/people-export`)
        .then((response) => {
          this.itemsExport = response.data.data;
          this.loading = false;  
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeCountries() {
      this.$axios
        .get("https://test-bapex.fe.unicamp.br/api/countries")
        .then((response) => {
          this.institutionsCountryCode = response.data.data;

        })
        .catch((error) => {
          console.error(error);
        });
    },
    initializeDepartments() {
      this.$axios
        .get("https://test-people.fe.unicamp.br/api/people?include[]=department")
        .then((response) => {
          this.itemsDepartments = response.data;
          console.log(this.itemsDepartments);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeSectors() {
      this.$axios
        .get("https://test-people.fe.unicamp.br/api/sectors")
        .then((response) => {
          this.itemsSectors = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeInstitutions() {
      this.$axios
        .get("https://test-people.fe.unicamp.br/api/institutions")
        .then((response) => {
          this.itemsInstitutions = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editItem(item) {
      this.people = item;
      this.dialog = true;
    },

    deleteItem(item) {
      this.people = item;
      this.dialogDelete = true;
    },

    deletePeopleConfirm() {
      this.$axios
        .delete("https://test-people.fe.unicamp.br/api/people/" + this.people.id)
        .then((response) => {
          if (response.status == 200) {
            this.initialize(this.currentPage);
            this.dialogDelete = false;
            this.$toast.success(response.data.message);
          } else {
            this.$toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.people = this.defaultPeople;
    },

    save() {
      //this.setPeopleDataByName(this.items, this.itemsInstitutions, this.itemsDepartments, this.itemsSectors)
      if (this.people.id) {
        this.$axios
          .put("https://test-people.fe.unicamp.br/api/people/" + this.people.id, this.people)
          .then((response) => {
            if (response.status == 200) {
              this.initialize(this.currentPage);
              this.people = this.defaultPeople;
              this.$toast.success(response.data.message);
              this.dialog = false;
            } else {
              this.$toast.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.$axios
          .post("https://test-people.fe.unicamp.br/api/people", this.people)
          .then((response) => {
            if (response.status == 201) {
              this.initialize(this.currentPage);
              this.people = this.defaultPeople;
              this.$toast.success(response.data.message);
              this.dialog = false;
            } else {
              this.$toast.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    getRegisterNumberByIds(studentId, employeeId) {
      if (studentId != null) {
        return studentId;
      }
      else if (employeeId != null) {
        return employeeId;
      }
    },
    getProfileTitle(profileId) {
      for (let gridProfile of this.profile) {
        if (gridProfile.value === profileId) {
          return gridProfile.title;
        }
      }
    },
  },
};
</script>
<style></style>