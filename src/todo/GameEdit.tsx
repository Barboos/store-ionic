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
    IonLabel, createAnimation, IonModal,
    IonFab,
    IonFabButton,
    IonIcon,
    IonActionSheet,
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './GameProvider';
import { RouteComponentProps } from 'react-router';
import { GameProps } from './GameProps';
import { camera, trash, close } from "ionicons/icons";
import { Photo, usePhotoGallery } from "../utils/usePhotoGallery";
import { MyMap } from "../map/MyMap";
import { PhotoViewer } from "@ionic-native/photo-viewer";

const log = getLogger('GameEdit');

interface GameEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const GameEdit: React.FC<GameEditProps> = ({ history, match }) => {
    const { items, saving, savingError, saveItem } = useContext(ItemContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [item, setItem] = useState<GameProps>();
    const [photoPath, setPhotoPath] = useState("");
    const { photos, takePhoto, deletePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();
    const [latitude, setLatitude] = useState(46.7667);
    const [longitude, setLongitude] = useState(23.6000);
    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const item = items?.find(it => it._id === routeId);
        setItem(item);
        if (item) {
            setTitle(item.title);
            setDescription(item.description);
            setPrice(item.price);
            setPhotoPath(item.photoPath);
        }
    }, [match.params.id, items]);
    const handleSave = () => {
        const editedItem = item ? { ...item, title, description, price, photoPath, latitude, longitude } : { title, description, price, photoPath, latitude, longitude };
        console.log("aici este" + item);
        saveItem && saveItem(editedItem).then(() => history.goBack());
    };
    log('render');
    function chainAnimations() {
        const elB = document.querySelector('.owner');
        const elC = document.querySelector('.version');
        if (elB && elC) {
            const animationA = createAnimation()
                .addElement(elB)
                .duration(5000)
                .keyframes([
                    { offset: 0, transform: 'scale(1) rotate(0)' },
                    { offset: 0.5, transform: 'scale(1.2) rotate(45deg)' },
                    { offset: 1, transform: 'scale(1) rotate(0)' }
                ])
                .afterStyles({
                    'background': 'yellow'
                });

            const animationB = createAnimation()
                .addElement(elC)
                .duration(7000)
                .keyframes([
                    { offset: 0, transform: 'scale(1)', opacity: '1' },
                    { offset: 0.5, transform: 'scale(0.8)', opacity: '0.3' },
                    { offset: 1, transform: 'scale(1)', opacity: '1' }
                ])
                .afterStyles({
                    'background': 'green'
                });
            (async () => {
                await animationA.play();
                await animationB.play();
            })();
        }
    }
    useEffect(chainAnimations, []);
    const logoPath = "https://cdn.dribbble.com/users/158247/screenshots/1980647/g.jpg?compress=1&resize=800x600";
    const [showModal, setShowModal] = useState(false);

    const enterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' }
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }
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
                <img src={photoPath} />
                <MyMap
                    lat={latitude}
                    lng={longitude}
                    onMapClick={(location: any) => {
                        setLatitude(location.latLng.lat());
                        setLongitude(location.latLng.lng());
                    }}
                />
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton
                        onClick={() => {
                            const photoTaken = takePhoto();
                            photoTaken.then((data) => {
                                setPhotoPath(data.webviewPath!);
                            });
                        }}
                    >
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
            <IonModal isOpen={showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                <img src={logoPath} alt = {"logo"} />
                <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
            </IonModal>
            <IonButton onClick={() => setShowModal(true)}>Show Logo</IonButton>
        </IonPage>
    );
};

export default GameEdit;
