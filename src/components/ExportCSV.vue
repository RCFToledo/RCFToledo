<template>
    <download-csv :data="items" style="margin-right: 10px" :name="`${name}.csv`" :delimiter="';'">
        <v-btn icon="mdi-microsoft-excel" title="Exportar CSV" class="rounded-circle" variant="tonal"></v-btn>
    </download-csv>
</template>
  
<script>
export default {
    props: {
        lastPage: Number,
        url: String,
        name: String
    },
    data() {
        return {
            items: [],
        }
    },
created() {
    this.ExportItems();
},
methods: {
    ExportItems() {
        for (let i = 1; i <= this.lastPage; i++) {
            this.$axios.get(`${this.url}?page=${i}`).then((response) => {
                this.items.push(...response.data.data);
            }).catch((error) => {
                console.log(error);
            })
        }
    }
},
  };
</script>