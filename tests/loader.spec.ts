import { script as script1 } from './script1';
import { CharacterDescription, SceneSection} from '../src/script/elements'
import { Loader, ScreenPlay } from '../src/script/loader';
import * as should from 'should';

describe("Loader with script1", () =>{
    let screenPlay: ScreenPlay = null;
    let scene1: SceneSection = null;

    before(() => {
        const loader = new Loader();
        screenPlay = loader.Load(script1)
        console.log(screenPlay);
        scene1 = screenPlay.acts[0].scenes[0];
    });

    it("should load top level elements", () =>{
        should(screenPlay.acts).lengthOf(2);
        should(screenPlay.sets).lengthOf(1);
    });

    it("should extract act names", () =>{
        should(screenPlay.acts[0].heading).equal('1');
        should(screenPlay.acts[1].heading).equal('2');
    });

    it("should extract scene names", () =>{
        should(screenPlay.acts[0].scenes[0].heading).equal('1');
        should(screenPlay.acts[0].scenes[1].heading).equal('2');
        should(screenPlay.acts[1].scenes[0].heading).equal('2.1');
    });

    it('should load scenes', () => {
        should(screenPlay.acts[0].scenes).lengthOf(2)
        should(screenPlay.acts[1].scenes).lengthOf(1)
    });

    it('should put lines into scenes', () => {
        should(scene1.lines).lengthOf(14);
    });

    it('should extract character definitions', () => {
        const definition1 = scene1.actions[0] as CharacterDescription;
        const definition2 = scene1.actions[1] as CharacterDescription;
        should(definition1.name).equal('SAMPSON')
        should(definition2.name).equal('GREGORY')
    });

    it('should load attributes', () => {
        const definition1 = scene1.actions[0] as CharacterDescription;
        should(definition1.attributes).lengthOf(2);
    });

    it('should reference entities in properties', () => {
        const definition1 = scene1.actions[0] as CharacterDescription;
        const references = definition1.attributes[1].references;
        should(references).lengthOf(2);
        should(references[0].element.name).equals('SWORD');
        should(references[1].element.name).equals('BUCKLER');
    });
});