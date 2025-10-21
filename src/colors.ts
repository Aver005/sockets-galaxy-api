/**
 * Генерирует случайный цвет в формате OKLCH с приятными для глаз параметрами
 * 
 * @description Создает цвет с контролируемой яркостью (50-80%), умеренной насыщенностью (10-30%)
 * и случайным оттенком. Использует современное цветовое пространство OKLCH для более
 * перцептивно однородных цветов.
 * 
 * @returns {string} Строка цвета в формате "oklch(L C H)" где:
 *   - L (lightness): яркость от 0.500 до 0.800
 *   - C (chroma): насыщенность от 0.100 до 0.300  
 *   - H (hue): оттенок от 0 до 360 градусов
 * 
 * @example
 * ```typescript
 * const color = randomColorOKLCH();
 * // Возвращает: "oklch(0.650 0.150 245.67)"
 * ```
 */
export const randomColorOKLCH = (): string => 
{
    const L = Math.random() * 0.3 + 0.5; // lightness 50–80 %
    const C = Math.random() * 0.2 + 0.1; // chroma 10–30 %
    const H = Math.random() * 360;       // hue 0–360°
    return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(2)})`;
}