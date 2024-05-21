<template>
    <div>
        <v-row style="margin: 0.5vw;">
            <v-select class="text-primary" v-model="year" :items="['2020', '2021', '2022', '2023', '2024']"
                label="Selecione o ano" variant="outlined" color="primary"></v-select><download-csv :data="items"
                :labels="labels" name="reports.csv" :delimiter="';'"><v-btn style="margin-left: 1vw;" height="4em"
                    color="green" variant="outlined" title="Exportar tudo"><v-icon
                        size="x-large">mdi-microsoft-excel</v-icon></v-btn></download-csv>
        </v-row>
        <v-responsive>
            <v-row justify="center">
                <v-col cols="8" xl="4" xxl="4" lg="4" md="6" sm="7" xs="8">
                    <v-toolbar density="compact" color="primary" class="elevation-3">
                        <v-toolbar-title>Ações por tipo</v-toolbar-title>
                        <download-csv :data="items" :labels="{ type: 'Tipo', count: 'Quantidade' }"
                            name="Ações_por_tipo" delimiter=";">
                            <v-btn size="small" style="margin-right: 5px;" title="Exportar CSV" icon=""
                                class="rounded-circle" variant="tonal">
                                <v-icon>mdi-microsoft-excel</v-icon>
                            </v-btn>
                        </download-csv>
                    </v-toolbar>
                    <v-data-table
                        :headers="[{ title: 'Tipo', align: 'start', key: 'type' }, { title: 'Quantidade', key: 'count' }]"
                        :items="itemsType" key="type" class="elevation-3 custom-col" :loading="loading">
                        <template v-slot:loading>
                            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.type="{ item }">
                            {{ getLabelsByItem(item.type, this.label_types) }}
                        </template>
                        <template v-slot:bottom>
                            <v-divider></v-divider>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col cols="8" xl="4" xxl="4" lg="4" md="6" sm="7" xs="8">
                    <v-toolbar density="compact" color="primary" class="elevation-3">
                        <v-toolbar-title>Estudantes por tipo de ação e nível do programa acadêmico</v-toolbar-title>
                        <download-csv :data="students"
                            :labels="{ s_type: 'Tipo', doctorate: 'Doutorado', masters_degree: 'Mestrado', undergraduate: 'Graduação' }"
                            name="estudantes_por_tipo_e_nivel" delimiter=";">
                            <v-btn size="small" style="margin-right: 5px;" title="Exportar CSV" icon=""
                                class="rounded-circle" variant="tonal">
                                <v-icon>mdi-microsoft-excel</v-icon>
                            </v-btn>
                        </download-csv>
                    </v-toolbar>
                    <v-data-table :headers="headersStudents" :items="students" class="elevation-3 custom-col"
                        :loading="loading">
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.undergraduate="{ item }">
                            {{ item.undergraduate ? item.undergraduate : 0 }}
                        </template>
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.masters_degree="{ item }">
                            {{ item.masters_degree ? item.masters_degree : 0 }}
                        </template>
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.doctorate="{ item }">
                            {{ item.doctorate ? item.doctorate : 0 }}
                        </template>
                        <template v-slot:bottom>
                            <v-divider></v-divider>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col cols="8" xl="4" xxl="4" lg="4" md="6" sm="7" xs="8">
                    <v-toolbar density="compact" color="primary" class="elevation-3">
                        <v-toolbar-title>Ações por status</v-toolbar-title>
                        <download-csv :labels="{ status: 'Estado', count: 'Quantidade' }" :data="itemsStatus"
                            name="Ações_por_status" delimiter=";">
                            <v-btn size="small" style="margin-right: 5px;" title="Exportar CSV" icon=""
                                class="rounded-circle" variant="tonal">
                                <v-icon>mdi-microsoft-excel</v-icon>
                            </v-btn>
                        </download-csv>
                    </v-toolbar>
                    <v-data-table :headers="[{ title: 'Estado', key: 'status' }, { title: 'Quantidade', key: 'count' }]"
                        :items="itemsStatus" class="elevation-3 custom-col" :loading="loading">
                        <template v-slot:loading>
                            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>
                        <template v-slot:bottom>
                            <v-divider></v-divider>
                        </template>
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.status="{ item }">
                            {{ getLabelsByItem(item.status, this.label_status) }}
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="8" xl="4" xxl="4" lg="4" md="6" sm="7" xs="8">
                    <v-toolbar density="compact" color="primary" class="elevation-3">
                        <v-toolbar-title>Ações por tipos de instituição</v-toolbar-title>
                        <download-csv :data="itemsInstitutions" :labels="{ type: 'Tipo', count: 'Quantidade' }"
                            name="Ações_por_instituição" delimiter=";">
                            <v-btn size="small" style="margin-right: 5px;" title="Exportar CSV" icon=""
                                class="rounded-circle" variant="tonal">
                                <v-icon>mdi-microsoft-excel</v-icon>
                            </v-btn>
                        </download-csv>
                    </v-toolbar>
                    <v-data-table
                        :headers="[{ title: 'Tipo', key: 'legal_category_id' }, { title: 'Quantidade', key: 'count' }]"
                        :items="itemsInstitutions" class="elevation-3 custom-col" :loading="loading">
                        <template v-slot:loading>
                            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>
                        <template v-slot:bottom>
                            <v-divider></v-divider>
                        </template>
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.legal_category_id="{ item }">
                            {{ getCategoryNameById(item.legal_category_id) }}
                        </template>
                    </v-data-table>
                </v-col>
                <v-col cols="8" xl="4" xxl="4" lg="4" md="6" sm="7" xs="8">
                    <v-toolbar density="compact" color="primary" class="elevation-3">
                        <v-toolbar-title>Ações por tipo e temas relacionados</v-toolbar-title>
                        <download-csv :labels="label_subjects" :data="related_subjects" name="Ações_por_temas"
                            delimiter=";">
                            <v-btn size="small" style="margin-right: 5px;" title="Exportar CSV" icon=""
                                class="rounded-circle" variant="tonal">
                                <v-icon>mdi-microsoft-excel</v-icon>
                            </v-btn>
                        </download-csv>
                    </v-toolbar>
                    <v-data-table :items-per-page="5" :items-per-page-options="[{ value: 5, title: '5' }]"
                        :headers="headersitemsSubjects" :items="related_subjects" class="elevation-3 custom-col"
                        :loading="loadingSubject">
                        <!-- eslint-disable-next-line -->
                        <template v-slot:loading>
                            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col cols="8" xl="4" xxl="4" lg="4" md="6" sm="7" xs="8">
                    <v-toolbar density="compact" color="primary" class="elevation-3">
                        <v-toolbar-title>Financiamentos por tipo de ação</v-toolbar-title>
                        <download-csv :labels="{ type: 'Tipo', count: 'Quantidade', sum: 'Volume de Recursos' }"
                            :data="financing" name="financiamentos_por_tipo" delimiter=";">
                            <v-btn size="small" style="margin-right: 5px;" title="Exportar CSV" icon=""
                                class="rounded-circle" variant="tonal">
                                <v-icon>mdi-microsoft-excel</v-icon>
                            </v-btn>
                        </download-csv>
                    </v-toolbar>
                    <v-data-table
                        :headers="[{ title: 'Tipo', key: 'type' }, { title: 'Quantidade', key: 'count' }, { title: 'Volume de Recursos', key: 'sum' }]"
                        :items="financing" class="elevation-3 custom-col" :loading="loading">
                        <template v-slot:bottom>
                            <v-divider></v-divider>
                        </template>
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.type="{ item }">
                            {{ getLabelsByItem(item.type, this.label_types) }}
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-responsive>

    </div>
