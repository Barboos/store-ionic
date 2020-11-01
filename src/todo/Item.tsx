import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
    onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, title, description, price, onEdit }) => {
    return (
        <IonItem onClick={() => onEdit(id)}>
            <IonLabel>{title}, {description}, {price}</IonLabel>
        </IonItem>
    );
};


export default Item;