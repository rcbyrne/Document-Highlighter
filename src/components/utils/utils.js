let idCounter = 0;

export const colors = ['#66CDAA','#0000CD','#BA55D3','#9370DB','#3CB371','#7B68EE','#00FA9A','#48D1CC','#C71585','#191970','#F5FFFA','#FFE4E1','#FFE4B5','#FFDEAD','#000080','#FDF5E6','#808000','#6B8E23','#FFA500','#FF4500','#DA70D6','#EEE8AA','#98FB98','#AFEEEE','#DB7093','#FFEFD5','#FFDAB9','#CD853F','#FFC0CB','#DDA0DD','#B0E0E6','#800080','#663399','#FF0000','#BC8F8F','#4169E1','#8B4513','#FA8072','#F4A460','#2E8B57','#FFF5EE','#A0522D','#C0C0C0','#87CEEB','#6A5ACD','#708090'];

export function createBlock(text, start, end, highlights = []){
    
    idCounter++;

    return {
        id: idCounter,
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

export function getNextColour(index){    
    const length = colors.length;

    if(index >= length) {
        return getNextColour(index - length)
    } else {
        return colors[index]
    }
}