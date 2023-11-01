<template>
    <div id="exportBtn">
        <v-menu>
            <template  v-slot:activator="{ props }">
                <v-btn color="secondary" variant="tonal" v-bind="props">
                    Exportar Dados
                </v-btn>
            </template>
            <v-list class="bg-primary">
                <v-list-item>
                    <v-list-item-title><v-btn @click="exportToCSV" variant="plain">Exportar em
                            CSV</v-btn></v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import Papa from 'papaparse';

export default {
    name: 'ExportData',
    methods: {
        exportToCSV() {
            const csv = Papa.unparse(this.data, {
                delimiter: ';'
            });
            const blob = new Blob([csv], { type: 'text/csv; charset=utf-8' });

            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.csv';
            a.click();
            URL.revokeObjectURL(url);
        },
    },
    props: {
        data: {
            type: Array, // Define o tipo como um array
            default: () => [] // Define um valor padrão como um array vazio
        },

    }
}

</script>
<style>
#exportBtn {
    margin-right: 10px;
}
</style>