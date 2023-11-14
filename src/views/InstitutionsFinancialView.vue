<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Instituições Financiamentos</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="instituições_financiamento.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <v-dialog persistent v-model="dialog" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn
                color="secondary"
                size="x-large"
                density="compact"
                icon="mdi-plus"
                v-bind="props"
                variant="tonal"
                dark
                @click="institution = { ...defaultInstitution }"
              ></v-btn>
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
                      <v-text-field
                        v-model="institution.name"
                        :rules="[
                          () => !!institution.name || 'Nome é requerido!',
                          () =>
                            !(institution.name.length > 60) ||
                            'Nome maior que o suportado',
                        ]"
                        label="Nome"
                        :counter="60"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="institution.abbr_name"
                        label="Nome Abreviado"
                        :rules="[
                          () =>
                            !!institution.abbr_name ||
                            'Nome Abreviado é requerido!',
                          () =>
                            !(institution.abbr_name.length > 20) ||
                            'Nome Abreviado maior que o suportado',
                        ]"
                        :counter="20"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="institution.legal_category_id"
                        label="Categoria jurídica"
                        :items="itemsFinancial"
                        item-title="category"
                        item-value="_id"
                        :rules="[]"
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="institution.legal_nature_id"
                        label="Natureza jurídica"
                        :items="financialNature"
                        item-title="nature"
                        item-value="_id"
                        :rules="[]"
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="institution.country_code"
                        label="País"
                        :items="institutionsCountryCode"
                        item-title="countryTitle"
                        item-value="countryValue"
                        :rules="[
                          () =>
                            !!institution.country_code || 'País é requerido!',
                        ]"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
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
                <v-btn color="primary" variant="tonal" @click="formSubmit"
                  >Salvar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Confirm delete -->
          <v-dialog v-model="institutionsDelete" max-width="420px">
            <v-card class="rounded-lg">
              <v-card-title class="bg-primary">
                Confirmar exclusão
              </v-card-title>
              <v-card-text class="text-body-1 text-md-center pa-4 ma-4">
                <v-icon icon="mdi-alert" size="large"></v-icon> Tem certeza que
                deseja excluir esse item?
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="bg-secondary d-flex justify-center">
                <v-btn
                  color="blue-darken-1"
                  variant="plain"
                  @click="institutionsDelete = false"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  variant="tonal"
                  @click="deleteInstitutionsConfirm"
                >
                  Excluir
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.legal_category_id="{ item }">
        {{ getCategory(item.raw.legal_category_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.legal_nature_id="{ item }">
        {{ getNaturePerCategoryIdNatureId(item.raw.legal_category_id, item.raw.legal_nature_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.country_code="{ item }">
        {{ getCountryCountryTitle(item.raw.country_code) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon
          title="Editar"
          size="small"
          class="me-2"
          @click="editInstitutions(item.raw)"
          >mdi-pencil</v-icon
        >
        <v-icon
          title="Excluir"
          size="small"
          @click="deleteInstitutions(item.raw)"
          >mdi-delete</v-icon
        >
      </template>
      <template v-slot:no-data> Não há dados para exibir!</template>
    </v-data-table>
  </div>
</template>


<script>
export default {
  data: () => ({
    valid: false,
    institutionsType: [
      { typeTitle: "Educação", typeValue: "education" },
      { typeTitle: "Pesquisa", typeValue: "research" },
      { typeTitle: "Outros", typeValue: "other" },
    ],
    institutionsCountryCode: [{ countryTitle: "Brasil", countryValue: "BR" }],
    dialog: false,
    institutionsDelete: false,
    headers: [
      {
        title: "Nome",
        align: "start",
        key: "name",
      },
      { title: "Nome Abreviado", key: "abbr_name" },
      { title: "Categoria jurídica", key: "legal_category_id" },
      { title: "Natureza jurídica", key: "legal_nature_id" },
      { title: "Código do País", key: "country_code" },
      { title: "Ações", key: "actions", sortable: false },
    ],
    items: [],
    financialNature: [
      {
        _id: null,
        nature: null,
      },
    ],
    itemsFinancial: [
      {
        _id: "654919a065a62c74a7887696",
        category: "Cat1",
        natures: [
          {
            _id: "654919a065a62c74a7887696",
            nature: "Nat1",
          },
          {
            _id: "654919a065a62c74a7887697",
            nature: "Nat2",
          },
          {
            _id: "654919a065a62c74a7887690",
            nature: "Nat3",
          },
        ],
        createdAt: "2023-11-06T16:51:44.981Z",
        updatedAt: "2023-11-06T19:15:42.335Z",
        __v: 0,
      },
      {
        _id: "654919a065a62c74a7887698",
        category: "Cat2",
        natures: [
          {
            _id: "654919a065a62c74a7887699",
            nature: "Nat4",
          },
          {
            _id: "654919a065a62c74a7887690",
            nature: "Nat5",
          },
        ],
        createdAt: "2023-11-06T16:51:44.981Z",
        updatedAt: "2023-11-06T19:15:42.335Z",
        __v: 0,
      },
    ],
    editedIndex: -1,
    institution: {},
    defaultInstitution: {
      id_: null,
      name: null,
      abbr_name: null,
      legal_category_id: null,
      legal_nature_id: null,
      country_code: null,
    },
  }),

  computed: {
    formTitle() {
      return !this.institution._id ? "Nova Instituição" : "Editar Instituição";
    },
  },

  watch: {
    "institution.legal_category_id"(newValue, oldValue) {
      this.getNaturePerCategory(this.itemsFinancial, newValue, oldValue);
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
        .get("institutionsF/")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    editInstitutions(item) {
      this.institution = item;
      this.dialog = true;
    },

    deleteInstitutions(item) {
      this.institution = item;
      this.institutionsDelete = true;
    },

    deleteInstitutionsConfirm() {
      this.$axios
        .delete("institutionsF/" + this.institution._id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize();
            this.institutionsDelete = false;
            this.$toast.success(response.statusText);
          } else {
            this.$toast.error(response.statusText);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.institution = this.defaultInstitution;
    },

    save() {
      if (this.institution._id) {
        this.$axios
          .put("institutionsF/" + this.institution._id, this.institution)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.institution = this.defaultInstitution;
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
          .post("institutionsF/", this.institution)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.institution = this.defaultInstitution;
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
          const typeInstitutions = this.institutionsType.find(
            (item) => item.typeValue === value
          );
          if (typeInstitutions) {
            selectedTypes.push(typeInstitutions.typeTitle);
          }
        });
      }
      return selectedTypes.join(", "); // Retorne os títulos separados por vírgula
    },

    getCountryCountryTitle(type) {
      const typeInstitutions = this.institutionsCountryCode.find(
        (item) => item.countryValue === type
      );
      return typeInstitutions ? typeInstitutions.countryTitle : "";
    },
    getNaturePerCategory(items, id, oldId) {
      if (id !== oldId && oldId !== undefined) {
        this.institution.legal_nature_id = null;
      }
      this.financialNature = [];
      items.forEach((category) => {
        if (category._id === id) {
          this.financialNature.push(...category.natures);
        }
      });
    },
    getCategory(categoryId) {
      const institutionsCategory = this.itemsFinancial.find(
        (item) => item._id === categoryId
      );
      return institutionsCategory ? institutionsCategory.category : "";
    },
    getNaturePerCategoryIdNatureId(categoryId, natureId) {
      const categoryObj = this.itemsFinancial.find(
        (category) => category._id === categoryId
      );
      if (categoryObj) {
        // Encontrar o objeto no array natures desse objeto com o _id correspondente a natureId
        const natureObj = categoryObj.natures.find(
          (nature) => nature._id === natureId
        );

        // Verificar se o objeto nature foi encontrado
        if (natureObj) {
          // Obter o valor de "nature"
          const natureValue = natureObj.nature;
          return natureValue;
        }
      } 
      return null;
    },
  },
};
</script>
<style></style>
