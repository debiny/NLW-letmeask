import { useHistory } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'
import { FormEvent } from 'react'
import { useState } from 'react'
import { database } from '../services/firebase'

export function Home() {
    const history = useHistory();
    const { user, sigInWithGoogle} = useAuth()
    const [ roomCode, setRoomCode] = useState('')

    async function handleCreateRoom() {
        if (!user) {
           await sigInWithGoogle()            
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('Room does not existis');
            return;
        }

        if (roomRef.val().endedAt) {
            alert('Room already closed')
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth">

            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando pergunta e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas de sua audiência em tempo real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <Button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="logo do Google" />
                        Crie sua sala com o Google
                    </Button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target?.value)}
                            value={roomCode}
                        />
                        <button type="submit">
                            Entrar na sala
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )

}