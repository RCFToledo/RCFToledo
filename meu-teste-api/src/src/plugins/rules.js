const validationRules = {
  required: (v) => !!v || "Este campo é obrigatório",
  email: (v) => (!v || /.+@.+\..+/.test(v)) || "E-mail inválido",
  minLength: (min) => (v) => (!v || v.length >= min) || `Mínimo ${min} caracteres`,
  maxLength: (max) => (v) => (!v || v.length <= max) || `Máximo ${max} caracteres`,
  onlyNumbers: (v) => (!v || /^[0-9]*$/.test(v)) || "Apenas números permitidos"
}

export default {
  install(app) {
    app.config.globalProperties.$rules = validationRules
  }
}