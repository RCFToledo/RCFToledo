<template>
    <v-autocomplete ref="autocomplete" @update:search="textFilter(itemTitle, this.$refs.autocomplete.search, url)"
        :disabled="disabled" :maxlength="60" variant="outlined" :items="internalItems" :item-title="itemTitle"
        :item-value="itemValue" :rules="rules" :label="label" :counter="60" :chips="chips" :multiple="multiple" v-model="internalValue" required>
    </v-autocomplete>
</template>
<script>
export default {
    name: 'MyAutocomplete',
    props: {
        disabled: Boolean,
        rules: {
            type: Array,
            default: () => [() => true] // Uma regra padrão que sempre passa
        },
        multiple: {
            type: Boolean,
            default: false
        },
        chips: {
            type: Boolean,
            default: false
        },
        lastPage: Number,
        url: String,
        itemTitle: String,
        itemValue: Number,
        items: Array,
        label: String,
        modelValue: [String, Number, Object],
    },
    data() {
        return {
            internalValue: this.modelValue,
            internalItems: this.items // Inicializar internalValue com o valor da prop modelValue
        };
    },
    watch: {
        modelValue(newValue) {
            this.internalValue = newValue;
            // Atualizar internalValue quando a prop modelValue mudar
        },
        internalValue(newValue) {
            this.$emit('update:modelValue', newValue); // Emitir evento de atualização quando internalValue mudar
        },
        items(newItems) {
            this.internalItems = newItems; // Atualizar internalItems quando a prop items mudar
        }
    },
    methods: {
        textFilter(index, value, url) {
            this.$axios
                .get(`${url}?textFilters[${index}]=${encodeURIComponent(value)}`)
                .then((response) => {
                    this.internalItems = response.data.data;
                    console.log(value);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
}
</script>

<style></style>