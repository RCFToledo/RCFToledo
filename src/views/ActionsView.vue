<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Ações</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="instituições.csv" :delimiter="';'">
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
                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.name" :rules="[
                        () => !!action.name || 'Nome é requerido!',
                        () => !(action.name.length > 60) || 'Nome maior que o suportado',
                      ]" label="Nome" :counter="60" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.abbr_name" label="Nome Abreviado" :rules="[
                        () => !!action.abbr_name || 'Nome Abreviado é requerido!',
                        () => !(action.abbr_name.length > 20) || 'Nome Abreviado maior que o suportado',
                      ]" :counter="20"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="action.type" multiple label="Tipo" :items="itemsType" item-title="typeTitle"
                        item-value="typeValue" :rules="[
                          () => !!action.type || 'Tipo é requerido!',
                        ]"></v-select>
                    </v-col>
                    <v-col cols="12" md="6" >
                      <v-select v-model="action.country_code" label="País" :items="itemsCountryCode"
                        item-title="countryTitle" item-value="countryValue" :rules="[
                          () =>
                            !!action.country_code || 'País é requerido!',
                        ]"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.title" :rules="[
                        () => !!action.title || 'Título é requerido!',
                        () => !(action.title.length > 60) || 'Título maior que o suportado',
                      ]" label="Título" :counter="60" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.description" :rules="[
                        () => !!action.description || 'Descrição é requerida!',
                        () => !(action.description.length > 200) || 'Descrição maior que o suportado',
                      ]" label="Descrição" :counter="200" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.keywords" label="Palavras-chave" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.responsible_id" label="Responsável" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="action.status" :items="['in_progress', 'finished', 'cancelled']" label="Situação"
                        required></v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.related_subjects" label="Temas relacionados" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-switch color="primary" v-model="action.international" inset label="Internacional?"></v-switch>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.started_at" label="Data de início" required v-mask-date.br></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field v-model="action.ended_at" label="Data de término" required v-mask-date.br></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-switch color="primary" v-model="action.free" inset label="Gratuito?"></v-switch>
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
                <v-btn color="primary" variant="tonal" @click="deleteItemsConfirm">
                  Excluir
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
      <template v-slot:item.country_code="{ item }">
        {{ getCountryCountryTitle(item.raw.country_code) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon title="Editar" size="small" class="me-2" @click="editItems(item.raw)">mdi-pencil</v-icon>
        <v-icon title="Excluir" size="small" @click="deleteItems(item.raw)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data> Não há dados para exibir!</template>
    </v-data-table>
  </div>
</template>


<script>
export default {
  data: () => ({
    valid: false,
    itemsType: [
      { typeTitle: "Educação", typeValue: "education" },
      { typeTitle: "Pesquisa", typeValue: "research" },
      { typeTitle: "Outros", typeValue: "other" },
    ],
    itemsCountryCode: [{ countryTitle: "Brasil", countryValue: "BR" }],
    dialog: false,
    itemsDelete: false,
    headers: [
      {
        title: "Título",
        align: "start",
        key: "title",
      },
      { title: "Tipo", key: "type" },
      { title: "Descrição", key: "description" },
      { title: "Palavras-chave", key: "keywords" },
      { title: "Responsável", key: "responsible_id" },
      { title: "Situação", key: "status" },
      { title: "Temas relacionados", key: "related_subjects" },
      { title: "Internacional", key: "international" },
      { title: "Data de inicio", key: "started_at" },
      { title: "Data de termino", key: "ended_at" },
      { title: "Pago ou gratuito", key: "free" },
      { title: "Ações", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    action: {},
    defaultAction: {
      id_: null,
      type: null,
      country_code: null,
      description: null,
      keywords: null,
      responsible_id: null,
      status: null,
      related_subjects: null,
      international: null,
      started_at: null,
      free: null,
    },
  }),

  computed: {
    formTitle() {
      return !this.action._id ? "Nova Informações" : "Editar Informações";
    },
  },

  created() {
    this.initialize();
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
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editItems(item) {
      this.action = item;
      this.dialog = true;
    },

    deleteItems(item) {
      this.action = item;
      this.itemsDelete = true;
    },

    deleteItemsConfirm() {
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

    save() {
      if (this.action._id) {
        this.$axios
          .put("actions/" + this.action._id, this.action)
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
      const selectedTypes = [];
      if (Array.isArray(type)) {
        type.forEach((value) => {
          const typeItems = this.itemsType.find(
            (item) => item.typeValue === value
          );
          if (typeItems) {
            selectedTypes.push(typeItems.typeTitle);
          }
        });
      }
      return selectedTypes.join(", "); // Retorne os títulos separados por vírgula
    },

    getCountryCountryTitle(type) {
      const typeItems = this.itemsCountryCode.find(
        (item) => item.countryValue === type
      );
      return typeItems ? typeItems.countryTitle : "";
    },
  },
}
</script>
<style></style>
