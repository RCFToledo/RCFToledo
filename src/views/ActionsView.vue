<template>
  <div>
    
    <v-data-table :headers="headers" :items="items" item-key="_id" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Ações</v-toolbar-title>
          <v-spacer></v-spacer>
          <download-csv :data="items" style="margin-right: 10px" name="ações.csv" :delimiter="';'">
            <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
          </download-csv>
          <v-dialog v-model="dialog" fullscreen>
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" size="x-large" density="compact" icon="mdi-plus" v-bind="props" variant="tonal"
                dark @click="action = { ...defaultAction }, tabModal = 0, isTab = 'Título'"></v-btn>
            </template>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                <v-tabs v-model="tabModal">
                  <v-tab v-for="(item, index) in tabTitle" :key="index" @click="isTab = item" :value="index">{{ item
                  }}</v-tab>
                </v-tabs>
                <v-spacer></v-spacer>
                <v-tabs hide-slider>
                  <v-tab v-ripple="false"><v-btn icon title="Fechar" class="rounded-circle ml-2" variant="tonal"
                      @click="dialog = false, initialize()">
                      <v-icon>mdi-close</v-icon>
                    </v-btn></v-tab>
                </v-tabs>
              </v-toolbar>
              <v-container fluid>
                {{ action.started_at }}
                <v-card-text>
                  <v-form ref="form" lazy-validation>
                    <v-row v-if="isTab === 'Título'">
                      <v-col cols="12" md="12">
                        <v-text-field v-model="action.title" :rules="[
                          () => !!action.title || 'Título é requerido!',
                          () => !(action.title.length > 60) || 'Título maior que o suportado',
                        ]" label="Título" :counter="60" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-text-field v-model="action.responsible_id" :rules="[
                          () => !!action.responsible_id || 'Responsável é requerido!',
                          () => !(action.responsible_id.length > 60) || 'Nome maior que o suportado',
                        ]" label="Responsável" :counter="60" required>
                        </v-text-field>
                        <v-col cols="12" md="12">
                          <v-text-field v-model="action.assistant_id" :rules="[
                            () => !(action.assistant_id !== null && action.assistant_id.length > 60) || 'Nome maior que o suportado',
                          ]" label="Auxiliar" :counter="60">
                          </v-text-field>
                        </v-col>
                      </v-col>
                    </v-row>
                    <v-row dense v-else-if="isTab === 'Dados'">
                      <v-col cols="12" md="12">
                        <v-select v-model="action.type" label="Tipo" :items="itemsType" item-title="label"
                          item-value="type" :rules="[
                            () => !!action.type || 'Tipo é requerido!',
                          ]"></v-select>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-autocomplete multiple chips :items="relatedSubjectsItems" item-title="subject" item-value="_id"
                          v-model="action.related_subjects" label="Temas relacionados" required></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-combobox chips multiple v-model="action.keywords" @keydown="getKeySpace" label="Palavras-chave"
                          required></v-combobox>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field v-model="action.started_at" label="Data de início" :rules="[
                          () => !!action.started_at || 'Data de ínicio é requirido',
                          () => !compareDates(action.started_at, action.ended_at) || 'Data de inicio é maior que termino'
                        ]" required v-mask-date.br></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field v-model="action.ended_at" label="Data de término" :rules="[
                          () => !compareDates(action.started_at, action.ended_at) || 'Data de termino é menor que inicial',
                        ]" v-mask-date.br :disabled="disabled"></v-text-field>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-switch color="primary" v-model="action.international" inset
                          :label="action.international ? 'Internacional' : 'Nacional'"></v-switch>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-switch color="primary" v-model="action.free" inset
                          :label="action.free ? 'Gratuito' : 'Pago'"></v-switch>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-textarea v-model="action.description" :rules="[
                          () => !!action.description || 'Descrição é requerida!',
                          () => !(action.description.length > 200) || 'Descrição maior que o suportado',
                        ]" label="Descrição" :counter="200" required></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row dense v-else-if="isTab === 'Avaliar'">
                      <v-col cols="12" md="12">
                        <v-select v-model="action.status" :items="status" item-value="value" item-title="title"
                          label="Situação" :rules="[
                            () => !!action.status || 'Situação é requerida',
                          ]" required></v-select>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-textarea v-model="action.justify" label="Justificativa" required></v-textarea>
                      </v-col>
                    </v-row>
                    <v-spacer></v-spacer>
                    <v-card v-if="isTab === 'Financiamentos'">
                      <ActionsFinancialView />
                    </v-card>
                    <v-card v-if="isTab === 'Membros'">
                      <ActionsMembersView />
                    </v-card>
                    <v-card v-if="isTab === 'Enviar'" variant="tonal">
                      <v-card-title>Termo de responsabilidades</v-card-title>
                      <v-card-text class="text-body-1 text-left">
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                          the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                          of
                          type and scrambled it to make a type specimen book. It has survived not only five centuries, but
                          also the leap into electronic typesetting, remaining essentially unchanged. It was popularised
                          in
                          the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                          with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                        <p>Why do we use it?
                          It is a long established fact that a reader will be distracted by the readable content of a page
                          when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
                          distribution of letters, as opposed to using 'Content here, content here', making it look like
                          readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as
                          their default model text, and a search for 'lorem ipsum' will uncover many web sites still in
                          their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on
                          purpose (injected humour and the like).</p><br>


                        <p>Where does it come from?
                          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                          classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
                          Latin
                          professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words,
                          consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical
                          literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
                          1.10.33
                          of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC.
                          This book is a treatise on the theory of ethics, very popular during the Renaissance. The first
                          line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
                        <br>

                        <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those
                          interested.
                          Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced
                          in
                          their exact original form, accompanied by English versions from the 1914 translation by H.
                          Rackham.</p><br>

                        <p>Where can I get some?
                          There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                          alteration in some form, by injected humour, or randomised words which don't look even slightly
                          believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't
                          anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the
                          Internet
                          tend to repeat predefined chunks as necessary, making this the first true generator on the
                          Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model
                          sentence
                          structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is
                          therefore
                          always free from repetition, injected humour, or non-characteristic words etc.</p><br>
                      </v-card-text>
                      <v-card-actions>
                        <v-checkbox class="elevation-0"
                          label="Declaro que estou ciente de todas responsabilidades sobre a Ação" v-model="acceptTerm"
                          :rules="[
                            () => !!acceptTerm || 'Aceitar o termo é requerido',
                          ]" required></v-checkbox>
                      </v-card-actions>
                    </v-card>
                    <v-col>
                      <v-btn color="primary" variant="tonal" @click="formSubmit"
                        v-if="isTab !== 'Financiamentos' && isTab !== 'Membros'">{{ isTab !== 'Enviar' ? 'Salvar' :
                          'Finalizar' }}</v-btn>
                    </v-col>
                  </v-form>
                </v-card-text>
              </v-container>
              {{ }}
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
                <v-btn color="primary" variant="tonal" @click="deleteActionConfirm">
                  Excluir
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.type="{ item }">
        {{ getTypeTitle(item.type) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.responsible_id="{ item }">
        {{ getResponsibleNameById(item.responsible_id) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.international="{ item }">
        {{ getBooleanType(item.international) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.free="{ item }">
        {{ getBooleanType(item.free) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.status="{ item }">
        {{ getStatusTitle(item.status) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-btn variant="tonal" size="small" icon="mdi-dots-vertical" flat color="primary">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent" color="secondary">
            <v-list>
              <v-list-item class="bg-primary" size="small">Editar</v-list-item>
              <v-list-item prepend-icon="mdi-pencil" title="Título" size="small"
                @click="editAction(item, 'Título')"></v-list-item>
              <v-list-item prepend-icon="mdi-database" title="Dados"
                @click="editAction(item, 'Dados', 1)"></v-list-item>
              <v-list-item prepend-icon="mdi-cash-multiple" title="Financiamentos"
                @click="editAction(item, 'Financiamentos', 2)"></v-list-item>
              <v-list-item prepend-icon="mdi-account-multiple" title="Membros"
                @click="editAction(item, 'Membros', 3)"></v-list-item>
              <v-list-item prepend-icon="mdi-poll" title="Avaliação"
                @click="editAction(item, 'Avaliar', 5)"></v-list-item>
              <v-list-item prepend-icon="mdi-delete" title="Excluir" size="small"
                @click="deleteAction(item)"></v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
      <template v-slot:no-data> Não há dados para exibir!</template>
    </v-data-table>
  </div>
</template>


<script>
import moment from 'moment'
import ActionsMembersView from '../views/ActionsMembersView.vue'
import ActionsFinancialView from '../views/ActionsFinancialView.vue'
export default {
  components: {
    ActionsMembersView,
    ActionsFinancialView
  },
  data: () => ({
    valid: false,
    dialog: false,
    itemsDelete: false,
    dialogMembers: false,
    acceptTerm: false,
    isTab: 'Título',
    tabModal: null,
    tabTitle: [
      'Título',
      'Dados',
      'Financiamentos',
      'Membros',
      'Enviar',
      'Avaliar',
    ],
    user: 'professor',
    dialogFinancing: false,
    headers: [
      {
        title: "Título",
        align: "start",
        key: "title",
      },
      { title: "Tipo", key: "type" },
      { title: "Responsável", key: "responsible_id" },
      { title: "Situação", key: "status" },
      { title: "Data de inicio", key: "started_at" },
      { title: "Data de termino", key: "ended_at" },
      { title: "Opções", key: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    relatedSubjectsItems: [],
    itemsPeople: [],
    itemsType: [],
    action: {},
    disabled: null,
    defaultAction: {
      _id: null,
      type: null,
      description: null,
      keywords: null,
      responsible_id: null,
      status: null,
      related_subjects: null,
      international: null,
      started_at: null,
      ended_at: null,
      free: null,
      assistant_id: null,
      justify: null,
    },
    status: [
      {
        title: "Em análise",
        value: "in_progress"
      },
      {
        title: "Aprovada",
        value: "approved"
      },
      {
        title: "Reprovada",
        value: "repproved"
      },
      {
        title: "Cancelada",
        value: "cancelled"
      }
    ]
  }),


  computed: {
    formTitle() {
      return !this.action._id ? "Nova ação" : "Editar ação";
    },
  },

  watch: {
    'action.status'(newValue) {
      if (newValue === 'in_progress') {
        this.disabled = 'disabled';
        this.action.ended_at = null;
      } else {
        this.disabled = null;
      }
    },
  },

  created() {
    this.initialize();
    this.getActionSubjects();
    this.initializePeople();
    this.initializeActionTypes();
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
          this.items.forEach((memberGroup) => {
            if (!this.items.started_at) {
              memberGroup.started_at = this.getDate(memberGroup.started_at);
            }
            if (!this.items.ended_at) {
              memberGroup.ended_at = this.getDate(memberGroup.ended_at);
            }
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },
    initializePeople() {
      this.$axios
        .get("people/")
        .then((response) => {
          let people = response.data;
          people.forEach((person) => {
            if (person.institution_id === this.$store.getters.getUnicamp_id && person.academic_profile !== 'staff') {
              this.itemsPeople.push(person);
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    initializeActionTypes() {
      this.$axios.get("https://test-bapex.fe.unicamp.br/api/action-types").then((response) => {
        this.itemsType = response.data.data;
      }).catch((error) => {
        console.log(error)
      });
    },

    editAction(item, tab, index) {
      this.action = item;
      this.dialog = true;
      this.isTab = tab;
      this.tabModal = index;
    },

    deleteAction(item) {
      this.action = item;
      this.itemsDelete = true;
    },

    deleteActionConfirm() {
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

    getActionSubjects() {
      this.$axios.get("https://test-bapex.fe.unicamp.br/api/action-subjects").then((response) => {
        this.relatedSubjectsItems = response.data.data;
      })
    },

    save() {
      this.action.started_at = this.setDate(this.action.started_at);
      if (this.action.ended_at) {
        this.action.ended_at = this.setDate(this.action.ended_at);
      }
      if (this.action._id) {
        this.$axios
          .put("actions/" + this.action._id, this.action)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.initialize();
              this.items.forEach((action) => {
                action.started_at = this.getDate(action.started_at);
                action.ended_at = this.getDate(action.ended_at);
              })
              this.$toast.success(response.statusText);
              if (this.isTab === 'Enviar') {
                this.dialog = false;
                this.action = this.defaultAction;
              }
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
              this.$toast.success(response.statusText);
              if (this.isTab === 'Enviar') {
                this.dialog = false;
                this.action = this.defaultAction;
              }
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
      const typeItems = this.itemsType.find(
        (item) => item.type === type
      );
      return typeItems ? typeItems.label : "";
    },

    compareDates(start, end) {
      let momentInit = moment.utc(start, "DD/MM/YYYY");
      let momentFinal = moment.utc(end, "DD/MM/YYYY");
      let dateInit = momentInit.format('YYYY-MM-DD');
      let dateFinal = momentFinal.format('YYYY-MM-DD');

      if (end !== null) {
        return dateInit > dateFinal ? true : false;
      }

    },
    getDate(date) {
      let momentDate = moment.utc(date, "YYYY-MM-DD");
      let formatDate = momentDate.format('DD/MM/YYYY');
      if (momentDate.isValid()) {
        return formatDate;
      } else {
        return null;
      }

    },
    setDate(date) {
      let momentDate = moment.utc(date, "DD/MM/YYYY");
      let formatDate = momentDate.format('YYYY-MM-DD');
      if (momentDate.isValid()) {
        return formatDate;
      } else {
        return null;
      }
    },
    getResponsibleNameById(responsibleId) {
      const responsible = this.itemsPeople.find(
        (item) => item._id === responsibleId
      );
      return responsible ? responsible.full_name : "";
    },
    getBooleanType(isTrue) {
      return isTrue ? 'Sim' : 'Não';
    },
    getStatusTitle(statusId) {
      for (let gridStatus of this.status) {
        if (gridStatus.value === statusId) {
          return gridStatus.title;
        }
      }
    },
  },
}
</script>
<style></style>
