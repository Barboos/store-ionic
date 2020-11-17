import React, {useContext, useEffect, useState} from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonSearchbar,
    IonList, IonLoading,
    IonPage,
    IonTitle,
    IonToolbar, IonButton, IonSelect, IonSelectOption, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/react';
import {add, filter} from 'ionicons/icons';
import Item from './Game';
import { getLogger } from '../core';
import { ItemContext } from './GameProvider';
import { AuthContext } from "../auth";
import {GameProps} from "./GameProps";

const log = getLogger('GameList');

const GameList: React.FC<RouteComponentProps> = ({ history }) => {
    const { items, fetching, fetchingError } = useContext(ItemContext);
    const [searchGames, setSearchGame] = useState<string>('');
    const [gamesShow, setGamesShow] = useState<GameProps[]>([]);
    const [filterGames, setFilterGames] = useState<string | undefined>(undefined);
    const selectOptions = ["Price <= 50", "Price > 50"];
    const [perPage, setPerPage] = useState(16);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(
        false
    );
    log('render');
    async function searchNext($event: CustomEvent<void>) {
        if (items && perPage < items.length) {
            setGamesShow([...gamesShow, ...items.slice(perPage, 17 + perPage)]);
            setPerPage(perPage + 17);
        } else {
            setDisableInfiniteScroll(true);
        }
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }
    const { logout } = useContext(AuthContext);
    const handleLogout = () => {
        logout?.();
        return <Redirect to={{ pathname: "/login" }} />;
    };

    useEffect(() => {
        if (items?.length) {
            setGamesShow(items.slice(0, 16));
        }
    }, [items]);
    useEffect(() => {
        if (searchGames && items) {
            setGamesShow(items.filter((car) => car.title.startsWith(searchGames)));
        }
    }, [searchGames]);

    useEffect(() => {
        if (filterGames && items) {
            if(filterGames === "Price <= 50")
                setGamesShow(gamesShow.filter((game) => Number(game.price) <= 50 ));
            else
                setGamesShow(gamesShow.filter((game) => Number(game.price) > 50 ));
        }
    }, [filterGames]);
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Games</IonTitle>
                    <IonButton onClick={handleLogout}>Logout</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching items" />
                <IonSearchbar
                    value={searchGames}
                    debounce={1000}
                    onIonChange={e => setSearchGame(e.detail.value!)}>
                </IonSearchbar>
                <IonSelect
                    value={filterGames}
                    placeholder="Filter by price"
                    onIonChange={(e) => setFilterGames(e.detail.value)}
                >
                    {selectOptions.map((option) => (
                        <IonSelectOption key={option} value={option}>
                            {option}
                        </IonSelectOption>
                    ))}
                </IonSelect>
                {gamesShow && (
                    <IonList>
                        {/*.filter(game => game.indexOf(searchGames) >= 0)*/}
                        {gamesShow
                            .map(({ _id, title, description, price}) =>
                            <Item
                                key={_id}
                                _id={_id}
                                title={title}
                                description={description}
                                price={price}
                                onEdit={(id) => history.push(`/game/${_id}`)}
                            />)}
                    </IonList>
                )}
                <IonInfiniteScroll
                    threshold="100px"
                    disabled={disableInfiniteScroll}
                    onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
                >
                    <IonInfiniteScrollContent loadingText="Loading..."></IonInfiniteScrollContent>
                </IonInfiniteScroll>
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push("/game")}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default GameList;
