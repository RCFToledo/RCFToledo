<template>
  <div>
    <v-checkbox class="elevation-0" label="Declaro que está ação não possui membros" v-model="declareNoMembers" v-if="items.length <= 0"></v-checkbox>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1" v-if="!declareNoMembers" :page="currentPage" :items-per-page="configPagination.per_page">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Membros</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="ações_membros.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <v-dialog persistent v-model="dialog" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="actionMembers = { ...defaultActionMembers }"></v-btn>
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
                    <v-col cols="12" md="12">
                      <v-autocomplete
                        v-model="actionMembers.person_id" label="Pessoa" :items="itemsPeople" item-title="full_name" item-value="id" :rules="[ () => !!actionMembers.person_id || 'Membro é requerido' ]" required></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-select v-model="actionMembers.degree"
                        label="Nível no programa" v-if="getAcademicProfileByPeopleById(itemsPeople, actionMembers.person_id) !== 'student'" :items="student_degree" items-title="title" items-value="value"  :rules="[
                          () => !!actionMembers.degree || 'Nível no programa é requerido',
                        ]" required></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="actionMembers.stay_start" label="Data de início" :rules="[
                        () => !!actionMembers.stay_start || 'Data de ínicio é requirido',
                        () => !compareDates(actionMembers.stay_start, actionMembers.stay_end) || 'Data de inicio é maior que termino'
                      ]" required v-mask-date.br><v-icon>mdi-calendar-range</v-icon></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="actionMembers.stay_end" label="Data de término" :rules="[
                        () => !compareDates(actionMembers.stay_start, actionMembers.stay_end) || 'Data de termino é menor que inicial',
                      ]" v-mask-date.br><v-icon>mdi-calendar-range</v-icon></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="blue-darken-1" variant="plain" @click="dialog = false; initialize(1, actionId);">
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
                <v-btn color="primary" variant="tonal" @click="deleteActionMembersConfirm">
                  Excluir
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.person_id="{ item }">
        {{ getPersonNameById(item.person_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" title="Editar" size="small" class="me-2" @click="editActionMembers(item)">mdi-pencil</v-icon>
        <v-icon color="primary" title="Excluir" size="small" @click="deleteActionMembers(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:bottom>
        <v-footer flat color="secondary">
          <v-spacer></v-spacer>
          <p>Itens na página: <strong>{{ items.length }}</strong></p>
          <v-pagination rounded="circle" show-first-last-page :length="configPagination.last_page" :total-visible="1" v-model="currentPage"
            @next="initialize(currentPage, actionId)" @prev="initialize(currentPage, actionId)" @first="initialize(1, actionId)"
            @last="initialize(configPagination.last_page, actionId)">
          </v-pagination>
        </v-footer>
      </template>
      <template v-slot:no-data> Não há dados para exibir!</template>
    </v-data-table>
  </div>
</template>


<script>
import moment from 'moment'
export default {
  props: {
    actionId: Number
  },
  data: () => ({
    valid: false,
    dialog: false,
    itemsDelete: false,
    declareNoMembers: false,
    currentPage: 1,
    configPagination: [],
    headers: [
      {
        title: "Pessoa",
        align: "start",
        key: "person_id",
      },
      { title: "Data de inicio", key: "stay_start" },
      { title: "Data de termino", key: "stay_end" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    itemsPeople: [],
    actionMembers: {},
    defaultActionMembers: {
      id: null,
      person_id: null,
      degree: null,
      stay_start: null,
      stay_end: null,
      action_id: null,
    },
    student_degree: [
      {
        title: "Graduação",
        value: "undergraduate"
      },
      {
        title: "Mestrado",
        value: "masters_degree"
      },
      {
        title: "Doutorado",
        value: "doctorate"
      }
    ]
  }),


  computed: {
    formTitle() {
      return !this.actionMembers.id ? "Novo Membro" : "Editar Membro";
    },
  },

  created() {
    this.initialize(1, this.actionId);
    this.initializePeople();
  },
  methods: {
    formSubmit() {
      this.$refs.form.validate().then((isValid) => {
        if (isValid.valid) {
          this.save(this.actionId);
        }
      });
    },
    initialize(page, id) {
      this.$axios
        .get(`http://127.0.0.1:8001/api/actions/${id}/members?page=${page}`)
        .then((response) => {
          this.items = response.data.data;
          this.configPagination = response.data.meta;
          this.items.forEach((memberGroup) => {
            if (!this.items.stay_start) {
              memberGroup.stay_start = this.getDate(memberGroup.stay_start);
            }
            if (!this.items.stay_end) {
              memberGroup.stay_end = this.getDate(memberGroup.stay_end);
            }
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializePeople() {
      this.$axios
        .get("https://test-people.fe.unicamp.br/api/people")
        .then((response) => {
          this.itemsPeople = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editActionMembers(item) {
      this.actionMembers = item;
      this.dialog = true;
    },

    deleteActionMembers(item) {
      this.actionMembers = item;
      this.itemsDelete = true;
    },

    deleteActionMembersConfirm() {
      this.$axios
        .delete(`http://127.0.0.1:8001/api/actions/${this.actionId}/members/${this.actionMembers.id}`)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize(1, this.actionId);
            this.itemsDelete = false;
            this.$toast.success(response.data.message);
          } else {
            this.$toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.actionMembers = this.defaultActionMembers;
    },

    save(id) {
      this.actionMembers.action_id = id;
      this.actionMembers.stay_start = this.setDate(this.actionMembers.stay_start)
      if (this.actionMembers.stay_end) {
        this.actionMembers.stay_end = this.setDate(this.actionMembers.stay_end)
      }
      if (this.actionMembers.id) {
        this.$axios
          .put(`http://127.0.0.1:8001/api/actions/${id}/members/${this.actionMembers.id}`, this.actionMembers)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize(1, this.actionId);
              this.actionMembers = this.defaultActionMembers;
              this.items.forEach((actionMembers) => {
                actionMembers.stay_start = this.getDate(actionMembers.stay_start);
                actionMembers.stay_end = this.getDate(actionMembers.stay_end);
              })
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
          .post(`http://127.0.0.1:8001/api/actions/${id}/members`, this.actionMembers)
          .then((response) => {
            console.log(response);
            if (response.status == 201) {
              this.initialize(1, this.actionId);
              this.actionMembers = this.defaultActionMembers;
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

    compareDates(start, end) {
      let momentInit = moment.utc(start, "DD/MM/YYYY");
      let momentFinal = moment.utc(end, "DD/MM/YYYY");
      let dateInit = momentInit.format('YYYY-MM-DD');
      let dateFinal = momentFinal.format('YYYY-MM-DD');

      if (end !== null) {
        return dateInit > dateFinal ? true : false;
      }

    },
    getDate(date) {
      let momentDate = moment.utc(date, "YYYY-MM-DD");
      let formatDate = momentDate.format('DD/MM/YYYY');
      if (momentDate.isValid()) {
        return formatDate;
      } else {
        return null;
      }

    },
    setDate(date) {
      let momentDate = moment.utc(date, "DD/MM/YYYY");
      let formatDate = momentDate.format('YYYY-MM-DD');
      if (momentDate.isValid()) {
        return formatDate;
      } else {
        return null;
      }
    },
    getAcademicProfileByPeopleById(people, personId) {
      const profile = people.find((profile) => {
        return profile._id === personId;
      })
      return profile ? profile.academic_profile : null;
    },
    getPersonNameById(personId) {
      const person = this.itemsPeople.find(
        (item) => item.id === personId
      );
      return person ? person.full_name : "";
    },
  },
}
</script>
<style></style>
