import { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './MapView.module.scss';
import { mapStore } from '../../stores/mapStore';
import { useMapLayers } from '../../hooks/useMapLayers';
import BuildingTooltip from '../BuildingTooltip/BuildingTooltip';
import { INITIAL_VIEW } from '../../constants/view.ts';

const MapView = observer(() => {
    const [viewState, setViewState] = useState(INITIAL_VIEW);

    useEffect(() => {
        setViewState((prev) => ({
            ...prev,
            pitch: mapStore.targetPitch,
            transitionDuration: 800,
        }));
    }, [mapStore.targetPitch]);

    useEffect(() => {
        if (!mapStore.flyToTarget || mapStore.flyToTarget.longitude === 0)
            return;

        setViewState((prev) => ({
            ...prev,
            ...mapStore.flyToTarget,
            pitch: mapStore.mode === '3d' ? 45 : 0,
            transitionDuration: 1000,
        }));

        setTimeout(() => {
            mapStore.flyTo(null);
        }, 0);
    }, [mapStore.flyToTarget]);

    const handleHover = useCallback(({ object, x, y }: any) => {
        mapStore.setHoveredBuilding(object ? { feature: object, x, y } : null);
    }, []);

    const handleClick = useCallback(({ object }: any) => {
        mapStore.setSelectedBuilding(object ?? null);
    }, []);

    const layers = useMapLayers(
        handleHover,
        handleClick,
        mapStore.heightRange,
        mapStore.activeLayer,
        mapStore.mode
    );

    return (
        <div className={styles['map']}>
            <DeckGL
                viewState={viewState}
                onViewStateChange={({ viewState }: any) =>
                    setViewState(viewState)
                }
                controller={true}
                layers={layers}
            >
                <Map mapStyle='https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' />
            </DeckGL>
            {mapStore.selectedBuilding && <BuildingTooltip />}
        </div>
    );
});

export default MapView;
