<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Grupo de Pesquisa (Membros)</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="membros_grupo_de_pesquisa.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <v-dialog persistent v-model="dialog" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="groupMember = { ...defaultGroupMember }"></v-btn>
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
                      <v-autocomplete v-model="groupMember.person_id" :items="itemsPeople" item-title="full_name"
                        item-value="_id" :rules="[
                          () => !!groupMember.person_id || 'Pessoa é requerido!',
                          () => !(groupMember.person_id.length > 60) || 'Nome maior que o suportado',
                        ]" label="Pessoa" :counter="60" required>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-select v-model="groupMember.role" label="Papel" :items="itemsRole" :title="itemsRole.title"
                        :value="itemsRole.value" :rules="[
                          () => !!groupMember.role || 'Papel é requerido!',
                        ]" :counter="20"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="groupMember.stay_start" label="Ínicio da permanência" :rules="[
                        () => !!groupMember.stay_start || 'Ínicio de permanência é requirido',
                        () => !compareDates(groupMember.stay_start, groupMember.stay_end) || 'Ínicio de permanência é maior que termino'
                      ]" v-mask-date.br></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="groupMember.stay_end" label="Término da permanência" :rules="[
                        () => !compareDates(groupMember.stay_start, groupMember.stay_end) || 'Término de permanência menor que inicial',
                      ]" v-mask-date.br></v-text-field>
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
          <v-dialog v-model="groupMemberDelete" max-width="420px">
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
                <v-btn color="blue-darken-1" variant="plain" @click="groupMemberDelete = false">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="deleteGroupMemberConfirm">
                  Excluir
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.person_id="{ item }">
        {{ getPersonNameById(item.raw.person_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.role="{ item }">
        {{ getRoleById(item.raw.role) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon title="Editar" size="small" class="me-2" @click="editGroupMember(item.raw)">mdi-pencil</v-icon>
        <v-icon title="Excluir" size="small" @click="deleteGroupMember(item.raw)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data> Não há dados para exibir!</template>
    </v-data-table>
  </div>
</template>
  
  
<script>
import moment from 'moment'

export default {
  data: () => ({
    valid: false,
    dialog: false,
    groupMemberDelete: false,
    headers: [
      {
        title: "Pessoa",
        align: "start",
        key: "person_id",
      },
      { title: "Papel", key: "role" },
      { title: "Ínicio da permanência", key: "stay_start" },
      { title: "Término da permanência", key: "stay_end" },
      { title: "Ações", key: "actions", sortable: false },
    ],
    items: [],
    itemsPeople: [],
    itemsRole: [
      {
        title: "Líder",
        value: "leader"
      },
      {
        title: "Vice-líder",
        value: "vice_leader"
      },
      {
        title: "Regular",
        value: "regular"
      },
    ],
    editedIndex: -1,
    groupMember: {},
    defaultGroupMember: {
      id_: null,
      person_id: null,
      role: null,
      stay_start: null,
      stay_end: null,
    },
  }),

  computed: {
    formTitle() {
      return !this.groupMember._id ? "Novo membro" : "Editar membro";
    },
  },
  created() {
    this.initialize();
    this.initializePeople();
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
        .get("research-groups-members/")
        .then((response) => {
          this.items = response.data;
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
        .get("people/")
        .then((response) => {
          this.itemsPeople = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editGroupMember(item) {
      this.groupMember = item;
      this.dialog = true;
    },

    deleteGroupMember(item) {
      this.groupMember = item;
      this.groupMemberDelete = true;
    },

    deleteGroupMemberConfirm() {
      this.$axios
        .delete("research-groups-members/" + this.groupMember._id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize();
            this.groupMemberDelete = false;
            this.$toast.success(response.statusText);
          } else {
            this.$toast.error(response.statusText);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.groupMember = this.defaultGroupMember;
    },

    save() {
      this.groupMember.stay_start = this.setDate(this.groupMember.stay_start)
      if (this.groupMember.stay_end) {
        this.groupMember.stay_end = this.setDate(this.groupMember.stay_end)
      }
      if (this.groupMember._id) {
        this.$axios
          .put("research-groups-members/" + this.groupMember._id, this.groupMember)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.groupMember = this.defaultGroupMember;
              this.items.forEach((memberGroup) => {
                memberGroup.stay_start = this.getDate(memberGroup.stay_start);
                memberGroup.stay_end = this.getDate(memberGroup.stay_end);
              })
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
          .post("research-groups-members/", this.groupMember)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.groupMember = this.defaultGroupMember;
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
    getPersonNameById(personId) {
      const person = this.itemsPeople.find(
        (item) => item._id === personId
      );
      return person ? person.full_name : "";
    },
    getRoleById(roleId) {
      for (let gridRole of this.itemsRole) {
        if (gridRole.value === roleId) {
          return gridRole.title;
        }
      }
    },
    getDate(date) {
        let momentDate = moment.utc(date, "YYYY-MM-DD");
        let formatDate = momentDate.format('DD/MM/YYYY');
        if(momentDate.isValid()) {
          return formatDate;
        } else {
          return null;
        }
        
    },
    setDate(date) {
        let momentDate = moment.utc(date, "DD/MM/YYYY");
        let formatDate = momentDate.format('YYYY-MM-DD');
        if(momentDate.isValid()) {
          return formatDate;
        } else {
          return null;
        }
    },
    compareDates(start, end) {
      let momentInit = moment.utc(start, "DD/MM/YYYY");
      let momentFinal = moment.utc(end, "DD/MM/YYYY");
      let dateInit = momentInit.format('YYYY-MM-DD');
      let dateFinal = momentFinal.format('YYYY-MM-DD');
    
      if(end !== null) {
        return dateInit > dateFinal ? true : false;
      }
      
    },

  },
}
</script>
<style></style>
  