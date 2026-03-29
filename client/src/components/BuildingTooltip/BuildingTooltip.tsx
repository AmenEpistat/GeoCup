import { observer } from 'mobx-react-lite';
import { mapStore } from '../../stores/mapStore.ts';
import styles from './BuildingTooltip.module.scss';
import { getInsight } from '../../utils/insights.ts';
import { MATCH_LABEL } from '../../constants/match.ts';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const BuildingTooltip = observer(() => {
    const feature = mapStore.selectedBuilding;
    if (!feature) return null;

    const p = feature.properties ?? {};
    const insight = getInsight(p);

    return (
        <div className={styles['building-tooltip']}>
            <Button
                className={styles['building-tooltip__close']}
                onClick={() => mapStore.setSelectedBuilding(null)}
            >
                <CloseOutlined />
            </Button>

            <div className={styles['building-tooltip__title']}>Здание</div>

            <div className={styles['building-tooltip__rows']}>
                <p className={styles['building-tooltip__row']}>
                    <span>Высота</span>
                    <span>
                        {p.height_final_full != null
                            ? `${Number(p.height_final_full).toFixed(1)} м`
                            : '—'}
                    </span>
                </p>
                <p className={styles['building-tooltip__row']}>
                    <span>Уверенность</span>
                    <span>
                        {p.confidence_score != null
                            ? `${(p.confidence_score * 100).toFixed(0)}%`
                            : '—'}
                    </span>
                </p>
                <p className={styles['building-tooltip__row']}>
                    <span>Плотность</span>
                    <span>
                        {p.dense_score != null
                            ? `${(p.dense_score * 100).toFixed(0)}%`
                            : '—'}
                    </span>
                </p>
                <p className={styles['building-tooltip__row']}>
                    <span>Совпадение</span>
                    <span>
                        {MATCH_LABEL[p.match_type] ?? p.match_type ?? '—'}
                    </span>
                </p>
                <p className={styles['building-tooltip__row']}>
                    <span>Риск покрытия</span>
                    <span className={styles[p.eco_risk_level ?? 'medium']}>
                        {p.eco_risk_level ?? '—'}
                    </span>
                </p>
            </div>

            <div
                className={`${styles['building-tooltip__insight']} ${styles[`building-tooltip__insight--${insight.level}`]}`}
            >
                <div className={styles['building-tooltip__insight-title']}>
                    {insight.title}
                </div>
                <div className={styles['building-tooltip__insight-text']}>
                    {insight.text}
                </div>
            </div>
        </div>
    );
});

export default BuildingTooltip;
