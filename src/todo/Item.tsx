import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';

const Item: React.FC<ItemProps> = ({ id, title, description, price }) => {
    return (
        <IonItem>
            <IonLabel>{title}, {description}, {price}</IonLabel>
        </IonItem>

    );
};

export default Item;