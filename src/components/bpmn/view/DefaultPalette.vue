<template>
    <div>
        <div v-for="entry in bpmnContext.entries" v-bind:key="entry" >
            {{entry}}
        </div>
    </div>
</template>

<script>
    import {inject, onMounted, reactive} from  'vue';

    export default {
        name: "DefaultPalette",
        props: {

        },
        data: function(){
            return {
            }
        },
        setup() {
            let bpmnContext = reactive({})
            onMounted(
                () => {
                    let bpmnContext_ = inject('bpmnContext')
                    bpmnContext.entries = bpmnContext_.entries;
                }
            )
            return {bpmnContext}
        },
        mounted() {
            console.log(" mounted  ")


        }
    }
</script>

<style scoped>

</style>
