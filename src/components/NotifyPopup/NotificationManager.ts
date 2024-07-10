import { EventEmitter } from 'events';
import { createRef, RefObject } from 'react';

const createUUID = () => {
    const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return pattern.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export enum NotifyType {
    CHANGE = 'change',
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
}

export interface NotifyItem {
    id: string;
    notifyType: NotifyType;
    title?: string;
    message?: string;
    timeOut?: number;
    onClick?: Function;
    priority?: boolean;
    nodeRef?: RefObject<HTMLDivElement>;
}

class NotifyMaster extends EventEmitter {
    listNotify: NotifyItem[];
    constructor() {
        super();
        this.listNotify = [];
    }

    create(notify: Omit<NotifyItem, 'id'>) {
        const defaultNotify: NotifyItem = {
            id: createUUID(),
            notifyType: NotifyType.INFO,
            title: undefined,
            message: undefined,
            timeOut: 3000,
            nodeRef: createRef()
        };
        if (!notify.priority) {
            this.listNotify.unshift({
                id: defaultNotify.id,
                notifyType: notify.notifyType || defaultNotify.notifyType,
                title: notify.title || defaultNotify.title,
                message: notify.message || defaultNotify.message,
                timeOut: notify.timeOut || defaultNotify.timeOut,
                onClick: notify.onClick,
                priority: notify.priority,
                nodeRef: defaultNotify.nodeRef,
            });
        } else {
            this.listNotify.push({
                id: defaultNotify.id,
                notifyType: notify.notifyType || defaultNotify.notifyType,
                title: notify.title || defaultNotify.title,
                message: notify.message || defaultNotify.message,
                timeOut: notify.timeOut || defaultNotify.timeOut,
                onClick: notify.onClick,
                priority: notify.priority,
                nodeRef: defaultNotify.nodeRef,
            });
        }

        this.emitChange();
    }

    info(message?: string, title?: string, timeOut?: number, onClick?: Function, priority?: boolean) {
        this.create({
            notifyType: NotifyType.INFO,
            message: message,
            title: title || 'info',
            timeOut: timeOut,
            onClick: onClick,
            priority: priority,
        });
    }

    success(message?: string, title?: string, timeOut?: number, onClick?: Function, priority?: boolean) {
        this.create({
            notifyType: NotifyType.SUCCESS,
            message: message,
            title: title || 'success',
            timeOut: timeOut,
            onClick: onClick,
            priority: priority,
        });
    }

    warning(message?: string, title?: string, timeOut?: number, onClick?: Function, priority?: boolean) {
        this.create({
            notifyType: NotifyType.WARNING,
            message: message,
            title: title || 'warning',
            timeOut: timeOut,
            onClick: onClick,
            priority: priority,
        });
    }

    error(message?: string, title?: string, timeOut?: number, onClick?: Function, priority?: boolean) {
        this.create({
            notifyType: NotifyType.ERROR,
            message: message,
            title: title || 'error',
            timeOut: timeOut,
            onClick: onClick,
            priority: priority,
        });
    }

    emitChange() {
        this.emit(NotifyType.CHANGE, this.listNotify);
    }

    remove(id: string) {
        this.listNotify = this.listNotify.filter((e) => e.id !== id);
        // console.log(this.listNotify, id);
        this.emitChange();
    }
}

const notifyMaster = new NotifyMaster();

export default notifyMaster;
