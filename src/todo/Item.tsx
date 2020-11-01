import React from 'react';
import { ItemProps } from './useItems';

const Item: React.FC<ItemProps> = ({ id, title, description, price }) => {
    return (
        <div>{title}, {description}, {price}</div>
    );
};

export default Item;