<template>
  <div>
    <v-checkbox class="elevation-0" label="Declaro que está ação não possui financiamento" v-model="declareNoFinancing"
      v-if="items.length <= 0"></v-checkbox>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1"
      v-if="!declareNoFinancing" :page="currentPage" :items-per-page="configPagination.per_page">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Financiamentos</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="ações_financiamentos.csv" :delimiter="';'">
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
                      <v-autocomplete v-model="action.institution_id" :items="itemsInstitutionsFinancial"
                        item-title="name" item-value="id" :rules="[
                          () => !!action.institution_id || 'Instituição é requerida!',
                        ]" label="Instituição" required></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="action.amount" label="R$" required :rules="[
                        () => !!action.amount || 'Valor recebido é obrigatório'
                      ]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.started_at" label="Data de início" :rules="[
                        () => !!action.started_at || 'Data de ínicio é requirido',
                        () => !compareDates(action.started_at, action.ended_at) || 'Data de inicio é maior que termino'
                      ]" required v-mask-date.br><v-icon>mdi-calendar-range</v-icon></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.ended_at" label="Data de término" :rules="[
                        () => !compareDates(action.started_at, action.ended_at) || 'Data de termino é menor que inicial',
                      ]" v-mask-date.br><v-icon>mdi-calendar-range</v-icon></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="blue-darken-1" variant="plain" @click="dialog = false; initialize(currentPage, actionId);">
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
      <template v-slot:item.amount="{ item }">
        {{ convertAmount(item.amount, 'BR') }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.institution_id="{ item }">
        {{ getInstitutionsFinacialNameById(item.institution_id) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" title="Editar" size="small" class="me-2" @click="editAction(item)">mdi-pencil</v-icon>
        <v-icon color="primary" title="Excluir" size="small" @click="deleteAction(item)">mdi-delete</v-icon>
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
    declareNoFinancing: false,
    currentPage: 1,
    configPagination: [],
    headers: [
      {
        title: "Instituição",
        align: "start",
        key: "institution_id",
      },
      { title: "Valor recebido", key: "amount" },
      { title: "Data de inicio", key: "started_at" },
      { title: "Data de termino", key: "ended_at" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    itemsInstitutionsFinancial: [],
    relatedSubjectsItems: [],
    action: {},
    defaultAction: {
      id: null,
      institution_id: null,
      amount: null,
      started_at: null,
      ended_at: null,
      action_id: null,
    },
  }),


  computed: {
    formTitle() {
      return !this.action.id ? "Novo financiamento" : "Editar financiamento";
    },
  },

  created() {
    this.initialize(1, this.actionId);
    this.initializeInstitutionsFinancial();
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
        .get(`https://test-bapex.fe.unicamp.br/api/actions/${id}/financing?page=${page}`)
        .then((response) => {
          this.items = response.data.data;
          this.configPagination = response.data.meta;
          console.log(this.configPagination)
          this.items.forEach((action) => {
            if (!this.items.started_at) {
              action.started_at = this.getDate(action.started_at);
            }
            if (!this.items.ended_at) {
              action.ended_at = this.getDate(action.ended_at);
            }
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeInstitutionsFinancial() {
      this.$axios
        .get("https://test-bapex.fe.unicamp.br/api/institutions")
        .then((response) => {
          this.itemsInstitutionsFinancial = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editAction(item) {
      this.action = item;
      this.action.amount = this.convertAmount(this.action.amount, 'BR')
      this.dialog = true;
    },

    deleteAction(item) {
      this.action = item;
      this.itemsDelete = true;
    },

    deleteActionConfirm() {
      this.$axios
        .delete(`https://test-bapex.fe.unicamp.br/api/actions/${this.actionId}/financing/${this.action.id}`)
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
      this.action.amount = this.convertAmount(this.action.amount, 'US')
      this.action.started_at = this.setDate(this.action.started_at)
      if (this.action.ended_at) {
        this.action.ended_at = this.setDate(this.action.ended_at)
      }
      if (this.action.id) {
        this.$axios
          .put(`https://test-bapex.fe.unicamp.br/api/actions/${this.actionId}/financing/${this.action.id}`, this.action)
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
          .post(`https://test-bapex.fe.unicamp.br/api/actions/${this.actionId}/financing`, this.action)
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
    convertAmount(amount, targetCountry) {
      let formattedAmount;

      if (targetCountry === 'US') {
        formattedAmount = amount.replace(/[,.]/g, match => (match === ',' ? '.' : ''));
      } else if (targetCountry === 'BR') {
        formattedAmount = amount.replace(/[,.]/g, match => (match === '.' ? ',' : ''));
      }
      return formattedAmount;
    }
    ,
    getInstitutionsFinacialNameById(institutionId) {
      const institution = this.itemsInstitutionsFinancial.find(
        (item) => item.id === institutionId
      );
      return institution ? institution.name : "";
    }
  },
}
</script>
<style></style>
