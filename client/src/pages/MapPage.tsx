import MapView from '../components/MapView/MapView.tsx';
import ControlPanel from '../components/ControlPanel/ControlPanel.tsx';
import '../styles/MapPage.scss';
import SearchBar from '../components/SearchBar/SearchBar.tsx';

const MapPage = () => {
    return (
        <div className='map-page'>
            <MapView />
            <ControlPanel />
            <SearchBar />
        </div>
    );
};

export default MapPage;
