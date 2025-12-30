import store from "@/store";

export function startLoader() {
    store.commit("loader/START_LOADING", null, { root: true });
}

export function stopLoader() {
    store.commit("loader/STOP_LOADING", null, { root: true });
}
