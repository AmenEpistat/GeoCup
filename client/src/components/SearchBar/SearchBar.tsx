import styles from './SearchBar.module.scss';
import { SearchOutlined } from '@ant-design/icons';

import { useSearch } from './useSearch';

export default function SearchBar() {
    const {
        query,
        suggestions,
        loading,
        handleChange,
        handleSelect,
        handleClear,
    } = useSearch();

    return (
        <div className={styles['search']}>
            <div className={styles['search__wrap']}>
                <SearchOutlined style={{ color: 'white' }} />
                <input
                    className={styles['search__input']}
                    placeholder='Поиск улицы или здания...'
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                />
                {loading && <div className={styles['search__spinner']} />}
                {query && (
                    <button
                        className={styles['search__clear']}
                        onClick={handleClear}
                    >
                        ✕
                    </button>
                )}
            </div>

            {suggestions.length > 0 && (
                <div className={styles['search__dropdown']}>
                    {suggestions.map((s) => (
                        <button
                            key={s.place_id}
                            className={styles['search__suggestion']}
                            onClick={() => handleSelect(s)}
                        >
                            <svg
                                className={styles['search__pin']}
                                viewBox='0 0 16 16'
                                fill='none'
                            >
                                <path
                                    d='M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z'
                                    stroke='currentColor'
                                    strokeWidth='1.2'
                                />
                                <circle
                                    cx='8'
                                    cy='6'
                                    r='1.5'
                                    fill='currentColor'
                                />
                            </svg>
                            <div>
                                <div className={styles['search__sugg-name']}>
                                    {s.display_name.split(',')[0]}
                                </div>
                                <div className={styles['search__sugg-sub']}>
                                    {s.display_name
                                        .split(',')
                                        .slice(1, 3)
                                        .join(',')
                                        .trim()}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
