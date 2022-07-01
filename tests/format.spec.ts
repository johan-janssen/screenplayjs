import { ScreenplayFormat } from '../src/script/format';
import * as should from 'should';

describe("Extracting text from screenplay format", () =>{
    const format = new ScreenplayFormat();
    before(() => {
        
    });

    it("format matches scene heading", () =>{
        should(format.sceneHeader.exec('EXT. Location - some more info - and this').groups.heading).eql('Location - some more info - and this');
        should(format.sceneHeader.exec('INT. Location - some more info - and this').groups.heading).eql('Location - some more info - and this');
        should(format.sceneHeader.exec('  INT. Location - some more info - and this').groups.heading).eql('Location - some more info - and this');
    });

    it("matches dialogue", () =>{
        should(format.dialogue.exec('  Luke, I am your father').groups.line).eql('Luke, I am your father');
        should(format.dialogue.exec('\t\tLuke, I am your father').groups.line).eql('Luke, I am your father');
    });

    it("matches character que", () =>{
        should(format.characterCue.exec('  LUKE').groups.name).eql('LUKE');
        should(format.characterCue.exec('\tVADER').groups.name).eql('VADER');
        should(format.characterCue.exec('  OBI WAN (V.O.)').groups.extension).eql('V.O.');
        should(format.characterCue.exec('  OBI WAN (V.O.)').groups.name).eql('OBI WAN');
    });

    it("matches parenthical que", () =>{
        should(format.parenthical.exec('  (shrugs)').groups.line).eql('shrugs');
        should(format.parenthical.exec('\t(looks for exit)').groups.line).eql('looks for exit');
    });

    it("matches action line", () =>{
        should(format.action.exec('Waves hands at stormtrooper').groups.line).eql('Waves hands at stormtrooper');
        should(format.action.exec(' action lines do not start with whitespaces')).Null();
    });

    it("matches transition line", () =>{
        should(format.transition.exec('FADE IN:').groups.line).eql('FADE IN');
        should(format.action.exec(' FADE IN:')).Null();
    });
});