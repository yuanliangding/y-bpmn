<template>
    <div id="y-bpmn-palette-container" :style="{width: width, height: height}">
        <div :class="['y-bpmn-palette-group']" :style="{width: width}" :data-group="group.group" v-for="group in bpmnContext.entries" v-bind:key="group" >
            <div :class="['y-bpmn-palette-item', entry.className]"
                 :draggable="true"
                 :data-action="entry.dataAction"
                 :title="entry.title"
                 v-for="entry in group.list" v-bind:key="entry" >
                &#xe84d;
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
            width: {
                type: String,
                default: "100%"
            },
            height: {
                type: String,
                default: "1000px"
            }
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
        flex-flow:column nowrap;
        display:inline;
    }

    #y-bpmn-palette-container .y-bpmn-palette-group {
        flex-flow:row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start
    }

    #y-bpmn-palette-container .y-bpmn-palette-group .y-bpmn-palette-item {
        width: 60px;
        height: 60px;
        margin: 5px;
        display:inline;
    }

</style>
