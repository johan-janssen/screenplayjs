import { script as script1 } from './script1';
import { CharacterDescription, Loader, SceneDefinition, ScreenPlay } from '../loader'

describe("Loader with script1", () =>{
    let screenPlay: ScreenPlay = null;
    let scene1: SceneDefinition = null;

    beforeAll(() => {
        const loader = new Loader();
        screenPlay = loader.Load(script1)
        console.log(screenPlay);
        scene1 = screenPlay.acts[0].scenes[0];
    });

    it("should load top level elements", () =>{
        expect(screenPlay.acts).toHaveSize(2);
        expect(screenPlay.sets).toHaveSize(1);
    });

    it("should extract act names", () =>{
        expect(screenPlay.acts[0].name).toBe('1');
        expect(screenPlay.acts[1].name).toBe('2');
    });

    it("should extract scene names", () =>{
        expect(screenPlay.acts[0].scenes[0].name).toBe('1');
        expect(screenPlay.acts[0].scenes[1].name).toBe('2');
        expect(screenPlay.acts[1].scenes[0].name).toBe('2.1');
    });

    it('should load scenes', () => {
        expect(screenPlay.acts[0].scenes).toHaveSize(2)
        expect(screenPlay.acts[1].scenes).toHaveSize(1)
    });

    it('should put lines into scenes', () => {
        expect(scene1.lines.length).toBe(14);
    });

    it('should extract character definitions', () => {
        const definition1 = scene1.actions[0] as CharacterDescription;
        const definition2 = scene1.actions[1] as CharacterDescription;
        expect(definition1.name).toBe('SAMPSON')
        expect(definition2.name).toBe('GREGORY')
    });
});