<template>
    <div class="d-flex flex-column align-items-center gap-3">
        <h4>Convite Aceito</h4>
        <p>O convite foi aceito com sucesso! Agora você tem acesso ao perfil do dependente e pode começar a acompanhar suas atividades.</p>
        <router-link :to="{ name: 'DependentList' }" class="btn btn-primary">Ver dependentes</router-link>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>