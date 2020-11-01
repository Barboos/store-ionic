import React, { useContext, useEffect, useState } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const { items, saving, savingError, saveItem } = useContext(ItemContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [item, setItem] = useState<ItemProps>();
    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const item = items?.find(it => it.id === routeId);
        setItem(item);
        if (item) {
            setTitle(item.title);
            setDescription(item.description);
            setPrice(item.price);
        }
    }, [match.params.id, items]);
    const handleSave = () => {
        const editedItem = item ? { ...item, title, description, price } : { title, description, price };
        saveItem && saveItem(editedItem).then(() => history.goBack());
    };
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel>Title: </IonLabel>
                    <IonInput
                        value={title}
                        onIonChange={e => setTitle(e.detail.value || '')}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel>Description: </IonLabel>
                    <IonInput
                        value={description}
                        onIonChange={e => setDescription(e.detail.value || '')}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel>Price: </IonLabel>
                    <IonInput
                        value={price}
                        onIonChange={e => setPrice(e.detail.value || '')}
                    />
                </IonItem>
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ItemEdit;