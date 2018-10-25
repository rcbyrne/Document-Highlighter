export function createBlock(text, start, end, highlights){
    return {
        text,
        range: { start, end },
        highlights
    }
}

export function arraysEqual(a, b) {

    if (a.length !== b.length) return false;
  
    for (let i = 0; i < a.length; ++i) {
      if (!a.find(a => a.id === b[i].id)) return false;
    };

    return true;
  }