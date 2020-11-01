import { useState } from 'react';
import { getLogger } from '../core';

const log = getLogger('useItems');

export interface ItemProps {
    id?: string;
    title: string;
    description: string;
    price: string;
}

export interface ItemsProps {
    items: ItemProps[],
    addItem: () => void,
}

export const useItems: () => ItemsProps = () => {
    const [items, setItems] = useState([
        {id: "1", title: "Game 1", description: "Description 1", price: "11.5"},
        {id: "2", title: "Game 2", description: "Description 2", price: "11.5"},
        {id: "3", title: "Game 3", description: "Description 3", price: "11.5"},
        {id: "4", title: "Game 4", description: "Description 4", price: "11.5"}
    ]);
    const addItem = () => {
        const id = `${items.length + 1}`;
        log('addItem');
        setItems(items.concat({ id, title: `Game ${id}`, description: `Description ${id}`, price: `11.5` }));
    };
    log('returns');
    return {
        items,
        addItem,
    };
};