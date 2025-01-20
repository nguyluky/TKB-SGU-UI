import { useHotkeys } from 'react-hotkeys-hook';
import useCommand from './useCommand';
import useSelection from './useSelection';
import useTkbHandler from './useTkbHandler';

export type useTkbHandlerTypes = ReturnType<typeof useTkbHandler>;
export type useCommandTypes = ReturnType<typeof useCommand>['commands'];
export type useSelectionTypes = ReturnType<typeof useSelection>;

export function UseShortCut(commands: useCommandTypes, tkbHandler: useTkbHandlerTypes, selection: useSelectionTypes) {
    useHotkeys(
        'ctrl+z',
        () => {
            const command = commands('undo');
            if (command) command();
        },
        [commands]
    );

    useHotkeys(
        'ctrl+y',
        () => {
            const command = commands('redo');
            if (command) command();
        },
        [commands]
    );

    useHotkeys(
        'ctrl+a',
        () => {
            selection.addAll(tkbHandler.id_to_hocs);
        },
        [selection, tkbHandler.id_to_hocs]
    );

    useHotkeys(
        'Escape',
        () => {
            console.log('okkkk');
            if (selection) selection.clear();
        },
        [selection]
    );

    useHotkeys(
        'Delete',
        () => {
            if (!selection.selection) return;
            [...selection.selection].forEach((e) => {
                tkbHandler.onRemoveNhomHocHandler(e);
            });
            selection.clear();
        },
        [selection, tkbHandler]
    );

    // updateHeader
}
