
import {
    useState,
} from 'react';


export default function useSelection() {

    const [selection, setSelection] = useState<string[]>([]);

    const addSelection = (idToHoc: string) => {
        if (selection.includes(idToHoc)) return;
        setSelection([idToHoc, ...selection]);
    }

    const removeSelection = (idToHoc: string) => {
        if (!selection.includes(idToHoc)) return;
        selection.splice(selection.indexOf(idToHoc), 1);
        setSelection([...selection])
    }

    const clear = () => {
        setSelection([])
    }

    const toggle = (idToHoc: string) => {
        if (selection.includes(idToHoc)) {
            removeSelection(idToHoc);
        }
        else {
            addSelection(idToHoc)
        }
    }

    const select = (idToHoc:string) => {
        setSelection([idToHoc]);
    }

    const addAll = (idToHocs: string[]) => {
        setSelection(idToHocs);
    }

    return {
        selection,
        addSelection,
        removeSelection,
        clear,
        toggle,
        select,
        addAll
    }
}