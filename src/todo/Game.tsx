import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { GameProps } from './GameProps';

interface GamePropsExt extends GameProps {
    onEdit: (id?: string) => void;
}

const Game: React.FC<GamePropsExt> = ({ _id, title, description, price, onEdit }) => {
    return (
        <IonItem onClick={() => onEdit(_id)}>
            <IonLabel>{title}, {description}, {price}</IonLabel>
        </IonItem>
    );
};


export default Game;