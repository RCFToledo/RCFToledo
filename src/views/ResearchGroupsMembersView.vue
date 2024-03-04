<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1" :page="currentPage" :items-per-page="15">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Membros</v-toolbar-title>
          <v-spacer></v-spacer>          
          <download-csv :data="itemsExport" style="margin-right: 10px" name="membros_grupo_de_pesquisa.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" :loading="loading" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>          
          <v-dialog persistent v-model="dialog" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" title="Novo" icon="mdi-plus" v-bind="props" variant="tonal"
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
                      <v-autocomplete variant="outlined" v-model="groupMember.person_id" :items="itemsPeople" item-title="full_name"
                        item-value="id" :rules="[
                          () => !!groupMember.person_id || 'Pessoa é requerido!',
                          () => !(groupMember.person_id.length > 60) || 'Nome maior que o suportado',
                        ]" label="Pessoa" :counter="60" required>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-select variant="outlined" v-model="groupMember.role" label="Papel" :items="itemsRole" :title="itemsRole.title"
                        :value="itemsRole.value" :rules="[
                          () => !!groupMember.role || 'Papel é requerido!',
                        ]" :counter="20"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field type="date" variant="outlined" v-model="groupMember.stay_start" label="Ínicio da permanência" :rules="[
                        () => !!groupMember.stay_start || 'Ínicio de permanência é requirido',
                        () => !compareDates(groupMember.stay_start, groupMember.stay_end) || 'Ínicio de permanência é maior que termino'
                      ]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field type="date" variant="outlined" v-model="groupMember.stay_end" label="Término da permanência" :rules="[
                        () => !compareDates(groupMember.stay_start, groupMember.stay_end) || 'Término de permanência menor que inicial',
                      ]"></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="blue-darken-1" variant="plain" @click="dialog = false; initialize(currentPage, researchGroupId);">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="formSubmit">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>          
          <v-btn icon title="Voltar" class="rounded-circle ml-2" variant="tonal" @click="$emit('closeModal', true)">           
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
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
                <v-btn color="primary" variant="tonal" @click="deleteGroupMemberConfirm(researchGroupId)">
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
      <template v-slot:item.role="{ item }">
        {{ getRoleById(item.role) }}
      </template>
       <!-- eslint-disable-next-line -->
      <template v-slot:item.stay_start="{ item }">
        {{ getDate(item.stay_start) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.stay_end="{ item }">
        {{ getDate(item.stay_end) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" title="Editar" size="small" class="me-2" @click="editGroupMember(item)">mdi-pencil</v-icon>
        <v-icon color="primary" title="Excluir" size="small" @click="deleteGroupMember(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:bottom>
        <v-footer flat color="secondary" v-if="Object.keys(this.items).length > 0">
          <v-spacer></v-spacer>
          <p style="margin-right: 1vw">total de itens: <strong>{{ configPagination.total }}</strong></p>
          <p>Itens na página: <strong>{{ items.length }}</strong></p>
          <v-pagination rounded="circle" show-first-last-page :length="configPagination.last_page" :total-visible="1" v-model="currentPage"
            @next="initialize(currentPage, researchGroupId)" @prev="initialize(currentPage,researchGroupId)" @first="initialize(1, researchGroupId)"
            @last="initialize(configPagination.last_page, researchGroupId)">
          </v-pagination>
        </v-footer>
        <v-footer flat color="secondary" v-else>
          <v-spacer></v-spacer>
          <p>Itens na páginas: <strong>{{ items.length }}</strong></p>
          <v-pagination rounded="circle" show-first-last-page :total-visible="1">
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
    researchGroupId: Number,
  },
  data: () => ({
    valid: false,
    dialog: false,
    groupMemberDelete: false,
    currentPage: 1,
    configPagination: [],
    itemsExport: [],
    loading: true,
    headers: [
      {
        title: "Pessoa",
        align: "start",
        key: "person_id",
      },
      { title: "Papel", key: "role" },
      { title: "Ínicio da permanência", key: "stay_start" },
      { title: "Término da permanência", key: "stay_end" },
      { title: "Opções", key: "actions", sortable: false },
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
      id: null,
      person_id: null,
      role: null,
      stay_start: null,
      stay_end: null,
      research_group_id: null,
    },
  }),

  computed: {
    formTitle() {
      return !this.groupMember.id ? "Novo membro" : "Editar membro";
    },
  },
  created() {    
    this.initialize(1, this.researchGroupId);    
    this.initializePeople();
    this.initializeExportData(this.researchGroupId);
  },
  /*beoreUpdate() {
      this.initialize(1, this.researchGroupId);
  },*/
  methods: {
    formSubmit() {
      this.$refs.form.validate().then((isValid) => {
        if (isValid.valid) {
          this.save(this.researchGroupId);
        }
      });
    },
    initialize(page, id) {
      this.$axios
        .get(`https://test-research.fe.unicamp.br/api/research-groups/${id}/members?page=${page}`)
        .then((response) => {
          this.items = response.data.data;
          this.configPagination = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeExportData(id) {
      this.$axios
        .get(`http://127.0.0.1:8000/api/research-groups-export/${id}/members`)
        .then((response) => {
          this.itemsExport = response.data.data;
          this.loading = false;  
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

    editGroupMember(item) {
      this.groupMember = item;
      this.dialog = true;
    },

    deleteGroupMember(item) {
      this.groupMember = item;
      this.groupMemberDelete = true;
    },

    deleteGroupMemberConfirm(id) {
      this.$axios
        .delete(`https://test-research.fe.unicamp.br/api/research-groups/${id}/members/${this.groupMember.id}`)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize(this.currentPage,id);
            this.groupMemberDelete = false;
            this.$toast.success(response.data.message);
          } else {
            this.$toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.groupMember = this.defaultGroupMember;
    },

    save(id) {
      this.groupMember.research_group_id = id;
      if (this.groupMember.id) {
        this.$axios
          .put(`https://test-research.fe.unicamp.br/api/research-groups/${id}/members/${this.groupMember.id}`, this.groupMember)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize(this.currentPage,id);
              this.groupMember = this.defaultGroupMember;
              this.items.forEach((memberGroup) => {
                memberGroup.stay_start = this.getDate(memberGroup.stay_start);
                memberGroup.stay_end = this.getDate(memberGroup.stay_end);
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
          .post(`https://test-research.fe.unicamp.br/api/research-groups/${id}/members`, this.groupMember)
          .then((response) => {
            console.log(response);
            if (response.status == 201) {
              this.initialize(this.currentPage,id);
              this.groupMember = this.defaultGroupMember;
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
    getPersonNameById(personId) {
      const person = this.itemsPeople.find(
        (item) => item.id === personId
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
  