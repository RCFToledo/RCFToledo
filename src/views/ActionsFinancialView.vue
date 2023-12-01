<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Ações (Financiamentos)</v-toolbar-title>
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
                        item-title="name" item-value="_id" :rules="[
                          () => !!action.institution_id || 'Instituição é requerida!',
                        ]" label="Instituição" required></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="action.amount" label="R$" v-mask-decimal.br="2" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.started_at" label="Data de início" :rules="[
                        () => !!action.started_at || 'Data de ínicio é requirido',
                        () => !compareDates(action.started_at, action.ended_at) || 'Data de inicio é maior que termino'
                      ]" required v-mask-date.br></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.ended_at" label="Data de término" :rules="[
                        () => !!action.ended_at || 'Data de término é requirido',
                        () => !compareDates(action.started_at, action.ended_at) || 'Data de termino é menor que inicial',
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
        {{ convertByBrazilDefault(item.raw.amount) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.institution_id="{ item }">
        {{  getInstitutionsFinacialNameById(item.raw.institution_id) }}
      </template>
     
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon title="Editar" size="small" class="me-2" @click="editAction(item.raw)">mdi-pencil</v-icon>
        <v-icon title="Excluir" size="small" @click="deleteAction(item.raw)">mdi-delete</v-icon>
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
    itemsDelete: false,
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
      id_: null,
      institution_id: null,
      amount: null,
      started_at: null,
      ended_at: null,
    },
  }),


  computed: {
    formTitle() {
      return !this.action._id ? "Nova Ação" : "Editar Informações";
    },
  },

  created() {
    this.initialize();
    this.initializeInstitutionsFinancial();
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
        .get("financing/")
        .then((response) => {
          this.items = response.data;
          this.items.forEach((action) => {
            if (!this.items.started_at) {
              action.started_at = this.getDate(action.started_at);
            }
            if (!this.items.ended_at) {
              action.ended_at = this.getDate(action.ended_at);
            }
            if(!this.items.amount) {
              action.amount = action.amount.toFixed(2).toString()
            }
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeInstitutionsFinancial() {
      this.$axios
        .get("institutionsF/")
        .then((response) => {
          this.itemsInstitutionsFinancial = response.data;
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
        .delete("financing/" + this.action._id)
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

    save() {
      this.action.amount = this.convertByUnitedStatesDefault(this.action.amount)
      this.action.started_at = this.setDate(this.action.started_at)
      if (this.action.ended_at) {
        this.action.ended_at = this.setDate(this.action.ended_at)
      }
      if (this.action._id) {
        this.$axios
          .put("financing/" + this.action._id, this.action)
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
          .post("financing", this.action)
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
    convertByUnitedStatesDefault(amount) {
      let amountUS = amount.replace(/[,.]/g, function (match) {
        return match === ',' ? '.' : '';
      });
      let amountFloat = parseFloat(amountUS);
      return amountFloat.toFixed(2);
    },
    convertByBrazilDefault(amount) {
      let amountString = parseFloat(amount).toFixed(2).toString()
      let amountBR = amountString.replace(/[,.]/g, function (match) {
        return match === '.' ? ',' : '';
      });
      return amountBR;
    },
    getInstitutionsFinacialNameById(institutionId) {
      const institution = this.itemsInstitutionsFinancial.find(
        (item) => item._id === institutionId
      );
      return institution ? institution.name : "";
    }
  },
}
</script>
<style></style>
