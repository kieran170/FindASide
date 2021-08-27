import React, { useState, useContext } from 'react';
import { Button, Modal, Input, Select } from 'semantic-ui-react';
import { firestore, auth } from '../Config/firebase';
import { useParams } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

function LobbyModal() {
    const userContext = useContext(UserContext);
    let id: string = useParams();
    const [lobbyName, setLobbyName] = useState('');
    const [lobbyDescription, setLobbyDescription] = useState('');
    const [lobbySize, setLobbySize] = useState('');
    const [lobbyDif, setDifficulty] = useState('');
    const user = { name: auth.currentUser?.displayName, game: id[0], id: auth.currentUser?.uid };


    const addLobby = async () => {
        if (lobbyName && lobbyDescription && lobbyDif && lobbySize && user.name && user.id) {
            const db = await firestore.collection(id[0]);
            const dbUser = await db.doc(user.id).get();
            if (dbUser.exists) {
                console.log('Lobby Already Created');
            } else {
                db.doc(user.id).set({});
                await db.doc(user.id).collection('Users').doc(user.id).set({ username: user.name, gameId: user.game, userId: user.id, lobbyName: lobbyName, lobbyDescription: lobbyDescription, lobbyAvatar: auth.currentUser?.photoURL, lobbySize: lobbySize, lobbyDifficulty: lobbyDif });
                userContext?.dispatch({
                    type: 'SET_MODAL_CLOSED'
                });
                window.location.reload()
            }
        } else {
            console.log('enter lobby name, description and size');
        }
    };


    const handleInputs = (e: React.ChangeEvent<HTMLInputElement>, setStateFunction: React.Dispatch<React.SetStateAction<string>>) => {
        if (setStateFunction === setLobbySize) {
            if (Number(e.target.value) > 30) {
                e.target.value = '30'
            }
        }
        setStateFunction(e.target.value);
    };

    const countryOptions = [
        { key: "Noob", value: "Noob", text: "Noob" },
        { key: "Beginner", value: "Beginner", text: "Beginner" },
        { key: "Decent", value: "Decent", text: "Decent" },
        { key: "Advanced", value: "Advanced", text: "Advanced" },
        { key: "LiveOnTheGame", value: "Live On The Game", text: "Live On The Game" }
    ];

    const handleMultiInputs = (event: React.SyntheticEvent, setStateFunction: React.Dispatch<React.SetStateAction<string>>) => {
        let target = event.target as HTMLInputElement;
        setStateFunction(target.innerText);
    }

    return (
        <Modal
            onClose={() => userContext?.dispatch({
                type: 'SET_MODAL_CLOSED'
            })}
            onOpen={() => userContext?.dispatch({
                type: 'SET_MODAL_OPEN'
            })}
            open={userContext?.state.modalOpen}
        >
            <Modal.Header>Set Up Your Lobby</Modal.Header>
            <Modal.Content >
                <Modal.Description>
                    <p>Enter Lobby Name</p>
                    <Input onChange={(e) => handleInputs(e, setLobbyName)} placeholder='Enter Lobby Name' />
                </Modal.Description>
                <Modal.Description>
                    <p>Enter Lobby Description</p>
                    <Input onChange={(e) => handleInputs(e, setLobbyDescription)} style={{ width: '100%' }} placeholder='Enter Lobby Description' />
                </Modal.Description>
                <Modal.Description>
                    <p>Enter Lobby Size (max 30)</p>
                    <Input type='number' min="0" max="30" onChange={(e) => handleInputs(e, setLobbySize)} style={{ width: '100%' }} placeholder='Enter Lobby Size' />
                </Modal.Description>
                <Modal.Description>
                    <p>Pick Your Skill Level</p>
                    <Select placeholder="Select your country" options={countryOptions} name='countries' onChange={(e) => handleMultiInputs(e, setDifficulty)} />
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => userContext?.dispatch({
                    type: 'SET_MODAL_CLOSED'
                })}>
                    Cancel
                </Button>
                <Button
                    content="Create, Lobby"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={addLobby}
                    positive
                />
            </Modal.Actions>
        </Modal>
    );
}

export default LobbyModal;