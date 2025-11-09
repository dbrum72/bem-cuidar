<template>
    <div class="">
        <div class="d-flex areaHeader">
            <span class="font12rW600TuCg pe-2">Evento</span>
            <router-link class="btn btn-sm btn-gray" :to="{ name: 'AppointmentList' }">Lista</router-link>
        </div>
        <div class="subArea mb-5">
            <div class="d-flex justify-content-between m-2 title-sub-area">
                <div><span>Informações</span></div>
            </div>
            <div class="dados">
                <div class="tupla">
                    <div class="field">
                        ID
                    </div>
                    <div class="data">
                        {{ appointment.id }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Dependente
                    </div>
                    <div class="data">
                        {{ getDependentName(appointment.dependent_id) }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Título
                    </div>
                    <div class="data">
                        {{ appointment.title }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Início
                    </div>
                    <div class="data">
                        {{ appointment.start_datetime }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Fim
                    </div>
                    <div class="data">
                        {{ appointment.end_datetime }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Local
                    </div>
                    <div class="data">
                        {{ appointment.location }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Descrição
                    </div>
                    <div class="data">
                        {{ appointment.description }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Criado em
                    </div>
                    <div class="data">
                        {{ appointment.created_at ? formatDate(this.appointment.created_at) : '' }}
                    </div>
                </div>
                <div class="tupla">
                    <div class="field">
                        Atualizado em
                    </div>
                    <div class="data">
                        {{ appointment.updated_at ? formatDate(this.appointment.updated_at) : '' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
import AbstractMixin from '@/mixins/AbstractMixin'
import AppointmentMixin from '@/mixins/AppointmentMixin'

export default {

    name: 'AppointmentShow',

    mixins: [AbstractMixin, AppointmentMixin],

    computed: {        
        ...mapState('appointment', ['appointment']),
        ...mapState('dependent', ['dependents']),
        ...mapState(['errors', 'loader']),
    },

    methods: {
        getDependentName(dependent_id) {
            const d= this.dependents.find(a => a.id === dependent_id);
            return d ? c.name : '';
        }
    },

    mounted() {
        this.getAppointment(this.$route.params.id)
    }
}
</script>

<style></style>