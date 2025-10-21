export const randomColorOKLCH = () => 
{
    const L = Math.random() * 0.3 + 0.5; // lightness 50–80 %
    const C = Math.random() * 0.2 + 0.1; // chroma 10–30 %
    const H = Math.random() * 360;       // hue 0–360°
    return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(2)})`;
}