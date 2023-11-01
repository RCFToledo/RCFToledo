<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Pessoas</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="pessoas.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
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
                      <v-select v-model="people.academic_profile" label="Perfil" item-title="title" item-value="value"
                        :items="profile" :rules="[
                          () =>
                            !!people.academic_profile ||
                            'Perfil é requerido!',
                        ]"></v-select>

                    </v-col>
                    <v-col cols="12" md="6" v-if="people.academic_profile == 'staff' ||
                      people.academic_profile == 'professor'
                      ">
                      <v-text-field v-model="people.employee_id" :rules="[
                        () =>
                          !!people.employee_id || 'Matrícula é requerida!',
                      ]" label="Matrícula"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" v-if="people.academic_profile == 'student'">
                      <v-text-field v-model="people.student_id" :rules="[
                        () => !!people.student_id || 'RA é requerido!',
                      ]" label="RA"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" md="8">
                      <v-text-field v-model="people.full_name" :rules="[
                        () =>
                          !!people.full_name || 'Nome Completo é requerido!',
                        () =>
                          !(people.full_name.length > 60) ||
                          'Nome Completo maior que 60 caracteres',
                      ]" label="Nome" :counter="60" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="people.cpf" :rules="[
                        () => !((people.academic_profile !== 'other') && !people.cpf) || 'CPF é requirido',
                      ]" label="CPF" v-mask-cpf></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="people.default_email" :rules="[
                        () => !!people.default_email || 'E-mail é requerido!',
                        (v) => /.+@.+\..+/.test(v) || 'E-mail inválido',
                      ]" label="E-mail"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="people.alternative_email" label="E-mail alternativo"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-select v-model="people.institution_id" label="Instituição" :items="itemsInstitutions"
                        item-title="name" item-value="_id" :rules="[
                          () =>
                            !!people.institution_id ||
                            'Instituição é requerida!',
                        ]"></v-select>
                    </v-col>
                    <v-col cols="12" md="6"
                      v-if="people.institution_id === $store.getters.getUnicamp_id && people.academic_profile === 'professor'">
                      <v-select v-model="people.department_id" label="Departamento" :items="itemsDepartments"
                        item-title="name" item-value="_id"></v-select>
                    </v-col>
                    <v-col cols="12" md="6"
                      v-else-if="people.institution_id === $store.getters.getUnicamp_id && people.academic_profile === 'staff'">
                      <v-select v-model="people.sector_id" label="Setor" :items="itemsSectors" item-title="name"
                        item-value="_id"></v-select>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="blue-darken-1" variant="plain" @click="
                  dialog = false;
                initialize();
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
      <template v-slot:item.institution_id="{ item }">
        {{ getInstitutionsName(item.raw.institution_id, item.raw.department_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.department_id="{ item }">
        {{ getDepartmentsName(item.raw.department_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.register="{ item }">
        {{ getRegisterNumber(item.raw.student_id, item.raw.employee_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.academic_profile="{ item }">
        {{ getProfile(item.raw.academic_profile) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon title="Editar" size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon title="Excluir" size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
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
      { title: "Ações", key: "actions", sortable: false },
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
        title: "Professor",
      },
      {
        value: "other",
        title: "Outros",
      },
    ],
    items: [],
    itemsDepartments: [],
    itemsInstitutions: [],
    itemsSectors: [],
    peopleIndex: -1,
    people: [],
    defaultPeople: {
      id_: null,
      name: null,
      abbr_name: null,
      type: null,
      student_id: null,
      employee_id: null,
      sector_id: null,
    },
  }),
  watch: {
    'people.academic_profile'(newValue, oldValue) {
      if ((newValue !== oldValue) && (oldValue !== undefined)) {
        this.people.student_id = null;
        this.people.employee_id = null;

      }
      if (this.people.academic_profile === 'staff') {
        this.people.department_id = null
      }
      else if (this.people.academic_profile === 'professor') {
        this.people.sector_id = null
      }
      else {
        this.people.department_id = null
        this.people.sector_id = null
      }
    },
    'people.institution_id'(newValue, oldValue) {
      if ((newValue !== oldValue) && (oldValue !== undefined)) {
        this.people.department_id = null;
      }
    }
  },
  computed: {
    formTitle() {
      return !this.people._id ? "Nova Pessoa" : "Editar Informações";
    },
  },

  created() {
    this.initialize();
    this.initializeDepartments();
    this.initializeInstitutions();
    this.initializeSectors();
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
        .get("people/")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeDepartments() {
      this.$axios
        .get("departments/")
        .then((response) => {
          this.itemsDepartments = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeSectors() {
      this.$axios
        .get("sectors/")
        .then((response) => {
          this.itemsSectors = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeInstitutions() {
      this.$axios
        .get("institutions/")
        .then((response) => {
          this.itemsInstitutions = response.data;
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
        .delete("people/" + this.people._id)
        .then((response) => {
          if (response.status == 200) {
            this.initialize();
            this.dialogDelete = false;
            this.$toast.success(response.statusText);
          } else {
            this.$toast.error(response.statusText);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.people = this.defaultPeople;
    },

    save() {
      if (this.people._id) {
        this.$axios
          .put("people/" + this.people._id, this.people)
          .then((response) => {
            if (response.status == 200) {
              this.initialize();
              this.people = this.defaultPeople;
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
          .post("people/", this.people)
          .then((response) => {
            if (response.status == 200) {
              this.initialize();
              this.people = this.defaultPeople;
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

    getInstitutionsName(institutionId) {
      const institution = this.itemsInstitutions.find(
        (item) => item._id === institutionId
      );
      return institution ? institution.name : "";
    },

    getDepartmentsName(departmentId) {
      const department = this.itemsDepartments.find(
        (item) => item._id === departmentId
      );
      return department ? department.name : "";
    },

    getSectorsName(sectorId) {
      const sector = this.itemsSectors.find(
        (item) => item._id === sectorId
      );
      return sector ? sector.name : "";
    },

    getRegisterNumber(studentId, employeeId) {
      if (studentId != null) {
        return studentId;
      }
      else if (employeeId != null) {
        return employeeId;
      }
    },
    getProfile(profileId) {
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