<template>  
  <div>    
    <v-form>
      <v-container fluid>
        <ToastSnackbar
          v-model="showSnackbar"
          :snackbarText="snackbarText"
          :snackbarType="snackbarType"
        ></ToastSnackbar>

        <v-card>
          <v-card-title class="custom-card-title">
            <v-icon>mdi-clock-outline</v-icon>
            Carga Didática
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="2">
                <v-select
                  v-model="semester"
                  :items="[2]"
                  label="Semestre"
                  name="semester"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="year"
                  :items="yearOptions"
                  label="Ano"
                  name="year"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="department"
                  :items="departments"
                  :item-title="formatDepartmentName"
                  item-value="CDEPTDOC"
                  label="Departamento"
                  name="department"
                  @change="showReport=false"
                  required                  
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="groupByTeacher"
                  :items="groupByTeacherItems"
                  label="Cálculo da Carga"
                  item-title="text"
                  item-value="value"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <v-btn color="secondary" @click="clearFields" block>
                  Limpar Dados
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  :disabled="
                    this.department == null ||
                    this.semester == null ||
                    this.year == null
                      ? true
                      : false || this.groupByTeacher == null
                  "
                  color="primary"
                  dark
                  @click="submitForm"
                  block
                >
                  Gerar Relatório
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>

      <v-container fluid v-if="showReport">
        <v-row>
          <v-col cols="12">
            <v-card class="elevation-2 custom-card">
              <v-card-text>
                <div class="total-hours">
                  <v-row>
                    <v-col cols="12" sm="2">
                      <v-card min-height="80px" color="secondary">
                        <v-card-subtitle class="mt-2"
                          >Total de Docentes</v-card-subtitle
                        >
                        <v-card-text>{{ totalTeachers }}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-card min-height="80px" color="secondary">
                        <v-card-subtitle class="mt-2"
                          >Total de Horas/Semestre</v-card-subtitle
                        >
                        <v-card-text>{{ totalHours }}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-card min-height="80px" color="secondary">
                        <v-card-subtitle class="mt-2"
                          >Média de Horas/Semestre</v-card-subtitle
                        >
                        <v-card-text>{{ averageHours }}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-card min-height="80px" color="secondary">
                        <v-card-subtitle class="mt-2"
                          >Total de Horas/Semana</v-card-subtitle
                        >
                        <v-card-text>{{ totalHoursWeek }}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-card min-height="80px" color="secondary">
                        <v-card-subtitle class="mt-2"
                          >Média de Horas/Semana</v-card-subtitle
                        >
                        <v-card-text>{{ averageHoursWeek }}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <vue-json-csv
                        :data="
                          groupByTeacher == false
                            ? finalReport
                            : finalReportTeacher
                        "
                      >
                        <v-btn
                          color="fesuccess"
                          min-height="80px"
                          class="w-100"
                        >
                          <v-icon
                            size="large"
                            icon="mdi-microsoft-excel"
                            class="mr-4"
                          ></v-icon>
                          Exportar CSV
                        </v-btn>
                      </vue-json-csv>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
              <v-card-text>
                <v-toolbar flat>
                  <v-toolbar-title class="text-h5"
                    >Carga Didática Docente</v-toolbar-title
                  >
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Buscar"
                    hide-details
                  ></v-text-field>
                </v-toolbar>
              </v-card-text>
              <v-data-table
                v-if="groupByTeacher == false"
                :items="finalReport"
                :headers="headersNoTeacher"
                :footer-props="{ itemsPerPageOptions: [5, 10, 25, 100] }"
                :search="search"
                :items-per-page="100"
                items-per-page-text="Itens por Página: "
                no-data-text="Não há dados para exibir!"
                class="elevation-1 custom-table"
              >
                <template v-slot:top></template>
                <template #item="{ item, index }">
                  <tr>
                    <td class="text-start">
                      <b>{{ index + 1 }}</b>
                    </td>
                    <td class="text-start">{{ item.selectable.MATRICULA }}</td>
                    <td class="text-start">{{ item.selectable.DOCENTE }}</td>
                    <td class="text-start red--text">
                      {{ item.selectable.SITUACAO }}
                    </td>
                    <td class="text-start">
                      {{ item.selectable.CODIGODISCIPLINA }}
                    </td>
                    <td class="text-start">{{ item.selectable.TURMA }}</td>
                    <td class="text-start">{{ item.selectable.DISCIPLINA }}</td>
                    <td class="text-start">
                      {{ item.selectable.PARTICIPACAO }}%
                    </td>
                    <td class="text-start">
                      {{ item.selectable.CARGAHORARIASEMESTRAL }} horas
                    </td>
                    <td class="text-start">
                      {{ item.selectable.CARGAHORARIASEMANAL }} horas
                    </td>
                  </tr>
                </template>
                <template v-slot:[`footer.page-text`]="items">
                  {{ items.pageStart }} - {{ items.pageStop }} de
                  {{ items.itemsLength }}
                </template>
              </v-data-table>
              <v-data-table
                v-else
                :items="finalReportTeacher"
                :headers="headersTeacher"
                :footer-props="{ itemsPerPageOptions: [5, 10, 25, 100] }"
                :search="search"
                :items-per-page="100"
                items-per-page-text="Itens por Página: "
                no-data-text="Não há dados para exibir!"
                class="elevation-1 custom-table"
              >
                <template v-slot:top></template>
                <template #item="{ item, index }">
                  <tr>
                    <td class="text-start">
                      <b>{{ index + 1 }}</b>
                    </td>
                    <td class="text-start">{{ item.selectable.MATRICULA }}</td>
                    <td class="text-start">{{ item.selectable.DOCENTE }}</td>
                    <td class="text-start">{{ item.selectable.SITUACAO }}</td>
                    <td class="text-start">
                      {{ item.selectable.CARGAHORARIASEMESTRAL }} horas
                    </td>
                    <td class="text-start">
                      {{ item.selectable.CARGAHORARIASEMANAL }} horas
                    </td>
                  </tr>
                </template>
                <template v-slot:[`footer.page-text`]="items">
                  {{ items.pageStart }} - {{ items.pageStop }} de
                  {{ items.itemsLength }}
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import VueJsonCsv from "vue-json-csv";
import ToastSnackbar from "../components/ToastSnackbar.vue";

