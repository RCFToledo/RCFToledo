<template>
  <div>
    <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Departamentos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <v-card>
              <v-card-title class="bg-primary">
                <v-spacer></v-spacer>
                <span class="text-h5">{{ `Membros (${departments.name})`  }}</span>
                <v-spacer></v-spacer>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" lazy-validation>
                    <v-row dense>
                      <v-col cols="12">
                        <v-text-field readonly v-model="departments.name" :rules="[
                          () => !!departments.name || 'Nome é requerido!',
                        ] " label="Nome" :counter="120" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field readonly v-model="departments.abbr_name" label="Nome Abreviado" :rules="[
                          () =>
                            !!departments.abbr_name ||
                            'Nome Abreviado é requerido!',
                        ]" :counter="20"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-select readonly v-model="departments.type" multiple label="Tipo" :items="itemsType"
                          item-title="typeTitle" item-value="typeValue" :rules="[
                            () => !!departments.type || 'Tipo é requerido!',
                          ]"></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select readonly v-model="departments.country_code" label="País" :items="itemsCountryCode"
                          item-title="codeTitle" item-value="codeValue" :rules="[
                            () =>
                              !!departments.country_code || 'País é requerido!',
                          ]"></v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="tonal" @click="
                  dialog = false;
                initialize();
                ">
                  Sair
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Confirm delete -->
          <v-dialog v-model="dialogDelete" max-width="420px">
            <v-card class="rounded-lg">
              <v-card-title class="bg-primary">
                Confirmar exclusão
              </v-card-title>
              <v-spacer></v-spacer>
              <v-card-text class="text-body-1 text-md-center"><v-icon icon="mdi-alert"></v-icon> Tem certeza que deseja
                excluir esse item?</v-card-text>
              <v-spacer></v-spacer>
              <v-divider></v-divider>
              <v-card-actions class="bg-grey-lighten-3">

                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="plain" @click="dialogDelete = false">Cancelar</v-btn>
                <v-btn color="primary" variant="tonal" @click="deleteItemConfirm">Excluir</v-btn>
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
        <v-icon size="large" class="me-2" @click="visualizeMembers(item.raw)">
          mdi-eye
        </v-icon>
      </template>
      <template v-slot:no-data> Não há dados para exibir! </template>
    </v-data-table>
  </div>
</template>
  
  
<script>
export default {
  data: () => ({
    charAmount: null,
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
      { title: "Código da DGA", key: "DGA_code" },
      { title: "Membros (Visualização)", key: "actions" },
    ],
    items: [],
    editedIndex: -1,
    departments: [],
    defaultItem: {
      id_: null,
      name: null,
      abbr_name: null,
      DGA_code: null,
    },
  }),

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
        .get("departments/")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    visualizeMembers(item) {
      this.departments = item;
      this.dialog = true;
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
<style></style>