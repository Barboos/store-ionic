import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonList, IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Game';
import { getLogger } from '../core';
import { ItemContext } from './GameProvider';

const log = getLogger('GameList');

const GameList: React.FC<RouteComponentProps> = ({ history }) => {
    const { items, fetching, fetchingError } = useContext(ItemContext);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Games</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching items" />
                {items && (
                    <IonList>
                        {items.map(({ id, title, description, price}) =>
                            <Item
                                key={id}
                                id={id}
                                title={title}
                                description={description}
                                price={price}
                                onEdit={(id) => history.push(`/item/${id}`)}
                            />)}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push("/item")}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default GameList;
