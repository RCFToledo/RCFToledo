<template>
  <div>
    <v-data-table :headers="headers" :search="search" :items="items" item-key="id" class="elevation-1"
      :page="currentPage" :items-per-page="configPagination.per_page">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Ações</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn variant="tonal" style="margin-right: 10px" size="x-large" density="compact" icon="mdi-magnify"
            @click="searchClick = !searchClick" v-if="searchClick">
          </v-btn>
          <v-card-text v-else>
            <v-text-field append-inner-icon="mdi-magnify" density="compact" label="Buscar docente" variant="solo"
              hide-details single-line @click:append-inner="searchClick = !searchClick" v-model="search"
              @update:modelValue="handleSearchUpdate(search)"></v-text-field></v-card-text>
          <download-csv :labels="labels" :data="itemsExport" style="margin-right: 10px" name="ações.csv"
            :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" size="x-large" density="compact" :loading="loading" title="Exportar CSV"
              variant="tonal"></v-btn>
          </download-csv>
          <v-dialog v-model="dialog" fullscreen>
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark
                @click="action = { ...defaultAction }, tabModal = 0, isTab = 'Título', input_disabled = false"></v-btn>
            </template>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                <v-tabs v-model="tabModal">
                  <v-tab v-for="(item, index) in filterTabTitles(tabTitle)" :key="index" @click="isTab = item"
                    :value="index">{{
                      item
                    }}</v-tab>
                </v-tabs>
                <v-spacer></v-spacer>
                <v-tabs hide-slider>
                  <v-tab v-ripple="false"><v-btn icon title="Fechar" class="rounded-circle ml-2" variant="tonal"
                      @click="dialog = false, initialize(currentPage)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn></v-tab>
                </v-tabs>
              </v-toolbar>
              <v-container fluid>
                <v-card-text>
                  <v-form ref="form" lazy-validation>
                    <v-row v-if="isTab === 'Título'">
                      <v-col cols="12" md="12">
                        <v-text-field :disabled="input_disabled" :maxlength="120" variant="outlined"
                          v-model="action.title" :rules="[
                            () => !!action.title || 'Título é requerido!',
                          ]" label="Título" :counter="120" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <my-autocomplete :disabled="input_disabled" v-model="action.responsible_id" :items="itemsPeople"
                          url="http://127.0.0.1:8000/api/people" itemTitle="full_name" itemValue="id" :rules="[
                            () => !!action.responsible_id || 'Responsável é requerido!',
                          ]" label="Responsável">
                        </my-autocomplete>
                      </v-col>
                      <v-col cols="12" md="12">
                        <my-autocomplete :disabled="input_disabled" v-model="action.assistant_id" :items="itemsPeople"
                          url="http://127.0.0.1:8000/api/people" itemTitle="full_name" itemValue="id" :rules="[
                            () => !!action.assistant_id || 'Auxiliar é requerido!',
                          ]" label="Auxiliar">
                        </my-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row dense v-else-if="isTab === 'Dados'">
                      <v-col cols="12" md="12">
                        <v-select :disabled="input_disabled" variant="outlined" v-model="action.type" label="Tipo"
                          :items="itemsType" item-title="label" item-value="type" :rules="[
                            () => !!action.type || 'Tipo é requerido!',
                          ]"></v-select>
                      </v-col>
                      <v-col cols="12" md="12">
                        <my-autocomplete :disabled="input_disabled" :multiple="true" :chips="true"
                          v-model="action.subjects" :items="relatedSubjectsItems"
                          url="http://127.0.0.1:8000/action-subjects" itemTitle="subject" itemValue="id"
                          label="Temas relacionados">
                        </my-autocomplete>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-combobox :disabled="input_disabled" variant="outlined"
                          @update:modelValue="getKeyword(action.keywords)" chips multiple :return-object="false"
                          v-model="action.keywords" item-title="keyword" item-value="id" label="Palavras-chave"
                          required>
                          <!-- eslint-disable-next-line -->
                        </v-combobox>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field :disabled="input_disabled" type="date" variant="outlined"
                          v-model="action.started_at" label="Data de início" :rules="[
                            () => !!action.started_at || 'Data de ínicio é requirido',
                          ]" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field type="date" variant="outlined" v-model="action.ended_at" label="Data de término"
                          :rules="[
                          ]" :disabled="input_disabled"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-switch :disabled="input_disabled" variant="outlined"
                          :color="action.international ? 'primary' : 'green'" v-model="action.international" inset
                          :label="action.international ? 'Internacional' : 'Nacional'"></v-switch>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-switch :disabled="input_disabled" variant="outlined" color="primary" v-model="action.free"
                          inset :label="action.free ? 'Gratuito' : 'Pago'"></v-switch>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-textarea :disabled="input_disabled" variant="outlined" v-model="action.description" :rules="[
                          () => !!action.description || 'Descrição é requerida!',
                        ]" label="Descrição" required></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row dense
                      v-else-if="isTab === 'Avaliar' && filterRoles($store.getters.getResourceAccess.bapex.roles, 'action.evaluate')">
                      <v-col cols="12" md="12">
                        <v-select variant="outlined" v-model="action.status" :items="status" item-value="value"
                          item-title="title" label="Situação" :rules="[
                            () => !!action.status || 'Situação é requerida',
                          ]" required></v-select>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-textarea variant="outlined" v-model="action.justify" label="Justificativa"
                          required></v-textarea>
                      </v-col>
                    </v-row>
                    <v-spacer></v-spacer>
                    <v-card :disabled="action.status === 'in_progress'"
                      v-if="isTab === 'Financiamentos' && action.status !== 'cancelled' && action.status !== 'repproved' && action.id">
                      <ActionsFinancialView :actionId="action.id" />
                    </v-card>
                    <v-card variant="tonal" v-if="isTab === 'Financiamentos' && !action.id">
                      <v-card-title>Os dados precisam ser inseridos no sistema para liberar essa parte</v-card-title>
                    </v-card>
                    <v-card :disabled="action.status === 'in_progress'"
                      v-if="isTab === 'Curricularização' && action.status !== 'cancelled' && action.status !== 'repproved' && action.id">
                      <ActionsExtensionActivitiesView :actionId="action.id" />
                    </v-card>
                    <v-card variant="tonal" v-if="isTab === 'Curricularização' && !action.id">
                      <v-card-title>Os dados precisam ser inseridos no sistema para liberar essa parte</v-card-title>
                    </v-card>
                    <v-card :disabled="action.status === 'in_progress'"
                      v-if="isTab === 'Membros' && action.status !== 'cancelled' && action.status !== 'repproved' && action.id">
                      <ActionsMembersView :actionId="action.id" />
                    </v-card>
                    <v-card variant="tonal" v-if="isTab === 'Membros' && !action.id">
                      <v-card-title>Os dados precisam ser inseridos no sistema para liberar essa parte</v-card-title>
                    </v-card>
                    <v-card
                      v-if="isTab === 'Enviar' && filterRoles($store.getters.getResourceAccess.bapex.roles, 'action.evaluate')"
                      variant="tonal">
                      <v-col cols="12" md="12" class="text-body-1 text-left">
                        <v-btn @click="title_disabled = !title_disabled, saveTerm(term, title_disabled)"
                          :color="title_disabled ? '' : 'green'" variant="tonal" prepend-icon="mdi-pencil-box"
                          style="margin-bottom: 1vw;">{{ title_disabled ? "Editar" : "Salvar" }} titulo do
                          texto</v-btn>
                        <v-text-field clearable variant="outlined" v-model="term.term_title"
                          :disabled="title_disabled"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-btn @click="term_disabled = !term_disabled, saveTerm(term, term_disabled)"
                          :color="term_disabled ? '' : 'green'" variant="tonal" prepend-icon="mdi-pencil-box"
                          style="margin-bottom: 1vw;">{{ term_disabled ? "Editar" : "Salvar" }} corpo do texto</v-btn>
                        <v-textarea clearable variant="outlined" v-model="term.term"
                          :disabled="term_disabled"></v-textarea>
                      </v-col>
                    </v-card>
                    <v-card
                      v-if="isTab === 'Enviar' && filterRoles($store.getters.getResourceAccess.bapex.roles, 'action.send') && !filterRoles($store.getters.getResourceAccess.bapex.roles, 'action.evaluate')"
                      variant="tonal">
                      <v-card-title> {{ term.term_title }}</v-card-title>
                      <v-card-text class="text-body-1 text-left">{{ term.term }}</v-card-text>
                      <v-card-actions>
                        <v-checkbox class="elevation-0"
                          label="Declaro que estou ciente de todas responsabilidades sobre a Ação"
                          v-model="action.acceptTerm" :rules="[
                            () => !!action.acceptTerm || 'Aceitar o termo é requerido',
                          ]" required
                          @click="action.term = term.term, action.term_title = term.term_title"></v-checkbox>
                      </v-card-actions>
                    </v-card>
                    <v-col>
                      <v-btn color="primary" variant="tonal"
                        @click="action.title ? formSubmit() : $toast.error('Título é requerido');"
                        v-if="action.status !== 'in_progress' && isTab !== 'Financiamentos' && isTab !== 'Curricularização' && isTab !== 'Membros' && filterRoles($store.getters.getResourceAccess.bapex.roles, 'action.evaluate')">{{
                          isTab !== 'Enviar' ? 'Salvar' :
                            'Finalizar' }}</v-btn>
                      <v-btn color="primary" variant="tonal"
                        @click="action.title ? formSubmit() : $toast.error('Título é requerido');"
                        v-if="filterRoles($store.getters.getResourceAccess.bapex.roles, 'action.evaluate') && (isTab === 'Avaliar' && isTab !== 'Enviar') && isTab !== 'Financiamentos' && isTab !== 'Membros' && isTab !== 'Curricularização' && action.status === 'in_progress'">Enviar</v-btn>
                    </v-col>
                  </v-form>
                </v-card-text>
              </v-container>
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
      <template v-slot:item.type="{ item }">
        {{ getTypeTitle(item.type) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.responsible_id="{ item }">
        {{ getResponsibleNameById(item.responsible_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.international="{ item }">
        {{ getBooleanType(item.international) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.free="{ item }">
        {{ getBooleanType(item.free) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.status="{ item }">
        {{ getStatusTitle(item.status) }}
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
        <v-btn variant="tonal" size="small" icon="mdi-dots-vertical" flat color="primary">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent" color="secondary"
            @click="item.status === 'in_progress' ? input_disabled = true : input_disabled = false">
            <v-list>
              <v-list-item class="bg-primary" size="small">Editar</v-list-item>
              <v-list-item prepend-icon="mdi-pencil" title="Título" size="small"
                @click="editAction(item, 'Título')"></v-list-item>
              <v-list-item prepend-icon="mdi-database" title="Dados"
                @click="editAction(item, 'Dados', 1)"></v-list-item>
              <v-list-item prepend-icon="mdi-cash-multiple" title="Financiamentos"
                @click="editAction(item, 'Financiamentos', 2)"></v-list-item>
              <v-list-item prepend-icon="mdi-puzzle" title="Curricularização"
                @click="editAction(item, 'Curricularização', 3)"></v-list-item>
              <v-list-item prepend-icon="mdi-account-multiple" title="Membros"
                @click="editAction(item, 'Membros', 4)"></v-list-item>
              <v-list-item prepend-icon="mdi-poll" title="Avaliação" @click="editAction(item, 'Avaliar', 6)"
                v-if="filterRoles($store.getters.getResourceAccess.bapex.roles, 'action.evaluate')"></v-list-item>
              <v-list-item prepend-icon="mdi-delete" title="Excluir" size="small" @click="deleteAction(item)"
                v-if="filterRoles($store.getters.getResourceAccess.bapex.roles, 'action.delete')"></v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
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
      <template v-slot:no-data>Não há dados para exibir!</template>
    </v-data-table>
  </div>
</template>


<script>
import moment from 'moment'
import ActionsMembersView from '../views/ActionsMembersView.vue'
import ActionsFinancialView from '../views/ActionsFinancialView.vue'
import ActionsExtensionActivitiesView from '../views/ActionsExtensionActivitiesView.vue'

export default {
  components: {
    ActionsMembersView,
    ActionsFinancialView,
    ActionsExtensionActivitiesView,
  },
  data: () => ({
    valid: false,
    dialog: false,
    itemsDelete: false,
    term: {},
    isTab: 'Título',
    tabModal: null,
    currentPage: 1,
    configPagination: [],
    tabTitle: [
      'Título',
      'Dados',
      'Financiamentos',
      'Curricularização',
      'Membros',
      'Enviar',
      'Avaliar',
    ],
    user: 'staff',
    itemsExport: [],
    loading: true,
    searchClick: true,
    search: '',
    headers: [
      {
        title: "Título",
        align: "start",
        key: "title",
      },
      { title: "Tipo", key: "type" },
      { title: "Responsável", key: "responsible_id" },
      { title: "Situação", key: "status" },
      { title: "Data de inicio", key: "started_at" },
      { title: "Data de termino", key: "ended_at" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    relatedSubjectsItems: [],
    itemsPeople: [],
    itemsType: [],
    action: {},
    deleteKeywords: null,
    input_disabled: false,
    title_disabled: true,
    term_disabled: true,
    disabled: null,
    labels: {
      id: 'Registro',
      name: 'Nome',
      title: "Titulo",
      description: 'Descrição',
      type: 'Tipo',
      keywords: 'Palavras Chaves',
      responsible_id: 'Responsável',
      status: 'Estado',
      related_subjects: 'Temas relacionados',
      international: 'Internacional',
      started_at: 'Começou em',
      ended_at: 'Acabou em',
      free: 'Grátis',
      assistant_id: 'Assistente',
      justify: 'Justificativa',
      updated_at: 'Atualizado em',
      created_at: 'Criado em',
    },
    defaultAction: {
      id: null,
      type: null,
      title: null,
      description: null,
      responsible_id: null,
      status: null,
      subjects: null,
      international: null,
      started_at: null,
      ended_at: null,
      free: null,
      assistant_id: null,
      justify: null,
    },
    defaultTerm: {
      id: null,
      term: null,
      term_title: null,
    },
    status: [
      {
        title: "Em análise",
        value: "in_progress"
      },
      {
        title: "Aprovada",
        value: "approved"
      },
      {
        title: "Reprovada",
        value: "repproved"
      },
      {
        title: "Cancelada",
        value: "cancelled"
      },
      {
        title: "Rascunho",
        value: "draft"
      },
      {
        title: "Devolvido para alteração",
        value: "returned_to_change"
      }
    ]
  }),


  computed: {
    formTitle() {
      return !this.action.id ? "Nova ação" : "Editar ação";
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
    console.log(this.items)
    this.initialize(1);
    this.getActionSubjects();
    this.initializePeople();
    this.initializeActionTypes();
    this.initializeExportData();
    this.initializeTerm();
  },
  methods: {
    formSubmit() {
      this.$refs.form.validate().then((isValid) => {
        if (isValid.valid) {
          this.save();
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

    handleSearchUpdate(value) {
      if (value) {
        this.items = this.professorFilterByAction(value);
      } else {
        this.items = [];
      }
    },
    saveKeywords(keywords, actionId) {
      if (keywords) {
        const keywordsList = keywords.map(keyword => {
          return {
            keyword: keyword,
            action_id: actionId
          };
        })
        console.log(keywordsList);
        this.$axios
          .delete("http://127.0.0.1:8000/api/action-keywords/" + this.deleteKeywords)
          .then((response) => {
            if (response.status !== 200) {
              this.$toast.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
          });
        this.$axios
          .post("http://127.0.0.1:8000/api/action-keywords", keywordsList)
          .then((response) => {
            if (response.status !== 200) {
              this.action.keywords = response.data.data;
              this.getKeyword(this.action.keywords);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    filterTabTitles(tabTitle) {
      if (!this.filterRoles(this.$store.getters.getResourceAccess.bapex.roles, 'action.evaluate')) {
        tabTitle = tabTitle.filter(title => title !== 'Avaliar');
      }
      return tabTitle;
    },

    filterRoles(groupRoles, roleTab) {
      const isRole = groupRoles.filter(role => role === roleTab)
      return isRole[0] === roleTab ? true : false;
    },
    initialize(page) {
      const url = `http://127.0.0.1:8000/api/actions?page=${page}&include[]=subjects&include[]=keywords`;
      this.$axios
        .get(url)
        .then((response) => {
          this.items = response.data.data;
          console.log(this.items);
          this.configPagination = response.data.meta;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeTerm() {
      this.$axios
        .get(`https://test-bapex.fe.unicamp.br/api/actions-term`)
        .then((response) => {
          if (response.data.data[0].term || response.data.data[0].term_title) {
            this.term = response.data.data[0];
          } else {
            this.term = this.defaultTerm;
          }
          console.log(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    saveTerm(item, isDisabled) {
      console.log(item);
      if (this.term.id && isDisabled) {
        this.$axios
          .put("https://test-bapex.fe.unicamp.br/api/actions-term/" + this.term.id, item)
          .then((response) => {
            this.initializeTerm();
            this.$toast.success(response.data.message);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      else if (isDisabled) {
        console.log('post')
        this.$axios
          .post("https://test-bapex.fe.unicamp.br/api/actions-term", item)
          .then((response) => {
            this.initialize();
            this.$toast.success(response.data.message);
          })
          .catch((error) => {
            console.error(error);
          });
      }
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

    initializePeople() {
      this.$axios
        .get("https://test-people.fe.unicamp.br/api/people")
        .then((response) => {
          let people = response.data.data;
          console.log(response.data);
          people.forEach((person) => {
            if (person.institution_id == 1 && person.academic_profile !== 'staff') {
              this.itemsPeople.push(person);
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    initializeActionTypes() {
      this.$axios.get("https://test-bapex.fe.unicamp.br/api/action-types",).then((response) => {
        this.itemsType = response.data.data;
      }).catch((error) => {
        console.log(error)
      });
    },

    editAction(item, tab, index) {
      this.action = item;
      this.dialog = true;
      this.isTab = tab;
      this.tabModal = index;
      if (tab === 'Dados' && this.action.keywords) {
        this.getKeyword(this.action.keywords);
      }
    },

    deleteAction(item) {
      this.action = item;
      this.itemsDelete = true;
    },

    deleteActionConfirm() {
      this.$axios
        .delete("http://127.0.0.1:8000/api/actions/" + this.action.id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize(this.currentPage);
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

    getActionSubjects() {
      this.$axios.get("https://test-bapex.fe.unicamp.br/api/action-subjects",).then((response) => {
        this.relatedSubjectsItems = response.data.data;
      })
    },

    save() {
      if (this.isTab === 'Enviar') {
        this.action.status = "in_progress"
      } else if (this.isTab !== 'Avaliar') {
        this.action.status = "draft"
      }
      const actionKeywords = this.action.keywords;
      if (this.action.id) {
        this.$axios
          .put("http://127.0.0.1:8000/api/actions/" + this.action.id, this.action)
          .then((response) => {
            if (response.status == 200) {
              this.saveKeywords(actionKeywords, this.action.id);
              this.initialize(this.currentPage);
              this.$toast.success(response.data.message);
              if (this.isTab === 'Enviar') {
                this.dialog = false;
                this.action = { ...this.defaultAction};
              }
            } else {
              this.$toast.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.$axios
          .post("http://127.0.0.1:8000/api/actions", this.action)
          .then((response) => {
            if (response.status == 201) {
              this.saveKeywords(actionKeywords, response.data.data.id);
              this.initialize(this.currentPage);
              this.$toast.success(response.data.message);
              this.action = response.data.data;
              if (this.isTab === 'Enviar') {
                this.dialog = false;
                this.action = { ...this.defaultAction };
              }
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
    getResponsibleNameById(responsibleId) {
      const responsible = this.itemsPeople.find(
        (item) => item.id === responsibleId
      );
      return responsible ? responsible.full_name : "";
    },
    getKeyword(keywords) {
      // Verifique se keywords é um array e não está vazio
      if (Array.isArray(keywords) && keywords.length > 0) {
        console.log('Keywords array é válido:', keywords);

        // Verifique se this.action e this.action.keywords estão definidos e são arrays
        if (this.action && Array.isArray(this.action.keywords)) {
          console.log('this.action.keywords inicial:', this.action.keywords);

          // Verifique se todos os elementos de this.action.keywords possuem a propriedade id
          const allHaveId = this.action.keywords.every(keyword => Object.prototype.hasOwnProperty.call(keyword, 'id'));

          if (allHaveId) {
            // Extraia os IDs dos elementos de this.action.keywords
            this.deleteKeywords = this.action.keywords.map(keyword => keyword.id).join(',');
            console.log('IDs extraídos:', this.deleteKeywords);

            // Verifique se todos os elementos de keywords possuem a propriedade keyword
            const allHaveKeyword = keywords.every(item => Object.prototype.hasOwnProperty.call(item, 'keyword'));

            if (allHaveKeyword) {
              // Atualize this.action.keywords para conter apenas as keywords do novo array
              this.action.keywords = keywords.map(item => item.keyword);
              console.log('this.action.keywords atualizado:', this.action.keywords);
            } else {
              console.error('Erro: Nem todos os elementos de keywords possuem a propriedade keyword');
            }
          } else {
            console.error('Erro: Nem todos os elementos de this.action.keywords possuem a propriedade id');
          }
        } else {
          console.error('Erro: this.action.keywords não é um array ou está indefinido');
        }
      } else {
        console.error('Erro: keywords não é um array válido ou está vazio');
      }
    },
    isSimpleArray(array) {
      return array.every(item => {
        return (
          typeof item === 'string' ||
          typeof item === 'number' ||
          typeof item === 'boolean' ||
          item === null ||
          item === undefined
        );
      });
    },
    professorFilterByAction(value) {
      this.$axios
        .get(`http://127.0.0.1:8000/api/actions/responsible/${value}`)
        .then((response) => {
          this.items = response.data.data
          console.log(response.data.data)
        })
        .catch((error) => {
          console.error('API Error:', error);
        });
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
