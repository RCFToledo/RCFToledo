<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Pessoas</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="80%" :persistent="true">
            <template v-slot:activator="{ props }">
              <v-btn
                color="secondary"
                size="x-large"
                density="compact"
                icon="mdi-plus"
                v-bind="props"
                variant="tonal"
                dark
                @click="people = { ...defaultPeople }"
              ></v-btn>
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
                    
                    <v-col cols="12" md="6"
                      ><v-radio-group v-model="people.academic_profile" inline>                 
                        <v-radio label="Estudante" value="student"></v-radio>
                        <v-radio label="Funcionário" value="staff"></v-radio>
                        <v-radio label="Professor" value="professor"></v-radio>
                        <v-radio
                          label="Outros"
                          value="other"
                        ></v-radio> </v-radio-group
                    ></v-col>
                    <v-col
                      cols="12"
                      md="6"
                      v-if="
                        people.academic_profile == 'staff' ||
                        people.academic_profile == 'professor'
                      "
                    >
                      <v-text-field
                        v-model="people.employee_id"
                        :rules="[
                          () =>
                            !!people.employee_id || 'Matrícula é requerida!',
                        ]"
                        label="Matrícula"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="6"
                      v-if="people.academic_profile == 'student'"
                    >
                      <v-text-field
                        v-model="people.student_id"
                        :rules="[
                          () => !!people.student_id || 'RA é requerido!',
                        ]"
                        label="RA"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="people.full_name"
                        :rules="[
                          () =>
                            !!people.full_name || 'Nome Completo é requerido!',
                          () =>
                            !(people.full_name.length > 60) ||
                            'Nome Completo maior que 60 caracteres',
                        ]"
                        label="Nome"
                        :counter="60"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="people.name_treatment"
                        :rules="[
                          () =>
                            !!people.name_treatment ||
                            'Tratamento é requerido!',
                          () =>
                            !(people.name_treatment.length > 40) ||
                            'Tratamento maior que o suportado',
                        ]"
                        label="Tratamento"
                        :counter="40"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="people.cpf"
                        label="CPF"
                        v-mask-cpf
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="people.default_email"
                        :rules="[
                          () => !!people.default_email || 'E-mail é requerido!',
                          (v) => /.+@.+\..+/.test(v) || 'E-mail inválido',
                        ]"
                        label="E-mail"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="people.alternative_email"
                        label="E-mail alternativo"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="people.instituition_id"
                        label="Instituição"
                        :items="itemsInstitutions"
                        item-title="name"
                        item-value="_id"
                        :rules="[
                          () =>
                            !!people.instituition_id ||
                            'Instituição é requerida!',
                        ]"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="people.department_id"
                        label="Departamento"
                        :items="itemsDepartments"
                        item-title="name"
                        item-value="_id"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn
                  color="blue-darken-1"
                  variant="plain"
                  @click="
                    dialog = false;
                    initialize();
                  "
                >
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
              <v-card-text class="text-body-1 text-md-center pa-4 ma-4"
                ><v-icon icon="mdi-alert" size="large"></v-icon> Tem certeza que
                deseja excluir esse item?</v-card-text
              >
              <v-divider></v-divider>
              <v-card-actions class="bg-secondary d-flex justify-center">
                <v-btn
                  color="blue-darken-1"
                  variant="plain"
                  @click="dialogDelete = false"
                  >Cancelar</v-btn
                >
                <v-btn
                  color="primary"
                  variant="tonal"
                  @click="deleteItemConfirm"
                  >Excluir</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.type="{ item }">
        {{ getTypeTitle(item.raw.type) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.country_code="{ item }">
        {{ getCountryCountryTitle(item.raw.country_code) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data> Não há dados para exibir! </template>
    </v-data-table>
  </div>
</template>
  
  
<script>
export default {
  data: () => ({
    valid: false,
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: "Nome Completo",
        align: "start",
        key: "full_name",
      },
      { title: "Instituição", key: "instituition_id" },
      { title: "Departamento", key: "department_id" },
      { title: "Matrícula", key: "employee_id" },
      { title: "RA", key: "student_id" },
      { title: "E-mail", key: "default_email" },
      { title: "Ações", key: "actions", sortable: false },
    ],
    items: [],
    itemsDepartments: [],
    itemsInstitutions: [],
    peopleIndex: -1,
    people: [],
    defaultPeople: {
      id_: null,
      name: null,
      abbr_name: null,
      type: null,
      country_code: null,
    },
  }),

  computed: {
    formTitle() {
      return !this.people._id ? "Nova Pessoa" : "Editar Informações";
    },
  },

  created() {
    this.initialize();
    this.initializeDepartments();
    this.initializeInstitutions();
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

    deleteItemConfirm() {
      this.$axios
        .delete("people/" + this.people._id)
        .then((response) => {
          console.log(response);
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
            console.log(response);
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
            console.log(response);
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
  },
};
</script>
<style></style>
