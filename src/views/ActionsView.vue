<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Ações</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="ações.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <v-dialog persistent v-model="dialog" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="action = { ...defaultAction }"></v-btn>
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
                      <v-text-field v-model="action.title" :rules="[
                        () => !!action.title || 'Título é requerido!',
                        () => !(action.title.length > 60) || 'Título maior que o suportado',
                      ]" label="Título" :counter="60" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select v-model="action.type" label="Tipo" :items="itemsType" item-title="label" item-value="type"
                        :rules="[
                          () => !!action.type || 'Tipo é requerido!',
                        ]"></v-select>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-autocomplete v-model="action.responsible_id" :items="itemsPeople" item-title="full_name"
                        item-value="_id" :rules="[
                          () => !!action.responsible_id || 'Responsável é requerido!',
                          () => !(action.responsible_id.length > 60) || 'Nome maior que o suportado',
                        ]" label="Responsável" :counter="60" required>
                      </v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="12">
                      <v-autocomplete multiple chips :items="relatedSubjectsItems" item-title="subject" item-value="_id"
                        v-model="action.related_subjects" label="Temas relacionados" required></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-combobox chips multiple v-model="action.keywords" @keydown="getKeySpace" :items="keywords"
                        label="Palavras-chave" required></v-combobox>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field v-model="action.started_at" label="Data de início" :rules="[
                        () => !!action.started_at || 'Data de ínicio é requirido',
                        () => !compareDates(action.started_at, action.ended_at) || 'Data de inicio é maior que termino'
                      ]" required v-mask-date.br></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field v-model="action.ended_at" label="Data de término" :rules="[
                        () => !compareDates(action.started_at, action.ended_at) || 'Data de termino é menor que inicial',
                      ]" v-mask-date.br :disabled="disabled"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-switch color="primary" v-model="action.international" inset
                        :label="action.international ? 'Internacional' : 'Nacional'"></v-switch>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-switch color="primary" v-model="action.free" inset
                        :label="action.free ? 'Gratuito' : 'Pago'"></v-switch>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-switch color="primary" v-model="action.status" inset label="Cancelado"></v-switch>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-textarea v-model="action.description" :rules="[
                        () => !!action.description || 'Descrição é requerida!',
                        () => !(action.description.length > 200) || 'Descrição maior que o suportado',
                      ]" label="Descrição" :counter="200" required></v-textarea>
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
                <v-btn color="primary" variant="tonal" @click="deleteActionConfirm">
                  Excluir
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog fullscreen v-model="dialogMembers" activator="parent">
            <v-card>
              <ActionsMembersView />
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="primary" variant="tonal" @click="dialogMembers = false; initialize();">
                  Fechar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog fullscreen v-model="dialogFinancing" activator="parent">
            <v-card>
              <ActionsFinancialView />
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="primary" variant="tonal" @click="dialogFinancing = false; initialize();">
                  Fechar
                </v-btn>
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
      <template v-slot:item.responsible_id="{ item }">
        {{ getResponsibleNameById(item.raw.responsible_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.international="{ item }">
        {{ getBooleanType(item.raw.international) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.free="{ item }">
        {{ getBooleanType(item.raw.free) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.status="{ item }">
        {{ getStatusTitle(item.raw.status) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-btn variant="tonal" size="small" icon="mdi-dots-vertical" flat color="primary">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent" color="secondary">
            <v-list>
              <v-list-item prepend-icon="mdi-pencil" title="Editar" size="small"
                @click="editAction(item.raw)"></v-list-item>
              <v-list-item prepend-icon="mdi-delete" title="Excluir" size="small"
                @click="deleteAction(item.raw)"></v-list-item>
              <v-list-item prepend-icon="mdi-account-multiple" title="Membros"
                @click="dialogMembers = true"></v-list-item>
              <v-list-item prepend-icon="mdi-cash-multiple" title="Financiamentos"
                @click="dialogFinancing = true"></v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
      <template v-slot:no-data> Não há dados para exibir!</template>
    </v-data-table>
  </div>
</template>


<script>
import moment from 'moment'
import ActionsMembersView from '../views/ActionsMembersView.vue'
import ActionsFinancialView from '../views/ActionsFinancialView.vue'
export default {
  components: {
    ActionsMembersView,
    ActionsFinancialView
  },
  data: () => ({
    valid: false,
    dialog: false,
    itemsDelete: false,
    dialogMembers: false,
    dialogFinancing: false,
    headers: [
      {
        title: "Título",
        align: "start",
        key: "title",
      },
      { title: "Tipo", key: "type" },
      { title: "Responsável", key: "responsible_id" },
      { title: "Internacional", key: "international" },
      { title: "Data de inicio", key: "started_at" },
      { title: "Gratuito", key: "free" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    relatedSubjectsItems: [],
    itemsPeople: [],
    itemsType: [],
    action: {},
    disabled: null,
    defaultAction: {
      id_: null,
      type: null,
      description: null,
      keywords: null,
      responsible_id: null,
      status: null,
      related_subjects: null,
      international: null,
      started_at: null,
      ended_at: null,
      free: null,
    },
    status: [
      {
        title: "Em andamento",
        value: "in_progress"
      },
      {
        title: "Finalizada",
        value: "fineshed"
      },
      {
        title: "Cancelada",
        value: "cancelled"
      }
    ]
  }),


  computed: {
    formTitle() {
      return !this.action._id ? "Nova ação" : "Editar ação";
    },
  },

  watch: {
    'action.status'(newValue) {
      if (newValue === 'in_progress') {
        this.disabled = 'disabled';
        this.action.ended_at = null;
      } else {
        this.disabled = null;
      }
    },
  },

  created() {
    this.initialize();
    this.getActionSubjects();
    this.initializePeople();
    this.initializeActionTypes();
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
        .get("actions/")
        .then((response) => {
          this.items = response.data;
          this.items.forEach((memberGroup) => {
            if (!this.items.started_at) {
              memberGroup.started_at = this.getDate(memberGroup.started_at);
            }
            if (!this.items.ended_at) {
              memberGroup.ended_at = this.getDate(memberGroup.ended_at);
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
          let people = response.data;
          people.forEach((person) => {
            if (person.institution_id === this.$store.getters.getUnicamp_id) {
              this.itemsPeople.push(person);
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    initializeActionTypes() {
      this.$axios.get("https://test-bapex.fe.unicamp.br/api/action-types").then((response) => {
        this.itemsType = response.data.data;
      }).catch((error) => {
        console.log(error)
      });
    },

    editAction(item) {
      this.action = item;
      this.dialog = true;
    },

    deleteAction(item) {
      this.action = item;
      this.itemsDelete = true;
    },

    deleteActionConfirm() {
      this.$axios
        .delete("actions/" + this.action._id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize();
            this.itemsDelete = false;
            this.$toast.success(response.statusText);
          } else {
            this.$toast.error(response.statusText);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.action = this.defaultAction;
    },

    getActionSubjects() {
      this.$axios.get("https://test-bapex.fe.unicamp.br/api/action-subjects").then((response) => {
        this.relatedSubjectsItems = response.data.data;
      })
    },

    save() {
      this.action.started_at = this.setDate(this.action.started_at);
      if (this.action.ended_at) {
        this.action.ended_at = this.setDate(this.action.ended_at);
      }
      if (this.action._id) {
        this.$axios
          .put("actions/" + this.action._id, this.action)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.action = this.defaultAction;
              this.items.forEach((action) => {
                action.started_at = this.getDate(action.started_at);
                action.ended_at = this.getDate(action.ended_at);
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
          .post("actions/", this.action)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.action = this.defaultAction;
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
    getTypeTitle(type) {
      const typeItems = this.itemsType.find(
        (item) => item.type === type
      );
      return typeItems ? typeItems.label : "";
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
    getResponsibleNameById(responsibleId) {
      const responsible = this.itemsPeople.find(
        (item) => item._id === responsibleId
      );
      return responsible ? responsible.full_name : "";
    },
    getBooleanType(isTrue) {
      return isTrue ? 'Sim' : 'Não';
    },
    getStatusTitle(statusId) {
      for (let gridStatus of this.status) {
        if (gridStatus.value === statusId) {
          return gridStatus.title;
        }
      }
    },
  },
}
</script>
<style></style>
