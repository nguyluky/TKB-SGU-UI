import { useNavigation, useParams, Outlet } from 'react-router-dom';
import TopBar from '~/components/TopBar';
import Loading from '~/components/Loading/Loading';
import { useContext } from 'react';
import { globalContext } from '~/store/GlobalStore';

function MainLayout() {
    const navigation = useNavigation();
    const [state, dispath] = useContext(globalContext);

    return (
        <>
            <TopBar {...state.topbar} />
            {navigation.state === 'idle' ? (
                <Outlet />
            ) : (
                <div
                    style={{
                        height: 'calc(100% - 55px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Loading />
                </div>
            )}
        </>
    );
}

export default MainLayout;
