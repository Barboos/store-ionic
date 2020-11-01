import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, IonList } from '@ionic/react';
import React, { useState } from 'react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { useItems } from './useItems';

const log = getLogger('ItemList');

const ItemList: React.FC = () => {
    const { items, addItem } = useItems();
    log('ItemList render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Game store</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {items.map(({ id, title, description, price}) =>
                    <Item key={id} title={title} description={description} price={price}/>)}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={addItem}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default ItemList;
