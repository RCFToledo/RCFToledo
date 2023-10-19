<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Instituições</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn
                color="teal"
                size="x-large"
                density="compact"
                icon="mdi-plus"
                v-bind="props"
                variant="tonal"
                dark
                @click="editedItem = { ...defaultItem }"
              ></v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" lazy-validation>
                    <v-row dense>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.name"
                          :rules="[
                            () => !!editedItem.name || 'Nome é requerido!',
                          ]"
                          label="Nome"
                          :counter="120"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.abbr_name"
                          label="Nome Abreviado"
                          :rules="[
                            () =>
                              !!editedItem.abbr_name ||
                              'Nome Abreviado é requerido!',
                          ]"
                          :counter="20"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          v-model="editedItem.type"
                          multiple
                          label="Tipo"
                          :items="itemsType"
                          item-title="typeTitle"
                          item-value="typeValue"
                          :rules="[
                            () => !!editedItem.type || 'Tipo é requerido!',
                          ]"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          v-model="editedItem.country_code"
                          label="País"
                          :items="itemsCountryCode"
                          item-title="codeTitle"
                          item-value="codeValue"
                          :rules="[
                            () =>
                              !!editedItem.country_code || 'País é requerido!',
                          ]"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
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
                <v-btn
                  color="blue-darken-1"
                  variant="plain"
                  @click="formSubmit"
                >
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Confirm delete -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Tem certeza que deseja remover esse item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="dialogDelete = false"
                  >Cancelar</v-btn
                >
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
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
        {{ getCountryCodeTitle(item.raw.country_code) }}
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
    itemsType: [
      { typeTitle: "Educação", typeValue: "education" },
      { typeTitle: "Pesquisa", typeValue: "research" },
    ],
    itemsCountryCode: [{ codeTitle: "Brasil", codeValue: "BR" }],
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: "Nome",
        align: "start",
        key: "name",
      },
      { title: "Nome Abreviado", key: "abbr_name" },
      { title: "Tipo", key: "type" },
      { title: "Código do País", key: "country_code" },
      { title: "Ações", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    editedItem: [],
    defaultItem: {
      id_: null,
      name: null,
      abbr_name: null,
      type: null,
      country_code: null,
    },
  }),

  computed: {
    formTitle() {
      return !this.editedItem._id ? "Nova Instituição" : "Editar Instituição";
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
        .get("institutions/")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editItem(item) {
      this.editedItem = item;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = item;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.$axios
        .delete("institutions/" + this.editedItem._id)
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
      this.editedItem = this.defaultItem;
    },

    save() {
      if (this.editedItem._id) {
        this.$axios
          .put("institutions/" + this.editedItem._id, this.editedItem)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.editedItem = this.defaultItem;
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
          .post("institutions/", this.editedItem)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.editedItem = this.defaultItem;
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
          const typeItem = this.itemsType.find(
            (item) => item.typeValue === value
          );
          if (typeItem) {
            selectedTypes.push(typeItem.typeTitle);
          }
        });
      }
      return selectedTypes.join(", "); // Retorne os títulos separados por vírgula
    },

    getCountryCodeTitle(type) {
      const typeItem = this.itemsCountryCode.find(
        (item) => item.codeValue === type
      );
      return typeItem ? typeItem.codeTitle : "";
    },
  },
};
</script>