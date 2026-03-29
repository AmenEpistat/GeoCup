export const CONFIDENCE_COLOR = (score: number): [number, number, number, number] => {
    if (score >= 0.8) return [0, 200, 100, 210];
    if (score >= 0.5) return [255, 200, 0, 210];
    return [150, 150, 150, 210];
};

export const DENSITY_COLOR = (score: number): [number, number, number, number] => {
    if (score >= 0.7) return [220, 50, 50, 210];
    if (score >= 0.4) return [255, 165, 0, 210];
    return [80, 140, 220, 210];
};

export const ECO_RISK_COLOR = (level: string): [number, number, number, number] => {
    if (level === 'high') return [220, 50, 50, 210];
    if (level === 'medium') return [255, 165, 0, 210];
    return [0, 200, 100, 210];
};

export const LAYERS = [
    { id: 'confidence', label: 'Уверенность' },
    { id: 'density', label: 'Плотность' },
    { id: 'eco_risk', label: 'Эко риск' },
] as const;

export const LEGENDS = {
    confidence: [
        { color: '#00c864', label: 'Высокая ≥ 0.8' },
        { color: '#ffc800', label: 'Средняя ≥ 0.5' },
        { color: '#969696', label: 'Низкая / ML' },
    ],
    density: [
        { color: '#dc3232', label: 'Очень плотно ≥ 0.7' },
        { color: '#ffa500', label: 'Средняя ≥ 0.4' },
        { color: '#508cdc', label: 'Разреженно' },
    ],
    eco_risk: [
        { color: '#dc3232', label: 'Высокий риск' },
        { color: '#ffa500', label: 'Средний риск' },
        { color: '#00c864', label: 'Низкий риск' },
    ],
};