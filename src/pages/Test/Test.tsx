import { NotifyMaster } from '../../components/NotifyPopup';

function Test() {
    const handleAddErr = () => {
        NotifyMaster.error('test');
    };

    const handleAddInfo = () => {
        NotifyMaster.info('test');
    };

    const handleAddWar = () => {
        NotifyMaster.warning('test');
    };

    const handleAddSurr = () => {
        NotifyMaster.success('test');
    };

    return (
        <div>
            <button onClick={handleAddErr}>err</button>
            <button onClick={handleAddInfo}>info</button>
            <button onClick={handleAddWar}>warning</button>
            <button onClick={handleAddSurr}>success</button>
        </div>
    );
}

export default Test;
