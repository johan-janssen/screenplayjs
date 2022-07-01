import { script as script1 } from './script1';
import { Description, PropSection, SceneSection, Screenplay, SetSection} from '../src/script/elements'
import { Loader } from '../src/script/loader';
import * as should from 'should';

describe("Loader with script1", () =>{
    let screenPlay: Screenplay = null;
    let scene1: SceneSection = null;

    before(() => {
        const loader = new Loader();
        screenPlay = loader.Load(script1)
        console.log(screenPlay);
        scene1 = screenPlay.GetChildren(SceneSection)[0];
    });

    it("should load top level elements", () =>{
        should(screenPlay.GetChildren(SetSection, SceneSection, PropSection)).lengthOf(5);
    });

    it("should extract scene names", () =>{
        should(screenPlay.GetChildren(SceneSection)[0].heading).equal('VERONA');
        should(screenPlay.GetChildren(SceneSection)[1].heading).equal('VERONA - somewhere else');
        should(screenPlay.GetChildren(SceneSection)[2].heading).equal('WHERE');
    });

    it('should load scenes', () => {
        should(screenPlay.GetChildren(SceneSection)).lengthOf(3)
    });

    it('should put lines into scenes', () => {
        should(scene1.lines).lengthOf(14);
    });

    it('should extract character definitions', () => {
        const definition1 = scene1.GetChildren(Description)[0];
        const definition2 = scene1.GetChildren(Description)[1];
        should(definition1.name).equal('SAMPSON')
        should(definition2.name).equal('GREGORY')
    });

    it('should load attributes', () => {
        const definition1 = scene1.GetChildren(Description)[0];
        should(definition1.attributes).lengthOf(2);
    });

    it('should reference entities in properties', () => {
        const definition1 = scene1.GetChildren(Description)[0];
        const references = definition1.attributes[1].references;
        should(references).lengthOf(2);
        should(references[0].element.name).equals('SWORD');
        should(references[1].element.name).equals('BUCKLER');
    });
});