<template>
    <div class="row gy-2 gx-2 mb-3 align-items-center">

        <div class="col-sm-12 col-md-7">
            <select v-model="model.tutor_id" class="form-select form-control-lg" @change="emitChange">
                <option value="">Selecione um tutor...</option>
                <option v-for="t in tutors" :key="t.id" :value="t.id" :disabled="isDisabled(t.id)">
                    {{ t.name }}
                </option>
            </select>
        </div>

        <div class="col-sm-6 col-md-4">
            <div class="input-group input-group-lg">
                <input type="number" min="0" max="100" v-model.number="model.share_percentage"
                    class="form-control text-center" placeholder="%" @input="emitChange" />
                <span class="input-group-text">%</span>
            </div>
        </div>

        <div class="col-sm-6 col-md-1">
            <button class="btn btn-outline-danger btn-lg" @click="$emit('remove')" aria-label="Remover tutor">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ParticipantRow",

    props: {
        modelValue: Object,
        tutors: Array,
        existing: Array
    },

    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit("update:modelValue", val);
            }
        }
    },

    methods: {
        emitChange() {
            this.$emit("update:modelValue", this.model);
        },

        isDisabled(id) {
            return this.existing.includes(id) && id !== this.model.tutor_id;
        }
    }
};
</script>

<style scoped></style>
