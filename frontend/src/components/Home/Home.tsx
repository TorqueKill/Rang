import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import type { RootState,AppDispatch } from '../../redux/store';
import { useNavigate } from "react-router-dom";
import './Home.css'
import { increment } from "../../redux/counter";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    //you can always add more functions/objects that you would like as props for this component
}


function HomePage({socket}:HomePageProps){
    //game ready and name should be stored on state
    //on mount/refresh, check state if both are avail else submit name and get ready
    const [message, setMessage] = useState('');
    const [gameWaiting, setGameWaiting] = useState(true);
    const [numUsers, setNumUsers] = useState(0);
    const [buttonClicked, setButtonClicked] = useState(false);
    /*
    const [numUsers, setNumUsers] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        // Listen for the 'newUser' event sent by the server
        socket.on('newUser', ({numUsers}) => {
            // Update the 'numUsers' state variable
            setNumUsers(numUsers);
    
            // If the number of users is 4, navigate to the '/game' route
            if (numUsers === 4) {
                navigate('/game');
            }
        });
    
        // Clean up the socket event listener when the component unmounts
        return () => {
            socket.off('newUser');
        }
    }, [socket]);*/


    const navigate = useNavigate();
    const { value } = useSelector((state: RootState) => state.users)
    const dispatch = useDispatch<AppDispatch>()
    //on new user
    useEffect(() => {
        socket.on('newUser', ({usersReady}) => {
            setNumUsers(usersReady);
        })
        socket.on('newUserReady', (numUsers) => {
            setNumUsers(numUsers);
        });

        socket.on('startingGame', () => {
            socket.emit('startGame')
            navigate('/game');
        })

        // listen to tooManyUsers event
        socket.on('tooManyUsers', () => {
            alert('Too many users, please try again later');
        });

        // Clean up the socket event listener when the component unmounts
        return () => {
            socket.off('newUser');
            socket.off('newUserReady');
            socket.off('tooManyUsers');
        }
    }, [socket]);


    
    //real server would have async here
    const handleClick = (socket: Socket) => {
        console.log('Socket ID:', socket.id);
        // Do something with the socket object, such as emit an event
        socket.emit('joinLobby', message);
        socket.emit('chill')
        setButtonClicked(true);
    };


    return(
        <>
        <div className="sampleHomePage">
            <h1 className="sampleTitle">RANNG</h1>
            
            <div className="sampleMessage">
            <p>Set your name to join waiting lobby</p>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button  onClick={() => handleClick(socket)} disabled={buttonClicked}>Set Name</button>
            {!gameWaiting || <p>Waiting for other players... {numUsers}/4</p>}
            </div>
        </div>
        </>
    )

}
export default HomePage