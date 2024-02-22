<template>
    <div>
        <v-select class="text-primary" v-model="year_id" :items="['2020', '2021', '2022', '2023', '2024']"
            label="Selecione o ano" variant="outlined" color="primary"></v-select>
        <v-row justify="center">
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Ações por tipo</v-toolbar-title>
                </v-toolbar>
                <v-data-table
                    :headers="[{ title: 'Tipo', align: 'start', key: 'type' }, { title: 'Quantidade', key: 'count' }]"
                    :items="actions" key="undergraduate" class="elevation-3" :loading="loading">
                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                    </template>
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Estudantes por tipo de ação e nível do programa acadêmico</v-toolbar-title>
                </v-toolbar>
                <v-data-table :headers="headersActions" :items="students" class="elevation-3" :loading="loading">
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Ações por status</v-toolbar-title>
                </v-toolbar>
                <v-data-table :headers="[{ title: 'Estado', key: 'status' }, { title: 'Quantidade', key: 'count' }]"
                    :items="actionsStatus" class="elevation-3" :loading="loading">
                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                    </template>
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Ações por tipos de instituição</v-toolbar-title>
                </v-toolbar>
                <v-data-table :headers="[{ title: 'Tipo', key: 'type' }, { title: 'Quantidade', key: 'count' }]"
                    :items="institutionsType" class="elevation-3" :loading="loading">
                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                    </template>
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Ações por tipo e temas relacionados</v-toolbar-title>
                </v-toolbar>
                <v-data-table :headers="headersActionsSubjects" :items="actions" class="elevation-3" :loading="loading">
                    <!-- eslint-disable-next-line -->
                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.related_subjects="{ item }">
                        <v-chip variant="text" v-for="theme in item.related_subjects" :key="theme">{{ theme }}</v-chip>
                    </template>
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Financiamentos por tipo de ação</v-toolbar-title>
                </v-toolbar>
                <v-data-table :headers="[{ title: 'Tipo', key: 'type' }, { title: 'Quantidade', key: 'count' }]"
                    :items="financing" class="elevation-3" :loading="loading">
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

    </div>
</template>

