import axios from 'axios';
import {authConfig, baseUrl, getLogger, withLogs} from '../core';
import { GameProps } from './GameProps';

const itemUrl = `http://${baseUrl}/api/game`;


export const getItems: (token: string) => Promise<GameProps[]> = token => {
    return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
}

export const createItem: (token: string, item: GameProps) => Promise<GameProps[]> = (token, item) => {
    console.log(item);
    return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem');
}

export const updateItem: (token: string, item: GameProps) => Promise<GameProps[]> = (token, item) => {
    return withLogs(axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)), 'updateItem');
}

interface MessageData {
    type: string;
    payload: GameProps;
}

const log = getLogger('ws');


export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}