import axios from "axios";
export default {
  components: {
    VueJsonCsv,
    ToastSnackbar,
    
  },
  data() {
    return {
      semester: 2,
      year: 2023,
      department: null,
      faculty: "",
      yearOptions: [],
      departments: [],
      numberTeacherDepartments: [],
      teacherNoDisc: [],
      facultyOptions: [],      
      finalReport: [],
      finalReportTeacher: [],
      showReport: false,
      headersNoTeacher: [
        { title: "#", align: "start" },
        { title: "Matrícula", align: "start", key: "MATRICULA" },
        { title: "Docente", align: "start", key: "DOCENTE" },
        { title: "Situação", align: "start", key: "SITUACAO" },
        {
          title: "Código da Disciplina",
          align: "start",
          key: "CODIGODISCIPLINA",
        },
        { title: "Turma", align: "start", key: "TURMA" },
        { title: "Disciplina", align: "start", key: "DISCIPLINA" },
        { title: "Participação", align: "start", key: "PARTICIPACAO" },
        {
          title: "Carga Horária Semestral",
          align: "start",
          key: "CARGAHORARIASEMESTRAL",
        },
        {
          title: "Carga Horária Semanal",
          align: "start",
          key: "CARGAHORARIASEMANAL",
        },
      ],
      headersTeacher: [
        { title: "#", align: "start" },
        { title: "Matrícula", align: "start", key: "MATRICULA" },
        { title: "Docente", align: "start", key: "DOCENTE" },
        { title: "Situação", align: "start", key: "SITUACAO" },
        {
          title: "Carga Horária Semestral",
          align: "start",
          key: "CARGAHORARIA",
        },
        {
          title: "Carga Horária Semanal",
          align: "start",
          key: "CARGAHORARIASEMANAL",
        },
      ],
      search: "", // Filtro de busca
      groupByTeacher: null,
      totalHours: 0,
      totalTeachers: 0,
      totalHoursWeek: 0,
      groupByTeacherItems: [
        { text: "Exibir Carga por Docente", value: true },
        { text: "Exibir Carga por Turma", value: false },
      ],
      showSnackbar: false,
      snackbarText: "",
      snackbarType: "",
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    averageHours() {
      if (this.totalTeachers > 0) {
        return (this.totalHours / this.totalTeachers).toFixed(2);
      }
      return "0.00";
    },
    averageHoursWeek() {
      if (this.totalTeachers > 0) {
        return (this.totalHoursWeek / this.totalTeachers).toFixed(2);
      }
      return "0.00";
    },
  },
  mounted() {   
    if (this.$store.state.token === null) {
      this.$router.push('/');
    }
    this.fetchDepartments();
    this.generateYearOptions();
    this.fetchNumberTeachersDepartments();
    this.updateTotalValues();
  },
  methods: {
    clearFields() {
      this.semester = null;
      this.year = null;
      this.department = null;
      this.groupByTeacher = null;
      this.showReport = false;
      this.showToast("Dados limpos com sucesso!", "success");
    },
    showToast(message, type) {
      this.snackbarText = message;
      this.snackbarType = type;
      this.showSnackbar = true;
    },
    formatDepartmentName(obj) {
      if (obj.CDEPTDOC == "1900") {
        return "Sem Departamento";
      }
      const words = obj.MLOT1.toLowerCase().split(" ");
      const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      return capitalizedWords.join(" ");
    },
    fetchDepartments() {      
      axios
       .get("Departaments/", {params: { token: this.$store.state.token }})
        .then((response) => {
          this.departments = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },              
    fetchNumberTeachersDepartments() {
      axios
        .get("NumberTeacherDepartaments/", {params: { token: this.$store.state.token}})
        .then((response) => {
          this.numberTeacherDepartments = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchTeacherNoDisc() {
      axios
        .get("TeacherNoDisc/", {params: { token: this.$store.state.token}})
        .then((response) => {
          this.teacherNoDisc = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    generateYearOptions() {
      const currentYear = this.currentYear;
      const years = [];
      for (let i = currentYear; i >= 2023; i--) {
        years.push(i);
      }
      this.yearOptions = years;
    },
    submitForm() {
      if (
        this.department !== null &&
        this.semester !== null &&
        this.year !== null
      ) {
        const apiUrl = `FinalReport/?department=${this.department}&semester=${this.semester}&year=${this.year}`;
        const apiUrlTeacherNoDisc = `TeacherNoDisc/?department=${this.department}&semester=${this.semester}&year=${this.year}`;
        axios
          .get(apiUrl, {params: { token: this.$store.state.token}})
          .then((response) => {
            this.finalReport = response.data;
            this.genfinalReportTeacher();
            this.updateTotalValues();
            this.showReport = true;
            this.showToast("Relatório gerado com sucesso!", "success");
          })
          .catch((error) => {
            console.error(error);
          });
        axios
          .get(apiUrlTeacherNoDisc, {params: { token: this.$store.state.token}})
          .then((response) => {
            this.teacherNoDisc = response.data;
            this.genfinalReportTeacher();
            this.showToast("Relatório gerado com sucesso!", "success");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    calculateTotalHours() {
      return this.finalReport.reduce((totalHours, item) => {
        const hours = parseFloat(item.CARGAHORARIASEMESTRAL);
        return totalHours + (isNaN(hours) ? 0 : hours);
      }, 0);
    },
    calculateTotalHoursWeek() {
      return this.finalReport
        .reduce((totalHoursWeek, item) => {
          const hours = parseFloat(item.CARGAHORARIASEMANAL);
          return totalHoursWeek + (isNaN(hours) ? 0 : hours);
        }, 0)
        .toFixed(2);
    },
    getTotalTeacherByDepartmentCode(code) {
      const item = this.numberTeacherDepartments.find(
        (item) => item.CDEPTDOC === code
      );
      return item ? item.total : "";
    },
    updateTotalValues() {
      this.totalHours = this.calculateTotalHours();
      this.totalHoursWeek = this.calculateTotalHoursWeek();
      this.totalTeachers = this.getTotalTeacherByDepartmentCode(
        this.department
      );
    },
    genfinalReportTeacher: function () {
      var mapMATRICULA = new Map();
      var mapDOCENTE = new Map(); // Mapa para armazenar os nomes dos docentes
      var mapSITUACAO = new Map(); // Mapa para armazenar as descrições da situação      

      for (var i = 0; i < this.finalReport.length; i++) {
        var linha = this.finalReport[i];
        var MATRICULA = linha.MATRICULA;
        var DOCENTE = linha.DOCENTE;
        var CARGAHORARIASEMESTRAL = parseFloat(linha.CARGAHORARIASEMESTRAL);        
        var SITUACAO = linha.SITUACAO; // Supondo que 'SITUACAO' esteja presente no objeto 'linha'

        if (mapMATRICULA.has(MATRICULA)) {
          var somaAnterior = mapMATRICULA.get(MATRICULA);
          mapMATRICULA.set(MATRICULA, somaAnterior + CARGAHORARIASEMESTRAL);
        } else {
          mapMATRICULA.set(MATRICULA, CARGAHORARIASEMESTRAL);
          mapDOCENTE.set(MATRICULA, DOCENTE); // Adicionar o nome do docente ao mapa
          mapSITUACAO.set(MATRICULA, SITUACAO); // Adicionar a descrição da situação ao mapa          
        }
      }
      for (var j = 0; j < this.teacherNoDisc.length; j++) {
        var teacherData = this.teacherNoDisc[j];
        MATRICULA = teacherData.MATRICULA;
        DOCENTE = teacherData.DOCENTE;
        CARGAHORARIASEMESTRAL = 0; // Definir CARGAHORARIASEMESTRAL como 0 para os dados do teacherNoDisc        
        SITUACAO = teacherData.SITUACAO; // Supondo que 'SITUACAO' esteja presente no objeto 'teacherData'

        if (!mapMATRICULA.has(MATRICULA)) {
          mapMATRICULA.set(MATRICULA, CARGAHORARIASEMESTRAL);
          mapDOCENTE.set(MATRICULA, DOCENTE);
          mapSITUACAO.set(MATRICULA, SITUACAO);         
        }
      }

      var newJson = [];
      mapMATRICULA.forEach(function (CARGAHORARIASEMESTRAL, MATRICULA) {
        var DOCENTE = mapDOCENTE.get(MATRICULA); // Obter o nome do docente a partir do mapDOCENTE
        var SITUACAO = mapSITUACAO.get(MATRICULA); // Obter a descrição da situação a partir do mapSITUACAO        
        var lineNewJson = {
          MATRICULA: MATRICULA,
          DOCENTE: DOCENTE,
          SITUACAO: SITUACAO, // Adicionar o campo 'SITUACAO' ao novo JSON
          CARGAHORARIASEMESTRAL: CARGAHORARIASEMESTRAL.toFixed(2),
          CARGAHORARIASEMANAL: (CARGAHORARIASEMESTRAL/15).toFixed(2),
        };
        newJson.push(lineNewJson);
      });

      this.finalReportTeacher = newJson;
    },
  },
};
</script>

<style>
.custom-card-title {
  color: grey;
}
</style>