</template>

<script>
export default {
    data: () => ({
        loading: true,
        loadingSubject: true,
        itemsReportsSubjects: [],
        types: ["course", "event", "program", "project", "agreement", "service"],
        degrees: ['undergraduate', 'masters_degree', 'doctorate'],
        items: [],
        configPagination: [],
        itemsSubjects: [],
        fieldsCount: [
            { label: "Tipo", key: "type" },
            { label: "Quantidade", key: "count" },
        ],
        itemsReports: [],
        labels: {
            status: "Estado",
            count: "Quantidade",
            s_type: "Estudantes",
            f_type: "Financiamentos",
            type: "Tipo",
            sum: "Volume de Recursos",
            doctorate: "Doutorado",
            masters_degree: "Mestrado",
            undergraduate: "Graduação",
        },
        year: "2024",
        headersStudents: [
            { title: "Tipo", align: "start", key: "label" },
            { title: "Graduação", key: "undergraduate" },
            { title: "Mestrado", key: "masters_degree" },
            { title: "Doutorado", key: "doctorate" },
        ],

        headersitemsSubjects: [
            { title: "Temas relacionados", key: "subject" },
            { title: "Curso", key: "course" },
            { title: "Evento", key: "event" },
            { title: "Programa de Extensão", key: "program" },
            { title: "Projeto de Extensão", key: "project" },
            { title: "Convênio", key: "agreement" },
            { title: "Prestação de serviço", key: "service" },
        ],
        itemsInstitutions: [],
        actionsType: [],
        listDefault: [{
            status: null,
            type: null,
            s_type: null,
            f_type: null,
            undergraduate: null,
            masters_degree: null,
            doctorate: null,
            count: null,
            amount: null,
        }],
        itemsStatus: [],
        related_subjects: [
            {
                subject: null,
                course: null,
                event: null,
                program: null,
                project: null,
                agreement: null,
                service: null,
            }
        ],

        label_types: {
            name: "Temas",
            course: "Curso",
            event: "Evento",
            program: "Programa de extensão",
            project: "Projeto de extensão",
            agreement: "Convênio",
            service: "Prestação de serviço",
        },
        label_status: {
            Completed: "Completado",
            Ongoing: "Em andamento",
            Pending: "Pendente",
        },
        itemsType: [],
        itemsStudents: [],
        subjects: [
            {
                subject: null,
                course: null,
                event: null,
                program: null,
                project: null,
                agreement: null,
                service: null,
            }
        ],
        financing: [],
        defaultStudents: [
            {
                label: 'Curso',
                type: 'course',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Evento',
                type: 'event',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Programa de Extensão',
                type: 'program',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Projeto de Extensão',
                type: 'project',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Convênio',
                type: 'agreement',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Prestação de Serviço',
                type: 'service',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
        ],

        students: [
            {
                label: 'Curso',
                type: 'course',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Evento',
                type: 'event',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Programa de Extensão',
                type: 'program',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Projeto de Extensão',
                type: 'project',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Convênio',
                type: 'agreement',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
            {
                label: 'Prestação de Serviço',
                type: 'service',
                undergraduate: null,
                masters_degree: null,
                doctorate: null,
            },
        ],

    }),
    created() {
        this.initialize(2024);
        this.initializeReporSubjects(2024);
        this.initializeitemsSubjects(1);
    },

    watch: {
        'year'(newValue) {
            this.loading = true;
            this.loadingSubject = true;
            this.initialize(newValue);
            this.initializeReporSubjects(newValue);
        }
    },
    methods: {
        initialize(year) {
            this.$axios.get(`http://127.0.0.1:8000/api/actions/reports/${year}`).then((response) => {
                this.items = response.data.data;
                this.itemsType = response.data.data.types;
                this.itemsStatus = response.data.data.status;
                this.itemsStudents = response.data.data.students;
                this.students = JSON.parse(JSON.stringify(this.defaultStudents));
                this.itemsStudents.forEach((item) => {
                    this.students.forEach((student) => {
                        if (item.type === student.type) {
                            student[item.degree] = item.count;
                        }
                    })
                })
                this.financing = response.data.data.financing;
                this.itemsInstitutions = response.data.data.category;
                console.log(response);
                this.loading = false;
            }).catch((error) => {
                console.log(error)
            });
        },
        initializeReporSubjects(year) {
            this.$axios.get(`http://127.0.0.1:8000/api/action-subjects?year=${year}`).then((response) => {
                this.itemsReportsSubjects = response.data.data;
                this.related_subjects = this.itemsReportsSubjects.map(subject => {
                    let related_subject = {
                        "subject": subject.subject,
                        "course": null,
                        "event": null,
                        "program": null,
                        "project": null,
                        "agreement": null,
                        "service": null,
                    };
                    for (let type of this.types) {
                        let counSubjectByType = this.itemsReportsSubjects.find((item) => item.subject === subject.subject && type === item.type);
                        related_subject[type] = counSubjectByType ? counSubjectByType.count : 0;
                    }
                    return related_subject;
                });
                console.log(this.items);
                this.loadingSubject = false;
            })
        },
        initializeitemsSubjects(page) {
            this.$axios
                .get(`https://test-bapex.fe.unicamp.br/api/action-subjects?page=${page}`)
                .then((response) => {
                    this.itemsSubjects = response.data.data;
                    this.configPagination = response.data.meta;
                }).catch((error) => {
                    console.error(error);
                });
        },
        initializeActionTypes() {
            this.$axios.get("https://test-bapex.fe.unicamp.br/api/action-'types'").then((response) => {
                this.actionsType = response.data.data;
            }).catch((error) => {
                console.log(error)
            });
        },

        getCategoryNameById(category) {
            let categories = [{ id: 1, name: 'Setor público' }, { id: 2, name: 'Setor privado' }, { id: 3, name: 'Terceiro setor' }];
            let newCategory = categories.find(
                (item) => item.id === category
            )
            return newCategory ? newCategory.name : "";
        },
        getLabelsByItem(item, labels) {
            let label = labels[item];
            return label ? label : "";
        }

    }
}
</script>
<style scoped>
.custom-col {
    height: 91%;
    max-height: 91%;
}
</style>
