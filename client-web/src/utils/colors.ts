export function* paletteGenerator(): Generator<string> { // Change generator type to string
    let i = 0
    while (true) {
        yield COLORS[i++]
        if (i === COLORS.length) {
            i = 0
        }
    }
}

const COLORS: string[] = [ // Change COLORS to string array
    '#FFFFFF', // White
    '#F0A3FF', // Amethyst
    '#0075DC', // Blue
    '#993F00', // Caramel
    '#4C005C', // Damson
    '#191919', // Ebony
    '#005C31', // Forest
    '#2BCE48', // Green
    '#FFCC99', // Honeydew
    '#808080', // Iron
    '#94FFB5', // Jade
    '#8F7C00', // Khaki
    '#9DCC00', // Lime
    '#C20088', // Mallow
    '#003380', // Navy
    '#FFA405', // Orpiment
    '#FFA8BB', // Pink
    '#426600', // Quagmire
    '#FF0010', // Red
    '#5EF1F2', // Sky
    '#00998F', // Turquoise
    '#E0FF66', // Uranium
    '#740AFF', // Violet
    '#990000', // Wine
    '#FFFF80', // Xanthin
    '#FFE100', // Yellow
    '#FF5005' // Zinnia
]
