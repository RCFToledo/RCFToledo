<template>
    <div>
        <v-btn @click="exportToCSV" color="secondary">Export to CSV</v-btn>
    </div>
</template>

<script>
import Papa from 'papaparse'
export default {
    name: 'ExportData',
    methods: {
        exportToCSV() {
            // Converte os dados em formato CSV usando o PapaParse
            const csv = Papa.unparse(this.data, {
                delimiter: ';'
            });

            // Cria um objeto Blob
            const blob = new Blob([csv], { type: 'text/csv' });

            // Cria um objeto URL a partir do Blob
            const url = URL.createObjectURL(blob);

            // Cria um link <a> para fazer o download do arquivo
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.csv';

            // Dispara o clique no link para iniciar o download
            a.click();

            // Libera a URL do objeto Blob
            URL.revokeObjectURL(url);
        }
    },
    // Dados que você deseja exportar, por exemplo, uma lista de objetos
    props: {
        data: {
            type: Array, // Define o tipo como um array
            default: () => [] // Define um valor padrão como um array vazio
        },
    }
}

</script>