<script>
export default {
    data: () => ({
        loading: true,
        itemsPeople: [],
        itemsActions: [],
        types: ['course', 'event', 'program', 'project', 'agreement', 'service'],
        degrees: ['undergraduate', 'masters_degree', 'doctorate'],
        statuses: ['count_in_analise', 'count_in_progress', 'count_repproved', 'count_approved', 'count_cancelled'],
        categories: ['count_public', 'count_private', 'count_third_sector'],
        student: ['student_type_course', 'student_type_event', 'student_type_program', 'student_type_project', 'student_type_agreement', 'student_type_service'],
        financings: ['count_financing_course', 'count_financing_event', 'count_financing_program', 'count_financing_project', 'count_financing_agreement', 'count_financing_service'],
        items: [],
        itemsStatus: [],
        year_id: "2024",
        headersActions: [
            { title: "Tipo", align: "start", key: "type" },
            { title: "Graduação", key: "undergraduate" },
            { title: "Mestrado", key: "masters_degree" },
            { title: "Doutorado", key: "doctorate" },
        ],


        headersPeople: [
            { title: "Tipo", align: "start", key: "type" },
            { title: "Curso", key: "course" },
            { title: "Evento", key: "event" },
            { title: "Programa de Extensão", key: "extension_program" },
            { title: "Projeto de Extensão", key: "extension_project" },
            { title: "Convênio", key: "agreement" },
            { title: "Prestação de Serviço", key: "service_provision" },
        ],
        headersActionsSubjects: [
            { title: "Temas relacionados", key: "related_subjects" },
            { title: "Curso", key: "course" },
            { title: "Evento", key: "event" },
            { title: "Programa de Extensão", key: "extension_program" },
            { title: "Projeto de Extensão", key: "extension_project" },
            { title: "Convênio", key: "agreement" },
            { title: "Prestação de serviço", key: "service_provision" },
        ],
        institutionsType: [
            {
                type: "Publico",
                count: null,
            },
            {
                type: "Privado",
                count: null,
            },
            {
                type: "Terceiro setor",
                count: null,
            },
        ],
        actionsStatus: [
            {
                status: "Em analise",
                count: null,
            },
            {
                status: "Em andamento",
                count: null,
            },
            {
                status: "Reprovado",
                count: null,
            },
            {
                status: "Aprovado",
                count: null,
            },
            {
                status: "Cancelado",
                count: null,
            },
        ],
        actions: [
            {
                type: 'Curso',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: 2,
                related_subjects: [
                    'tema 1',
                ]
            },
            {
                type: 'Evento',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
                related_subjects: [
                    'tema 4'
                ],
            },
            {
                type: 'Programa de Extensão',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
                related_subjects: [
                    'tema 2'
                ],
            },
            {
                type: 'Projeto de Extensão',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
                related_subjects: [
                    'tema 3'
                ],
            },
            {
                type: 'Convênio',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
                related_subjects: [
                    'tema 5'
                ],
            },
            {
                type: 'Serviço de Provisão',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
                related_subjects: [
                    'tema 7'
                ],
            },
        ],
        students: [
            {
                type: 'Curso',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                type: 'Evento',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                type: 'Programa de Extensão',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                type: 'Projeto de Extensão',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                type: 'Convênio',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                type: 'Serviço de Provisão',
                count: null,
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
        ],
        financing: [
            {
                type: 'Curso',
                count: null,
            },
            {
                type: 'Evento',
                count: null,
            },
            {
                type: 'Programa de extensão',
                count: null,
            },
            {
                type: 'Projeto de extensão',
                count: null,
            },
            {
                type: 'Convênio',
                count: null,
            },
            {
                type: 'Prestação de serviço',
                count: null,
            },
        ],
    }),
    created() {
        this.initialize();
    },
    methods: {
        initialize() {
            this.$axios.get(`http://127.0.0.1:8000/api/reports/${this.year_id}`).then((response) => {
                this.items = response.data.data;
                for (let i = 0; i < this.actionsStatus.length; i++) {
                    this.actionsStatus[i].count = this.items[this.statuses[i]];
                }
                for (let i = 0; i < this.financing.length; i++) {
                    this.financing[i].count = this.items[this.financings[i]];
                }
                for (let i = 0; i < this.institutionsType.length; i++) {
                    this.institutionsType[i].count = this.items[this.categories[i]];
                }
                for (let i = 0; i < this.actions.length; i++) {
                    this.actions[i].count = this.items[`count_type_${this.types[i]}`];
                }
                for (let i = 0; i < this.students.length; i++) {
                    this.students[i].undergraduate = this.items[`student_${this.types[i]}_${this.degrees[0]}`];
                    this.students[i].masters_degree = this.items[`student_${this.types[i]}_${this.degrees[1]}`];
                    this.students[i].doctorate = this.items[`student_${this.types[i]}_${this.degrees[2]}`];
                }
                this.loading = false;
            })
        },
        initializeActions() {
            this.$axios
                .get("actions/")
                .then((response) => {
                    this.itemsActions = response.data;
                    this.itemsActions.forEach((memberGroup) => {
                        if (!this.itemsActions.started_at) {
                            memberGroup.started_at = this.getDate(memberGroup.started_at);
                        }
                        if (!this.itemsActions.ended_at) {
                            memberGroup.ended_at = this.getDate(memberGroup.ended_at);
                        }
                    })
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        initializeFinancing() {
            this.$axios
                .get("financing/")
                .then((response) => {
                    this.itemsFinancing = response.data;
                    this.itemsFinancing.forEach((action) => {
                        if (!this.itemsFinancing.started_at) {
                            action.started_at = this.getDate(action.started_at);
                        }
                        if (!this.itemsFinancing.ended_at) {
                            action.ended_at = this.getDate(action.ended_at);
                        }
                        if (!this.itemsFinancing.amount) {
                            action.amount = action.amount.toFixed(2).toString()
                        }
                    })
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    }
}
</script>