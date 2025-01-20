export {};

// import { cloneElement, createContext, Dispatch, MutableRefObject, ReactElement, ReactNode, useReducer } from 'react';
// import { createPortal } from 'react-dom';

// interface DriveElement {
//     element: MutableRefObject<HTMLElement>;
//     index: number;
//     title: string;
//     description: string;
//     side: 'left' | 'right';
//     align: 'top' | 'center' | 'bottom';
// }

// interface DriveContext {
//     elements: DriveElement[];
//     next: () => void;
//     prev: () => void;
//     goTo: (index: number) => void;
// }

// interface ActionType {
//     next: undefined;
//     prev: undefined;
//     goTo: number;
//     addElement: DriveElement;
// }

// interface Action<T extends keyof ActionType> {
//     type: T;
//     payload?: ActionType[T];
// }

// export default function createDrive() {
//     const driveContext = createContext<[DriveContext, Dispatch<Action<keyof ActionType>>]>(null!);

//     const reducer = (state: DriveContext, action: Action<keyof ActionType>) => {
//         switch (action.type) {
//             case 'next':
//                 // return state;
//                 break;
//             case 'prev':
//                 // return state;
//                 break;
//             case 'goTo':
//                 // return state;
//                 break;
//             case 'addElement':
//                 state.elements.push(action.payload as DriveElement);
//                 break;
//         }

//         return state;
//     };

//     const Steps = ({ children }: { children: ReactElement }) => {

//         return cloneElement(children, {});
//     };

//     const Wrapper = ({ children }: { children: ReactNode }) => {
//         const [state, dispatch] = useReducer(reducer, {
//             elements: [],
//             next: () => {},
//             prev: () => {},
//             goTo: () => {},
//         } as DriveContext);

//         return (
//             <>
//                 <driveContext.Provider value={[state, dispatch]}>{children}</driveContext.Provider>
//                 {createPortal(
//                     <div id="drive">
//                         <svg></svg>
//                         <div></div>
//                     </div>,
//                     document.body
//                 )}
//             </>
//         );
//     };

//     return {
//         Steps,
//         Wrapper,
//     };
// }
