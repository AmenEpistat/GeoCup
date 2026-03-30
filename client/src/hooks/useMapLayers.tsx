import { useMemo, useRef, useEffect, useState } from 'react';
import { TileLayer } from '@deck.gl/geo-layers';
import { GeoJsonLayer } from '@deck.gl/layers';
import { PMTiles } from 'pmtiles';
import { load } from '@loaders.gl/core';
import { MVTLoader } from '@loaders.gl/mvt';
import {
    CONFIDENCE_COLOR,
    DENSITY_COLOR,
    ECO_RISK_COLOR,
} from '../constants/colors.ts';
import type { Build } from '../types/build.ts';

const DATA_URL = import.meta.env.VITE_PMTILES_URL ?? '/data/buildings.pmtiles';
const pmTiles = new PMTiles(DATA_URL);

function useElevationScale(mode: string) {
    const [scale, setScale] = useState(mode === '3d' ? 1 : 0);
    const rafRef = useRef<number>();
    const startRef = useRef<number>();

    useEffect(() => {
        const target = mode === '3d' ? 1 : 0;
        const from = scale;
        const duration = 800;

        const animate = (now: number) => {
            if (!startRef.current) startRef.current = now;
            const t = Math.min((now - startRef.current) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setScale(from + (target - from) * eased);
            if (t < 1) rafRef.current = requestAnimationFrame(animate);
            else startRef.current = undefined;
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            startRef.current = undefined;
        };
    }, [mode]);

    return scale;
}

export function useMapLayers(
    onHover: any,
    onClick: any,
    heightRange: [number, number],
    activeLayer: 'confidence' | 'density' | 'eco_risk',
    mode: '3d' | 'flat'
) {
    const elevationScale = useElevationScale(mode);
    const [hMin, hMax] = heightRange;

    const paramsRef = useRef({ hMin, hMax, activeLayer, mode, elevationScale });
    paramsRef.current = { hMin, hMax, activeLayer, mode, elevationScale };

    const renderKey = `${hMin}-${hMax}-${activeLayer}`;

    return useMemo(
        () => [
            new TileLayer({
                id: 'buildings',

                getTileData: async ({ index }: any) => {
                    const { x, y, z } = index;
                    const tile = await pmTiles.getZxy(z, x, y);
                    if (!tile?.data) return null;
                    return load(tile.data, MVTLoader, {
                        mvt: { coordinates: 'wgs84', tileIndex: { x, y, z } },
                    });
                },

                minZoom: 0,
                maxZoom: 14,
                tileSize: 512,
                pickable: true,
                onHover,
                onClick,

                renderSubLayers: (props: any) => {
                    if (!props.data) return null;

                    const { hMin, hMax, activeLayer, mode, elevationScale } =
                        paramsRef.current;

                    const features = Array.isArray(props.data)
                        ? props.data
                        : (props.data?.features ?? []);

                    const filtered = features.filter((f: any) => {
                        const h = f?.properties?.height_final_full ?? 0;
                        return h >= hMin && h <= hMax;
                    });

                    return new GeoJsonLayer({
                        ...props,
                        id: `${props.id}-${renderKey}`,
                        data: filtered,
                        extruded: mode === '3d',
                        getElevation: (f: any) =>
                            f.properties?.height_final_full ?? 0,
                        elevationScale,
                        material: {
                            ambient: 0.35,
                            diffuse: 0.6,
                            shininess: 32,
                        },
                        getFillColor: (f: any) => {
                            const p: Build = f.properties ?? {};
                            if (activeLayer === 'confidence')
                                return CONFIDENCE_COLOR(
                                    p.confidence_score ?? 0
                                );
                            if (activeLayer === 'eco_risk')
                                return ECO_RISK_COLOR(
                                    p.eco_risk_level ?? 'low'
                                );
                            return DENSITY_COLOR(p.dense_score ?? 0);
                        },

                        getLineColor: [255, 255, 255, 15] as number[],
                        lineWidthMinPixels: 0.5,
                        autoHighlight: true,
                        highlightColor: [255, 255, 255, 80] as number[],
                    });
                },

                updateTriggers: {
                    elevationScale: [elevationScale],
                    renderSubLayers: [renderKey],
                    extruded: [mode],
                },
            }),
        ],
        [renderKey, onHover, onClick]
    );
}
