import {createBlock} from '../utils';

it('Creates new Block', () => {

    const text = "the quick brown fox jumped over the lazy dog";
    const block = createBlock(text, 0, text.length);

    block.id = 1;

    expect(block).toEqual({
        id: 1,
        text: text,
        range: { 
            start: 0,
            end: text.length
        },
        highlights: []
    });
})