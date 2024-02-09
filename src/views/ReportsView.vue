<template>
    <div>
        <v-select class="text-primary" :items="['2020', '2021', '2022', '2023', '2024']" label="Selecione o ano" variant="outlined" color="primary"></v-select>
        <v-row justify="center">
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Ações por tipo</v-toolbar-title>
                </v-toolbar>
                <v-data-table
                    :headers="[{ title: 'Tipo', align: 'start', key: 'type' }, { title: 'Quantidade', key: 'count' }]"
                    :items="actions" key="undergraduate" class="elevation-3">
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Estudantes por tipo de ação e nível do programa acadêmico</v-toolbar-title>
                </v-toolbar>
                <v-data-table :headers="headersActions" :items="students" class="elevation-3">
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Ações por status</v-toolbar-title>
                </v-toolbar>
                <v-data-table :headers="headersStatus" :items="actionsStatus" class="elevation-3">
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
                <v-data-table :headers="headersTypeInstitution" :items="institutionsType" class="elevation-3">
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="4">
                <v-toolbar density="compact" color="primary" class="elevation-3">
                    <v-toolbar-title>Ações por tipo e temas relacionados</v-toolbar-title>
                </v-toolbar>
                <v-data-table :headers="headersActionsSubjects" :items="actions" class="elevation-3">
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
                <v-data-table :items="financing" class="elevation-3">
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
        itemsPeople: [],
        itemsActions: [],
        itemsFinancing: [],
        headersActions: [
            { title: "Tipo", align: "start", key: "type" },
            { title: "Graduação", key: "undergraduate" },
            { title: "Mestrado", key: "masters_degree" },
            { title: "Doutorado", key: "doctorate" },
        ],
        headersStatus: [
            { title: "Estado", key: "status" },
            { title: "2020", key: "2020" },
            { title: "2021", key: "2021" },
            { title: "2022", key: "2022" },
            { title: "2023", key: "2023" },
            { title: "2024", key: "2024" },
        ],

        headersTypeInstitution: [
            { title: "Tipo de instituição", align: "type", key: "type" },
            { title: "2020", key: "2020" },
            { title: "2021", key: "2021" },
            { title: "2022", key: "2022" },
            { title: "2023", key: "2023" },
            { title: "2024", key: "2024" },
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
                "2020": 0,
                "2021": 1,
                "2022": 2,
                "2023": 4,
                "2024": 6
            },
            {
                type: "Privado",
                "2020": 0,
                "2021": 1,
                "2022": 2,
                "2023": 4,
                "2024": 6
            },
            {
                type: "Terceiro setor",
                "2020": 0,
                "2021": 1,
                "2022": 2,
                "2023": 4,
                "2024": 6
            },
        ],
        actionsStatus: [
            {
                status: "Em analise",
                "2020": 0,
                "2021": 1,
                "2022": 2,
                "2023": 4,
                "2024": 6
            },
            {
                status: "Em andamento",
                "2020": 0,
                "2021": 1,
                "2022": 2,
                "2023": 4,
                "2024": 6
            },
            {
                status: "Reprovado",
                "2020": 0,
                "2021": 1,
                "2022": 2,
                "2023": 4,
                "2024": 6
            },
            {
                status: "Aprovado",
                "2020": 0,
                "2021": 1,
                "2022": 2,
                "2023": 4,
                "2024": 6
            },
            {
                status: "Concluido",
                "2020": 0,
                "2021": 1,
                "2022": 2,
                "2023": 4,
                "2024": 6
            },
        ],
        actions: [
            {
                type: 'Curso',
                count: 0,
                undergraduate: 1,
                masters_degree: 3,
                doctorate: 2,
                related_subjects: [
                    'tema 1',
                ]
            },
            {
                type: 'Evento',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
                related_subjects: [
                    'tema 4'
                ],
            },
            {
                type: 'Programa de Extensão',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
                related_subjects: [
                    'tema 2'
                ],
            },
            {
                type: 'Projeto de Extensão',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
                related_subjects: [
                    'tema 3'
                ],
            },
            {
                type: 'Convênio',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
                related_subjects: [
                    'tema 5'
                ],
            },
            {
                type: 'Serviço de Provisão',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
                related_subjects: [
                    'tema 7'
                ],
            },
        ],

        students: [
            {
                type: 'Curso',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
            },
            {
                type: 'Evento',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
            },
            {
                type: 'Programa de Extensão',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
            },
            {
                type: 'Projeto de Extensão',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
            },
            {
                type: 'Convênio',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
            },
            {
                type: 'Serviço de Provisão',
                count: 0,
                undergraduate: 0,
                masters_degree: 0,
                doctorate: 0,
            },
        ],

        people: [
            {
                type: 'Funcionário',
                count: 0,
                course: 0,
                event: 0,
                extension_program: 0,
                extension_project: 0,
                agreement: 0,
                service_provision: 0,
            },
            {
                type: 'Estudante',
                count: 0,
                course: 0,
                event: 0,
                extension_program: 0,
                extension_project: 0,
                agreement: 0,
                service_provision: 0,
            },
            {
                type: 'Doscente',
                count: 0,
                course: 0,
                event: 0,
                extension_program: 0,
                extension_project: 0,
                agreement: 0,
                service_provision: 0,
            },
            {
                type: 'Pesquisador',
                count: 0,
                course: 0,
                event: 0,
                extension_program: 0,
                extension_project: 0,
                agreement: 0,
                service_provision: 0,
            },
            {
                type: 'Outros',
                count: 0,
                course: 0,
                event: 0,
                extension_program: 0,
                extension_project: 0,
                agreement: 0,
                service_provision: 0,
            },
        ],

        financing: [
            {
                Tipo: 'Curso',
                Quantidade: 0.0,
            },
            {
                Tipo: 'Evento',
                Quantidade: 0.0,
            },
            {
                Tipo: 'Programa de extensão',
                Quantidade: 0.0,
            },
            {
                Tipo: 'Projeto de extensão',
                Quantidade: 0.0,
            },
            {
                Tipo: 'Convênio',
                Quantidade: 0.0,
            },
            {
                Tipo: 'Serviço de Provisão',
                Quantidade: 0.0,
            },
        ],
    }),
    created() {
        this.initializeActions();
        this.initializePeople();
        this.initializeFinancing();
    },
    methods: {
        initializePeople() {
            this.$axios
                .get("people/")
                .then((response) => {
                    console.log(response.data);
                    this.itemsPeople = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
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