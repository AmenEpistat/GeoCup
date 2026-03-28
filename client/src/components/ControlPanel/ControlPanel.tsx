import { observer } from 'mobx-react-lite';
import { mapStore } from '../../stores/mapStore.ts';
import styles from './ControlPanel.module.scss';
import { LAYERS, LEGENDS } from '../../constants/colors.ts';
import { useState } from 'react';
import { Button, Slider } from 'antd';
import { CloseOutlined, RightOutlined } from '@ant-design/icons';

const ControlPanel = observer(() => {
    const [min, max] = mapStore.heightRange;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                className={`${styles.menuBtn} ${isOpen ? styles.hidden : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <RightOutlined />
            </Button>
            <div
                className={`${styles['control-panel']} ${isOpen ? styles['control-panel--open'] : ''}`}
            >
                <div className={styles['control-panel__header']}>
                    <div className={styles['control-panel__logo']}>
                        <img
                            src={'/icons/MTC_Logo_RGB.svg'}
                            alt='MTC Logo'
                            width='40px'
                        />
                        <span>СПб высотность</span>
                    </div>
                    <Button
                        className={styles['control-panel__close']}
                        onClick={() => setIsOpen(false)}
                    >
                        <CloseOutlined />
                    </Button>
                </div>

                <div className={styles['control-panel__section']}>
                    <p className={styles['control-panel__label']}>
                        Режим карты
                    </p>
                    <div className={styles['control-panel__toggle']}>
                        {(['3d', 'flat'] as const).map((m) => (
                            <Button
                                key={m}
                                className={`${styles['control-panel__toggle-btn']} ${mapStore.mode === m ? styles['control-panel__toggle-btn--active'] : ''}`}
                                onClick={() => mapStore.setMode(m)}
                            >
                                {m === '3d' ? '3D' : 'Плоская'}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className={styles['control-panel__section']}>
                    <p className={styles['control-panel__label']}>
                        Слой раскраски
                    </p>
                    <div className={styles['control-panel__layer']}>
                        {LAYERS.map((l) => (
                            <Button
                                key={l.id}
                                className={`${styles['control-panel__layer-btn']} ${mapStore.activeLayer === l.id ? styles['control-panel__layer-btn--active'] : ''}`}
                                onClick={() => mapStore.setActiveLayer(l.id)}
                            >
                                {l.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className={styles['control-panel__section']}>
                    <p className={styles['control-panel__label']}>
                        Высота зданий
                        <span className={styles['control-panel__range']}>
                            {min}–{max} м
                        </span>
                    </p>

                    <Slider
                        range
                        min={0}
                        max={200}
                        step={5}
                        value={[min, max]}
                        onChange={(value: any) => {
                            mapStore.setHeightRange(value);
                        }}
                    />

                    <div className={styles['control-panel__range-labels']}>
                        <span>0 м</span>
                        <span>200 м</span>
                    </div>
                </div>

                <div className={styles['control-panel__section']}>
                    <p className={styles['control-panel__label']}>Легенда</p>
                    <div className={styles['control-panel__legend']}>
                        {LEGENDS[mapStore.activeLayer].map((item) => (
                            <div
                                key={item.label}
                                className={styles['control-panel__legend-row']}
                            >
                                <span
                                    className={styles['control-panel__dot']}
                                    style={{ background: item.color }}
                                />
                                <div>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
});

export default ControlPanel;
