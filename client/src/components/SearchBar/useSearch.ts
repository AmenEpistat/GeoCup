import { useState, useRef, useCallback } from 'react';
import { mapStore } from '../../stores/mapStore.ts';

export interface Suggestion {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export function useSearch() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    const search = useCallback((value: string) => {
        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    'https://nominatim.openstreetmap.org/search?' +
                        `q=${encodeURIComponent(value + ', Санкт-Петербург')}` +
                        '&format=json&limit=5&accept-language=ru' +
                        '&countrycodes=ru'
                );
                const data: Suggestion[] = await res.json();
                setSuggestions(data);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 600);
    }, []);

    const handleChange = (value: string) => {
        setQuery(value);
        search(value);
    };

    const handleSelect = (s: Suggestion) => {
        setQuery(s.display_name.split(',')[0]);
        setSuggestions([]);
        mapStore.flyTo({
            longitude: parseFloat(s.lon),
            latitude: parseFloat(s.lat),
            zoom: 15,
        });
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
    };

    return {
        query,
        suggestions,
        loading,
        handleChange,
        handleSelect,
        handleClear,
    };
}
