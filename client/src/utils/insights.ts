import type { Build } from '../types/build.ts';

interface Insight {
    title: string;
    text: string;
    level: 'danger' | 'warning' | 'good';
}

export function getInsight(p: Build): Insight {
    const dense = p.dense_score ?? 0;
    const confidence = p.confidence_score ?? 0;
    const risk = p.eco_risk_level ?? 'medium';

    if (dense >= 0.7) {
        return {
            level: 'danger',
            title: 'Критическая плотность',
            text: 'Высокий риск интерференции и затухания 5G. Рекомендуется архитектура Small Cells для компенсации потерь в каньонах',
        };
    }

    if (confidence < 0.3) {
        return {
            level: 'warning',
            title: 'Низкая уверенность в данных',
            text: 'Геометрия объекта интерполирована. Требуется верификация перед планированием БС.',
        };
    }

    if (risk === 'high') {
        return {
            level: 'danger',
            title: 'Риск покрытия высокий',
            text: 'Зона теплового острова. Рекомендация: сократить интервал чистки систем охлаждения БС из-за застоя воздуха и пыли.',
        };
    }

    if (risk === 'medium' || dense >= 0.4) {
        return {
            level: 'warning',
            title: 'Умеренная зона',
            text: 'Возможно перекрытие сигнала. Рекомендация: оптимизация механического наклона (tilt) антенн для минимизации зон тени.',
        };
    }

    return {
        level: 'good',
        title: 'Зона с хорошим покрытием',
        text: 'Разреженная застройка. Идеально для размещения Macro-позиций с широким радиусом обслуживания.',
    };
}
