import notifyMaster from '../../components/NotifyPopup/NotificationManager';

function Test() {
    return (
        <div>
            <button onClick={() => notifyMaster.info('ok', 'ok', -1)}>info</button>
        </div>
    );
}

export default Test;
