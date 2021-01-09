import React, {useContext, useEffect, useState} from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import { createAnimation} from '@ionic/react';
import {
    IonActionSheet,
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
import {add, camera, close, trash, map} from 'ionicons/icons';
import Item from './Game';
import { getLogger } from '../core';
import { ItemContext } from './GameProvider';
import { AuthContext } from "../auth";
import {GameProps} from "./GameProps";
import {Photo,usePhotoGallery} from "../utils/usePhotoGallery";

const log = getLogger('GameList');

const GameList: React.FC<RouteComponentProps> = ({ history }) => {
    const { photos, takePhoto, deletePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();
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
            setGamesShow([...gamesShow, ...items.slice(perPage, 16 + perPage)]);
            setPerPage(perPage + 16);
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
            setGamesShow(items.filter((car) => car.title.startsWith(searchGames)).slice(0, 16));
        }
        else if(items){
            setGamesShow(items.slice(0, 16));
        }
    }, [searchGames, items]);

    useEffect(() => {
        if (filterGames && items) {
            if(filterGames === "Price <= 50")
                setGamesShow(gamesShow.filter((game) => Number(game.price) <= 50 ));
            else
                setGamesShow(gamesShow.filter((game) => Number(game.price) > 50 ));
        }
    }, [filterGames, gamesShow, items]);
    function simpleAnimation() {
        const el = document.querySelector(".title");
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction("alternate")
                .iterations(Infinity)
                .keyframes([
                    { offset: 0, transform: "scale(1)", opacity: "1" },
                    {
                        offset: 1,
                        transform: "scale(0.5)",
                        opacity: "0.5",
                    },
                ]);
            animation.play();
        }
    }

    function groupAnimations() {
        const elB = document.querySelector('.owner');
        const elC = document.querySelector('.version');
        if (elB && elC) {
            const animationA = createAnimation()
                .addElement(elB)
                .duration(5000)
                .keyframes([
                    { offset: 0, transform: 'scale(1))', opacity: '0.5' },
                    { offset: 0.5, transform: 'scale(0.8)', opacity: '1' },
                    { offset: 1, transform: 'scale(1)', opacity: '0.5' }
                ]);
            const animationB = createAnimation()
                .addElement(elC)
                .keyframes([
                    { offset: 0, transform: 'scale(1) rotate(0)' },
                    { offset: 0.5, transform: 'scale(1.2) rotate(45deg)' },
                    { offset: 1, transform: 'scale(1) rotate(45deg)' }
                ]);
            const parentAnimation = createAnimation()
                .duration(1000)
                .iterations(Infinity)
                .addAnimation([animationA, animationB]);
            parentAnimation.play();    }
    }

    useEffect(simpleAnimation, []);
    useEffect(groupAnimations, []);
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <div className="title">
                        <IonTitle>Games</IonTitle>
                    </div>
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
                <IonFab vertical="bottom" horizontal="start" slot="fixed">
                    <IonFabButton
                        onClick={() => {
                            history.push("/game/map");
                        }}
                    >
                        <IonIcon icon={map} />
                    </IonFabButton>
                </IonFab>
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={() => takePhoto()}>
                        <IonIcon icon={camera} />
                    </IonFabButton>
                </IonFab>
                <IonActionSheet
                    isOpen={!!photoToDelete}
                    buttons={[
                        {
                            text: "Delete",
                            role: "destructive",
                            icon: trash,
                            handler: () => {
                                if (photoToDelete) {
                                    deletePhoto(photoToDelete);
                                    setPhotoToDelete(undefined);
                                }
                            },
                        },
                        {
                            text: "Cancel",
                            icon: close,
                            role: "cancel",
                        },
                    ]}
                    onDidDismiss={() => setPhotoToDelete(undefined)}
                />
            </IonContent>
            <div className="owner" >
                <p>Made by Andrei Craiu</p>
            </div>
            <div className="version">
                <p>Version 1.0</p>
            </div>
        </IonPage>
    );
};

export default GameList;
