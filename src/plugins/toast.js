import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


const options = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 1,
    newestOnTop: true
}

const useToast = () => Toast(options);

export default useToast;