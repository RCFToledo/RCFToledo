<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1"
      :page="currentPage" :items-per-page="configPagination.per_page">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Instituições Parceiras</v-toolbar-title>
          <v-spacer></v-spacer>
          <ExportCSV url="https://test-bapex.fe.unicamp.br/api/institutions" name="partners_institutions" :lastPage="configPagination.last_page" />
          <v-dialog persistent v-model="dialog" max-width="800px">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="institution = { ...defaultInstitution }"></v-btn>
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
                      <v-text-field v-model="institution.name" :rules="[
                        () => !!institution.name || 'Nome é requerido!',
                        () =>
                          !(institution.name.length > 60) ||
                          'Nome maior que o suportado'
                      ]" label="Nome" :counter="60" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="institution.abbr_name" label="Nome Abreviado" :rules="[
                        () =>
                          !((institution.abbr_name !== null) && (institution.abbr_name.length > 20)) ||
                          'Nome Abreviado maior que o suportado'
                      ]" :counter="20"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select v-model="institution.legal_category_id" label="Categoria jurídica" :items="institutionsLegalCategories"
                        item-title="category" item-value="id"></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-select v-model="institution.legal_nature_id" label="Natureza jurídica" :items="financialNature"
                        item-title="nature" item-value="id"></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete v-model="institution.country_code" label="País" :items="institutionsCountryCode" item-title="name" item-value="code"
                        :rules="[
                          () =>
                            !!institution.country_code || 'País é requerido!',
                        ]" required></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-center bg-secondary">
                <v-btn color="blue-darken-1" variant="plain" @click="
                  dialog = false;
                initialize(currentPage);
                ">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="formSubmit">Salvar</v-btn>
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
                <v-btn color="blue-darken-1" variant="plain" @click="institutionsDelete = false">
                  Cancelar
                </v-btn>
                <v-btn color="primary" variant="tonal" @click="deleteInstitutionsConfirm">
                  Excluir
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.legal_category_id="{ item }">
        {{ getCategoryById(item.legal_category_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.legal_nature_id="{ item }">
        {{ getNatureByCategoryIdNatureId(item.legal_category_id, item.legal_nature_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.country_code="{ item }">
        {{ getCountryCountryTitle(item.country_code) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" title="Editar" size="small" class="me-2" @click="editInstitutions(item)">mdi-pencil</v-icon>
        <v-icon color="primary" title="Excluir" size="small" @click="deleteInstitutions(item)">mdi-delete</v-icon>
      </template>

      <template v-slot:no-data> Não há dados para exibir!</template>
      <template v-slot:bottom>
        <v-footer flat color="secondary">
          <v-spacer></v-spacer>
          <p>Itens por páginas: <strong>{{ configPagination.per_page }}</strong></p>
          <v-pagination rounded="circle" show-first-last-page :length="configPagination.last_page" :total-visible="1" v-model="currentPage"
            @next="initialize(currentPage)" @prev="initialize(currentPage)" @first="initialize(1)"
            @last="initialize(configPagination.last_page)">
          </v-pagination>
        </v-footer>
      </template>
    </v-data-table>
  </div>
</template>


<script>
import ExportCSV from "../components/ExportCSV.vue"

export default {
  data: () => ({
    valid: false,
    institutionsType: [
      { typeTitle: "Educação", typeValue: "education" },
      { typeTitle: "Pesquisa", typeValue: "research" },
      { typeTitle: "Outros", typeValue: "other" },
    ],
    institutionsCountryCode: [],
    dialog: false,
    institutionsDelete: false,
    headers: [
      {
        title: "Nome",
        align: "start",
        key: "name",
      },
      { title: "País", key: "country_code" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    financialNature: [
      {
        id: null,
        nature: null,
      },
    ],

    institutionsLegalCategories: [],
    editedIndex: -1,
    institution: {},
    currentPage: 1,
    configPagination: [],
    defaultInstitution: {
      id: null,
      name: null,
      abbr_name: "",
      legal_category_id: null,
      legal_nature_id: null,
      country_code: null,
    },
  }),

  components: {
    ExportCSV
  },

  computed: {
    formTitle() {
      return !this.institution.id ? "Nova Instituição" : "Editar Instituição";
    },
  },

  watch: {
    "institution.legal_category_id"(newValue, oldValue) {
      this.getNatureByCategory(this.institutionsLegalCategories, newValue, oldValue);
    },
  },

  created() {
    this.initialize(1);
    this.initializeCountries();
    this.initializeLegalCategories()
  },
  methods: {
    formSubmit() {
      this.$refs.form.validate().then((isValid) => {
        if (isValid.valid) {
          this.save();
        }
      });
    },
    initialize(page) {
      this.$axios
        .get(`https://test-bapex.fe.unicamp.br/api/institutions?page=${page}`)
        .then((response) => {
          this.items = response.data.data;
          this.configPagination = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeCountries() {
      this.$axios
        .get("https://test-bapex.fe.unicamp.br/api/countries")
        .then((response) => {
          this.institutionsCountryCode = response.data.data;
          
        })
        .catch((error) => {
          console.error(error);
        });
    },

    initializeLegalCategories() {
      this.$axios
        .get("https://test-bapex.fe.unicamp.br/api/legal-categories")
        .then((response) => {
          this.institutionsLegalCategories = response.data.data;
          console.log(response);
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
        .delete("https://test-bapex.fe.unicamp.br/api/institutions/" + this.institution.id)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.initialize(this.currentPage);
            this.institutionsDelete = false;
            this.$toast.success(response.data.message);
          } else {
            this.$toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.institution = this.defaultInstitution;
    },

    save() {
      if (this.institution.id) {
        this.$axios
          .put("https://test-bapex.fe.unicamp.br/api/institutions/" + this.institution.id, this.institution)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize(this.currentPage);
              this.institution = this.defaultInstitution;
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
          .post("https://test-bapex.fe.unicamp.br/api/institutions", this.institution)
          .then((response) => {
            console.log(response);
            if (response.status == 201) {
              this.initialize(this.currentPage);
              this.institution = this.defaultInstitution;
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

    getCountryCountryTitle(countryId) {
      const foundCountry = this.institutionsCountryCode.find((item) => item.code === countryId)
      return foundCountry ? foundCountry.name : "";
    },
  
    getNatureByCategory(items, id, oldId) {
      if (id && oldId !== undefined) {
        this.institution.legal_nature_id = null;
      }
      this.financialNature = [];
      items.forEach((category) => {
        if (category.id === id) {
          this.financialNature.push(...category.natures);
        }
      });
    },
    getCategoryById(categoryId) {
      const institutionsCategory = this.institutionsLegalCategories.find(
        (item) => item.id === categoryId
      );
      return institutionsCategory ? institutionsCategory.category : "";
    },
    getNatureByCategoryIdNatureId(categoryId, natureId) {
      const categoryObj = this.institutionsLegalCategories.find(
        (category) => category.id === categoryId
      );
      if (categoryObj) {
        const natureObj = categoryObj.natures.find(
          (nature) => nature.id === natureId
        );
        if (natureObj) {
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
