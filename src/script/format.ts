export interface IFormat {
    readonly propsHeader: RegExp;
    readonly setHeader: RegExp;
    readonly sceneHeader: RegExp;
    readonly dialogue: RegExp;
    readonly characterCue: RegExp;
    readonly parenthical: RegExp;
    readonly action: RegExp;
    readonly transition: RegExp;
    readonly description: RegExp;

    readonly order: Array<RegExp>
}


export class ScreenplayFormat implements IFormat {
    //public readonly sceneHeader: RegExp = /((EXT|INT)\\. )(*.?)/;
    public readonly propsHeader: RegExp = /^PROPS$/;
    public readonly setHeader: RegExp = /^SET (?<name>[^$]+)$/;
    public readonly sceneHeader: RegExp = /^[\s]*(?<ext>EXT|INT). (?<heading>[^$]+)/;
    public readonly dialogue: RegExp = /^(\t{1,}| {2,})(?<line>[^$]+)/;
    public readonly characterCue: RegExp =  /^(\t{1,}| {2,})(?<name>[A-Z0-9 ]{2,}[^\s])\s*(\((?<extension>.*)\))?[\s]*$/
    public readonly parenthical: RegExp = /^(\t{1,}| {2,})\((?<line>[^$]+)\)$/;
    public readonly action: RegExp = /^(?<line>[^\s][^$]+)/;
    public readonly transition: RegExp = /^(?<line>[^\s][A-Z0-9 ]+):$/;
    public readonly description: RegExp = /(?<name>[A-Z0-9 ]{2,}), [a|an] (?<type>[^,]+)[, ]*(?<attributes>.*)?$/

    public readonly order = [
        this.propsHeader,
        this.setHeader,
        this.sceneHeader,
        this.parenthical,
        this.characterCue,
        this.dialogue,
        this.transition,
        this.description,
        this.action
    ]

    public readonly nameCharacters = '[A-Z \\-0-9]+';
    public readonly nameGroup = '(?<name>' + this.nameCharacters + ')';
    public readonly propsDefinition = 'PROPS$';
    public readonly setDefinition = 'SET ' + this.nameGroup;
    public readonly actDefinition = 'ACT (?<name>.*)';
    public readonly sceneDefinition = 'SCENE (?<name>.*)';
    public readonly characterDescription = this.nameGroup + ', [a|an] (?<type>[^,]+)[, ]*(?<properties>.*)?'
    //public readonly characterCue = this.nameGroup + '$'
}