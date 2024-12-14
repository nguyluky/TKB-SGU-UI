import classNames from 'classnames/bind';
import style from './Background.module.scss';

const cx = classNames.bind(style);

export default function Background({ children }: { children?: React.ReactNode }) {
    return (
        <div className={cx('wrapper')}>
            <div id={cx('scene')}>
                <div className={cx('sky')}>
                    <div className={cx('stars', 'layer')} data-depth="0.3">
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                        <div className={cx('star')} />
                    </div>
                </div>
                <div className={cx('container')}>
                    <div className={cx('top', 'layer')} data-depth="0.1">
                        <div className={cx('light-house')}>
                            <div className={cx('top-triangle')}>
                                <div className={cx('top-triangle-circle-top')} />
                                <div className={cx('top-triangle-circle-middle')} />
                                <div className={cx('top-triangle-circle')} />
                                <div className={cx('glow layer')} data-depth="0.01" />
                                <div className={cx('shining-lights-container')}>
                                    <div className={cx('shining-light-left')} />
                                    <div className={cx('shining-light-right')} />
                                </div>
                                <div className={cx('top-ledge')} />
                                <div className={cx('top-bars')}>
                                    <div className={cx('top-bar-1', 'topbar')} />
                                    <div className={cx('top-bar-2', 'topbar')} />
                                    <div className={cx('top-bar-3', 'topbar')} />
                                    <div className={cx('top-bar-4', 'topbar')} />
                                    <div className={cx('top-bar-5', 'topbar')} />
                                    <div className={cx('top-bar-6', 'topbar')} />
                                </div>
                                <div className={cx('top-railings')}>
                                    <div className={cx('top-railing-1', 'railing')} />
                                    <div className={cx('top-railing-2', 'railing')} />
                                    <div className={cx('top-railing-3', 'railing')} />
                                    <div className={cx('top-railing-4', 'railing')} />
                                    <div className={cx('top-railing-5', 'railing')} />
                                    <div className={cx('top-railing-6', 'railing')} />
                                </div>
                                <div className={cx('mid-ledge')} />
                                <div className={cx('mid-railings')}>
                                    <div className={cx('overlay')} />
                                    <div className={cx('mid-railings-rail')}>
                                        <div className={cx('mid-rail', 'mid-rail-1')} />
                                        <div className={cx('mid-rail', 'mid-rail-2')} />
                                        <div className={cx('mid-rail', 'mid-rail-3')} />
                                        <div className={cx('mid-rail', 'mid-rail-5')} />
                                        <div className={cx('mid-rail', 'mid-rail-6')} />
                                    </div>
                                    <div className={cx('left-mid-railings')} />
                                    <div className={cx('right-mid-railings')} />
                                </div>
                            </div>
                            <div className={cx('panel-container')} id={cx('rotate-x')}>
                                <div className={cx('left-mid-roof')} />
                                <div className={cx('left-mid-roof-2')} />
                                <div className={cx('panel')} />
                            </div>
                            <div className={cx('light')} />
                            <div className={cx('right-attachment')}>
                                <div className={cx('right-roof')} />
                                <div className={cx('right-building')} />
                            </div>
                            <div className={cx('lighthouse-lights')}>
                                <div className={cx('light-right-top', 'light')} />
                                <div className={cx('light-left-middle', 'light')} />
                            </div>
                            <div className={cx('lighthouse-bottom-lights')}>
                                <div className={cx('light-right-bottom', 'light')} />
                                <div className={cx('light-left-bottom', 'light')} />
                            </div>
                            <div className={cx('back-rocks')}>
                                <div className={cx('back-rock-1')} />
                                <div className={cx('back-rock-2')} />
                                <div className={cx('back-rock-3')} />
                            </div>
                            <div className={cx('front-rocks')}>
                                <div className={cx('front-rock-1')} />
                                <div className={cx('satellite')} />
                                <div className={cx('front-rock-2')} />
                                <div className={cx('front-rock-3')} />
                            </div>
                            <div className={cx('shooting-stars')} />
                            <div className={cx('glow-shine-container', 'layer')} data-depth="0.1">
                                <div className={cx('glow-shine-5', 'shine-circle')} />
                                <div className={cx('glow-shine-4', 'shine-circle')} />
                                <div className={cx('glow-shine-3', 'shine-circle')} />
                                <div className={cx('glow-shine-1', 'shine-circle')} />
                                <div className={cx('glow-shine-2', 'shine-circle')} />
                            </div>
                        </div>
                    </div>
                    <div className={cx('bottom')}>
                        <div className={cx('ocean')}>
                            <div className={cx('top-tier-1', 'ocean-layer')} />
                            <div className={cx('top-tier-2', 'ocean-layer')} />
                            <div className={cx('top-tier-3', 'ocean-layer')} />
                            <div className={cx('top-tier-4', 'ocean-layer')} />
                            <div className={cx('top-tier-5', 'ocean-layer')} />
                        </div>
                    </div>
                </div>
            </div>
            <div id={cx('made-by-cameron')}>
                <div className={cx('made-by-author')}>
                    Made by{' '}
                    <a href="https://cameronfitzwilliam.com" target="_BLANK">
                        Cameron Fitzwilliam
                    </a>
                </div>
            </div>
            <div className={cx('container')}>{children}</div>
        </div>
    );
}
