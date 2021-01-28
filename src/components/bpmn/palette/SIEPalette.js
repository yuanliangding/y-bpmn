import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'

export default class SIEPaletteProvider extends PaletteProvider {

    constructor(
        palette,
        create,
        elementFactory,
        spaceTool,
        lassoTool,
        handTool,
        globalConnect,
        translate) {

        super(palette,
            create,
            elementFactory,
            spaceTool,
            lassoTool,
            handTool,
            globalConnect,
            translate);
    }

    getPaletteEntries(element){
        let paletteEntries = super.getPaletteEntries(element)
        console.log(paletteEntries)
        return paletteEntries
    }
}
