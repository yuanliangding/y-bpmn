<template>
    <div id="y-bpmn-palette-container">
        <!--        { "group": "tools", "className": "bpmn-icon-hand-tool", "title": "", "action": {} }-->


        <div :class="['y-bpmn-palette-group', 'group']" :data-group="group.group" v-for="group in bpmnContext.entries" v-bind:key="group" >
            <div :class="['y-bpmn-palette-item', 'entry', entry.className]"
                 :draggable="true"
                 :data-action="'entry.dataAction'"
                 :title="entry.title"
                 v-for="entry in group.list" v-bind:key="entry" >
<!--{{entry.title}}-->

            </div>
            <hr class="separator">
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
    #y-bpmn-palette-container {
        flex-flow:column wrap

    }

    #y-bpmn-palette-container .y-bpmn-palette-item {

    }

</style>
