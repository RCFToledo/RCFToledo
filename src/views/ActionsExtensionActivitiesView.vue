<template>
  <div>
    <v-data-table :headers="headers" :search="search" :items="items" item-key="id" class="elevation-1"
      :page="currentPage" :items-per-page="configPagination.per_page">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Curricularização - Atividade de Extensão</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :labels="labels" :data="itemsExport" style="margin-right: 10px" name="ações.csv"
            :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" size="x-large" density="compact" :loading="loading" title="Exportar CSV"
              variant="tonal"></v-btn>
          </download-csv>
          <v-dialog persistent v-model="dialog" max-width="80%">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark
                @click="action = { ...defaultAction }, tabModal = 0, isTab = 'Título', input_disabled = false"></v-btn>
            </template>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-container fluid>
                <v-card-text>
                  <v-form ref="form" lazy-validation>
                    <v-row dense>
                      <v-col cols="12" md="10">
                        <v-text-field :disabled="input_disabled" :maxlength="120" variant="outlined"
                          v-model="action.discipline_name" :rules="[
                            () => !!action.discipline_name || 'Nome da disciplina é requerido!',
                          ]" label="Nome da disciplina" :counter="120" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field :disabled="input_disabled" :maxlength="10" variant="outlined"
                          v-model="action.discipline_code" :rules="[
                            () => !!action.discipline_code || 'Código da disciplina é requerido!',
                          ]" label="Código da disciplina" :counter="10" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field :disabled="input_disabled" :maxlength="120" variant="outlined"
                          v-model="action.objective" :rules="[
                            () => !!action.objective || 'Objetivo da atividade é requerido!',
                          ]" label="Objetivo" :counter="120" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field :disabled="input_disabled" :maxlength="120" variant="outlined"
                          v-model="action.local" :rules="[
                            () => !!action.local || 'Local é requerido!',
                          ]" label="Local" :counter="120" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field :disabled="input_disabled" :maxlength="120" variant="outlined"
                          v-model="action.target_audience" :rules="[
                            () => !!action.target_audience || 'Público-alvo é requerido!',
                          ]" label="Público-alvo" :counter="120" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field :disabled="input_disabled" variant="outlined" v-model="action.estimated_cost"
                          :rules="[
                            () => !!action.estimated_cost || 'Custo estismado é requerido!',
                          ]" label="Custo estimado (R$)" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field :disabled="input_disabled" type="date" variant="outlined"
                          v-model="action.started_at" label="Data de início" :rules="[
                            () => !!action.started_at || 'Data de ínicio é requirido',
                          ]" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field type="date" variant="outlined" v-model="action.ended_at" label="Data de término"
                          :rules="[
                          ]" :disabled="disabled"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-textarea :disabled="input_disabled" variant="outlined" v-model="action.expected_results"
                          :rules="[
                            () => !!action.expected_results || 'Descrição dos resultados e dos impactos esperados é requerida!',
                          ]" label="Descrição dos resultados e dos impactos esperados" required></v-textarea>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-textarea :disabled="input_disabled" variant="outlined" v-model="action.description" :rules="[
                          () => !!action.description || 'Descrição da atividade é requerida!',
                        ]" label="Descrição da atividade" required></v-textarea>
                      </v-col>
                    </v-row>
                    <v-spacer></v-spacer>
                  </v-form>
                </v-card-text>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="blue-darken-1" variant="plain" @click="dialog = false; initialize(currentPage);">
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
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.started_at="{ item }">
        {{ getDate(item.started_at) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.ended_at="{ item }">
        {{ getDate(item.ended_at) }}
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
          <v-pagination rounded="circle" show-first-last-page :length="configPagination.last_page" :total-visible="1" v-model="currentPage"
            @next="initialize(currentPage, actionId)" @prev="initialize(currentPage, actionId)" @first="initialize(1, actionId)"
            @last="initialize(configPagination.last_page, actionId)">
          </v-pagination>
        </v-footer>
      </template>
      <template v-slot:no-data>Não há dados para exibir!</template>
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
    currentPage: 1,
    configPagination: [],
    itemsExport: [],
    loading: true,
    headers: [
      { title: "Disciplina", key: "discipline_name", align: "start",},
      { title: "Código da disciplina", key: "discipline_code" },
      { title: "Público-alvo", key: "target_audience" },
      { title: "Local(is) da atividade", key: "local" },
      { title: "Começou em", key: "started_at" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    relatedSubjectsItems: [],
    action: {},
    input_disabled: false,
    disabled: null,
    labels: {
      id: 'Registro',
      description: 'Descrição',
      started_at: 'Começou em',
      ended_at: 'Acabou em',
      updated_at: 'Atualizado em',
      created_at: 'Criado em',
      requested_amount: 'Valor requirido',
      discipline_name: 'Nome da disciplina',
      discipline_code: 'Código da disciplina',
      objective: 'Objetivo da atividade',
      target_audience: ' Público-alvo',
      local: 'Local(is) da atividade',
      expected_results: 'Descrição dos resultados e dos impactos esperados',
      estimated_cost: 'Custo estimado da atividade',
    },
    defaultAction: {
      id: null,
      requested_amount: null,
      discipline_name: null,
      discipline_code: null,
      objective: null,
      target_audience: null,
      local: null,
      expected_results: null,
      estimated_cost: null,
      started_at: null,
      ended_at: null,
    },
  }),


  computed: {
    formTitle() {
      return !this.action.id ? "Nova ação" : "Editar ação";
    },
  },

  created() {
    this.initialize(1, this.actionId);
    this.initializeExportData();
  },
  methods: {
    formSubmit() {
      this.$refs.form.validate().then((isValid) => {
        if (isValid.valid) {
          this.save(this.actionId);
        }
      });
    },
    textFilter(index, value, url) {
      this.$axios
        .get(`${url}?textFilters[${index}]=${encodeURIComponent(value)}`)
        .then((response) => {
          this.itemsPeople = response.data.data;
          console.log(value);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    filterRoles(groupRoles, roleTab) {
      const isRole = groupRoles.filter(role => role === roleTab)
      return isRole[0] === roleTab ? true : false;
    },
    initialize(page, id) {
      this.$axios
        .get(`https://test-bapex.fe.unicamp.br/api/actions/${id}/curricularization?page=${page}`)
        .then((response) => {
          this.items = response.data.data;
          this.configPagination = response.data.meta;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeExportData() {
      this.$axios
        .get(`https://test-bapex.fe.unicamp.br/api/actions-export`)
        .then((response) => {
          this.itemsExport = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
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
        .delete(`https://test-bapex.fe.unicamp.br/api/actions/${this.actionId}/curricularization/${this.actions.id}`)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize(this.currentPage, this.actionId);
            this.itemsDelete = false;
            this.$toast.success(response.data.message);
          } else {
            this.$toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
        this.action = this.defaultAction;
    },
    save(id) {
      this.action.action_id = id;
      if (this.action.id) {
        this.$axios
          .put(`https://test-bapex.fe.unicamp.br/api/actions/${id}/curricularization/${this.action.id}`, this.action)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize(this.currentPage, this.actionId);
              this.action = this.defaultAction;
              this.items.forEach((action) => {
                action.started_at = this.getDate(action.started_at);
                action.ended_at = this.getDate(action.ended_at);
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
          .post(`https://test-bapex.fe.unicamp.br/api/actions/${id}/curricularization`, this.action)
          .then((response) => {
            console.log(response);
            if (response.status == 201) {
              this.initialize(this.currentPage, this.actionId);
              this.action = this.defaultAction;
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
  },
}
</script>
<style></style>