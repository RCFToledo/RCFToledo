<template>
    <div>
        <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'name', order: 'asc' }]" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="primary">
                    <v-toolbar-title>Pessoas</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="800px" :persistent="true">
                        <template v-slot:activator="{ props }">
                            <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props"
                                variant="tonal" dark @click="people = { ...defaultPeople }"></v-btn>
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
                                            <v-text-field v-model="people.full_name" :rules="[
                                                () => !!people.full_name || 'Nome é requerido!',
                                                () => !(people.full_name.length > 60) || 'Nome maior que o suportado',
                                            ]" label="Nome" :counter="120" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="people.abbr_name" label="Nome Abreviado" :rules="[
                                                () =>
                                                    !!people.abbr_name ||
                                                    'Nome Abreviado é requerido!',
                                            ]" :counter="20"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="people.name_treatment" :rules="[
                                                () => !!people.name_treatment || 'Tratamento é requerido!',
                                                () => !(people.name_treatment.length > 60) || 'Tratamento maior que o suportado',
                                            ]" label="Tratamento" :counter="120" required></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field v-model="people.cpf" :rules="[
                                                () => !!people.cpf || 'CPF é requerido!',
                                            ]" label="CPF"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field v-model="people.instituition_id" :rules="[
                                                () => !!people.instituition_id || 'Instituição é requerida!',
                                            ]" label="Instituição"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field v-model="people.department_id" :rules="[
                                                () => !!people.department_id || 'Departamento é requerido!',
                                            ]" label="Departamento"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field v-model="people.employee_id" :rules="[
                                                () => !!people.employee_id || 'Matrícula é requerida!',
                                            ]" label="Matrícula"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field v-model="people.student_id" :rules="[
                                                () => !!people.student_id || 'RA é requerido!',
                                            ]" label="RA"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field v-model="people.default_email" :rules="[
                                                () => !!people.default_email || 'E-mail é requerido!',
                                                (v) => /.+@.+\..+/.test(v) || 'E-mail inválido',
                                            ]" label="E-mail"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field v-model="people.alternative_email"
                                                label="E-mails alternativos"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field v-model="people.account" label="Conta vinculada"></v-text-field>
                                        </v-col>

                                        <v-col cols="12">
                                            <v-text-field v-model="people.academic_profile" label="Perfil"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions class="d-flex justify-center bg-secondary">
                                <v-btn color="blue-darken-1" variant="plain" @click="
                                    dialog = false;
                                initialize();
                                ">
                                    Cancelar
                                </v-btn>
                                <v-btn color="primary" variant="tonal" @click="formSubmit">
                                    Salvar
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
                            <v-card-text class="text-body-1 text-md-center pa-4 ma-4"><v-icon icon="mdi-alert"
                                    size="large"></v-icon>
                                Tem certeza que deseja
                                excluir esse item?</v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions class="bg-secondary d-flex justify-center">
                                <v-btn color="blue-darken-1" variant="plain" @click="dialogDelete = false">Cancelar</v-btn>
                                <v-btn color="primary" variant="tonal" @click="deleteItemConfirm">Excluir</v-btn>
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
        search: '',
        itemsType: [
            { typeTitle: "Educação", typeValue: "education" },
            { typeTitle: "Pesquisa", typeValue: "research" },
        ],
        itemsCountryCode: [{ countryTitle: "Brasil", countryValue: "BR" }],
        dialog: false,
        dialogDelete: false,
        headers: [
            {
                title: "Nome Completo",
                align: "start",
                key: "full_name",
            },
            { title: "Tratamento", key: "name_treatment" },
            { title: "CPF", key: "cpf" },
            { title: "Instituição", key: "instituition_id" },
            { title: "Tratamento", key: "name_treatment" },
            { title: "Departamento", key: "department_id" },
            { title: "Matrícula", key: "employee_id" },
            { title: "RA", key: "student_id" },
            { title: "E-mail", key: "default_email" },
            { title: "E-mails alternativos", key: "alternative_email" },
            { title: "Conta vinculada", key: "account" },
            { title: "Perfil", key: "academic_profile" },
            { title: "Ações", key: "actions", sortable: false },
        ],
        items: [],
        peopleIndex: -1,
        people: [],
        defaultPeople: {
            id_: null,
            name: null,
            abbr_name: null,
            type: null,
            country_code: null,
        },
    }),

    computed: {
        formTitle() {
            return !this.people._id ? "Nova Pessoa" : "Editar Informações";
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
                .get("people/")
                .then((response) => {
                    this.items = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        editItem(item) {
            this.people = item;
            this.dialog = true;
        },

        deleteItem(item) {
            this.people = item;
            this.dialogDelete = true;
        },

        deleteItemConfirm() {
            this.$axios
                .delete("people/" + this.people._id)
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
            this.people = this.defaultPeople;
        },

        save() {
            if (this.people._id) {
                this.$axios
                    .put("people/" + this.people._id, this.people)
                    .then((response) => {
                        console.log(response);
                        if (response.status == 200) {
                            this.initialize();
                            this.people = this.defaultPeople;
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
                    .post("people/", this.people)
                    .then((response) => {
                        console.log(response);
                        if (response.status == 200) {
                            this.initialize();
                            this.people = this.defaultPeople;
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

        getCountryCountryTitle(type) {
            const typeItem = this.itemsCountryCode.find(
                (item) => item.countryValue === type
            );
            return typeItem ? typeItem.countryTitle : "";
        },
    },
};
</script>
<style></style>