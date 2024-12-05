// cd Startup/my-app
// node server.js
// localhost:4000
// 1. change to 3000 
// 2. 

"use client"

import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import socket from '../../socket';
import { MouseEvent, useState, useEffect } from "react";
import Timer from "../components/timer";
import * as React from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import {PopupBody} from '../components/Style'
import { getGlobalSession, setGlobalSession } from '../../globalSession';
import { getDisplayHostname, setDisplayHostname } from '../../globalHost';
import {
    Avatar,
    Stack,
    IconButton,
    TextField,
    Box,            
    Container,
    Typography,
    Button,
    Paper,
    CircularProgress,
    ThemeProvider,
    // Daniel's imports - end
} from "@mui/material"
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import { buttonTheme, Style, textTheme } from '../components/Style' 
import { shadows } from '@mui/system';
import { Truculenta } from "next/font/google";

export default function Host() {

    const router = useRouter(); // Initialize the router
    const [anchor2, setAnchor2] = React.useState(null);
    const [averageOfAllVotes, setAverageOfAllVotes] = useState(0);
    const [hostName, setHostName] = useState(" ");
    const [sessionTopicName, setSessionTopicName] = useState(" ");
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [endRoundPressed, setIsEndRoundPressed] = useState(false);
    const [checkVoteAllowedByHost, setChecked] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [userName, setUserName] = useState("");
        // Variables
        let name: string = "Kaiden"
    const open2 = Boolean(anchor2);
    const id2 = open2 ? 'simple-popper' : undefined;
    const [userVotes, setUserVotes] = useState(0);
    const [cardSelected, setCardSelected] = useState(false);
    const [displayVote, setDisplayVote] = useState(false);
    const [previousValue, setPreviousValue] = useState("-1");
    var lengthChange = -1;
    var inititalMap = new Map([
        ["PassVote", false],
        ["1", false],
        ["2", false],
        ["3", false],
        ["5", false],
        ["8", false],
        ["13", false],
        ["21", false],
        ["?", false],
      ]);
      const [players, setPlayers] = useState([
        { name: " ", vote: "Pass" },
      ]);
      const [buttonStates, setButtonStates] = useState(inititalMap);
      const [storyText, setStoryText] = useState('');


      // This shows the host and every other user that joins, render means render the cards.
      // See socket.on("return_user_name"), in the backend there is a socket.on("render")
      useEffect(() => { 
        socket.emit("render", "True")
}, []); 



       // sendVote(e)
       const sendVote = (event: MouseEvent<HTMLButtonElement>) => {
        var valueSubmittedByUser = event.currentTarget.value;
        if (!endRoundPressed || endRoundPressed && checkVoteAllowedByHost) {
        const newButtonStates = new Map(buttonStates);
        newButtonStates.forEach((value, key) => {
            if(key == valueSubmittedByUser) {
                newButtonStates.set(valueSubmittedByUser, !newButtonStates.get(valueSubmittedByUser));
            }
            else {
                newButtonStates.set(key, false);
            }
        });
        setButtonStates(newButtonStates);

        //if you click two different cards, it should automatically update.
        if (previousValue != valueSubmittedByUser || cardSelected == false) {
            setPreviousValue(valueSubmittedByUser);
            setCardSelected(true)
            socket.emit("update_average", {value: valueSubmittedByUser, selected: true});
            socket.emit("vote-selected", {value: valueSubmittedByUser, selected: true}); // userId, vote value
        }

        //if you click the same card twice, its assumed you deselected it.
        else {
            if (previousValue != valueSubmittedByUser) {
                setCardSelected(true)
                socket.emit("update_average", {value: valueSubmittedByUser, selected: true});
                socket.emit("vote-selected", {value: valueSubmittedByUser, selected: true}); // userId, vote value
            }
            else {
                setCardSelected(false)
                socket.emit("update_average", {value: valueSubmittedByUser, selected: false});
                socket.emit("vote-selected", {value: valueSubmittedByUser, selected: false}); // userId, vote value
            }

        }

    }
}

    useEffect(() => {
        if (!isTimerVisible || timeLeft === 0) return;
    
        const timerId = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
    
        return () => clearInterval(timerId); // Cleanup the interval when component unmounts
      }, [isTimerVisible, timeLeft]);

        // Hide the timer when it reaches 0
  useEffect(() => {
    if (timeLeft === 0) {
      setIsTimerVisible(false);
      socket.emit("display_all_votes");
    }
  }, [timeLeft]);


  // Makes sure checked is updated
  useEffect(() => {
  }, [checkVoteAllowedByHost]);

    
      const startTimer = () => {
        setIsTimerVisible(true);
      };


    const handleClick2 = (event2: { currentTarget: React.SetStateAction<null>; }) => {
        setAnchor2(anchor2 ? null : event2.currentTarget);
    };

    
  const renderAverage = (value : any) => {
    if (value != 0){
       return  (<Paper          
        sx={{
            width: 60,  // Size of each player card
            height: 7, // Size of each player card
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 3,
            marginRight: 3,
            marginBottom: 3,
            fontSize: 15,
            backgroundColor: backgroundColor(String(value), "")
        }}
        >
             Average: {displayVote ? value: " "}
        </Paper>
       )
    }
}

  useEffect(() => {
    socket.emit("get_all_information")
  }, );

  useEffect(() => { 
    socket.emit("get_id", "True")
}, []); 



    // The render above is caught here to set the player cards, and all other information.
    socket.on("return_user_name", (allPlayers) => {  
        setPlayers(allPlayers);     
        lengthChange = players.length;
    })

    socket.on("return_all_information", (data) => {
        var currentAverage = data.currentAverage;
        var isRoundOver = data.isRoundOver;
        var canChangeVote = data.changeVote;


        setChecked(canChangeVote);

        if(isRoundOver) {
            setIsEndRoundPressed(true);
        }
        setDisplayVote(isRoundOver);
        setAverageOfAllVotes(currentAverage)
    });

    socket.on("check_if_can_change_votes", (data) => {
        setChecked(data);
    })

    socket.on("return-id", (data) => {
        setUserName(data)
    })


    
    socket.on("set_new_average", (average) => {
        setAverageOfAllVotes(average);
    })

    // If the host disconnects, all users disconnect too
    socket.on("disconnect_all", (allPlayers) => {  
        socket.emit("disconnect_each_socket")  
        router.push("/endScreen")   
    })

    socket.on("reset_players", (allPlayers) => {
        setAverageOfAllVotes(0)
        setButtonStates(inititalMap);
        setPlayers(allPlayers);
        setCardSelected(false)
        setDisplayVote(false)
        setIsTimerVisible(false)
        setIsEndRoundPressed(false);
        setTimeLeft(60)
    });

    const backgroundColor = (vote : any, name : any)  => {
        if(displayVote) {
        if (vote === "Pass") {
            return "#dadada";
        } 
        else if (vote === "1" || vote == "2") {
          return "cyan";
        } else if (vote === "3" || vote === "5") {
          return "lightGreen";
        } 
          else if (vote === "8" || vote === "13" || vote === "21") {
            return "rgb(248, 189, 79)";
          } 

          else if (vote === '?') {
            return "violet";
          } 
        else {
            return "#dadada";
        }
      }
      if ((name == userName && cardSelected) || vote != "Pass")
        return "lightGrey"
      
      else {
          return ""
      }
    }

    socket.on("get_story_submitted_host", (data) => {
        setStoryText(data);
    })


    socket.on("count_down_started" , (data) => {
        setTimeLeft(data);
        startTimer()
    });

    socket.on("return_check_if_valid_user",(data) => {
        if (data == "routeToUserStartUp") {
            router.push("/userStartUp")
        }
        else if (data == "routeToHostStartUp") {
            router.push("/host")
        }
        else {
            setShouldRender(true)
        }
    })

    socket.on("display_votes", (averageOfAllVotes) => {
        setIsEndRoundPressed(true);
        setIsTimerVisible(false)
        setTimeLeft(60)
        setDisplayVote(true)
        setAverageOfAllVotes(averageOfAllVotes);
    })

      useEffect(() => {
        socket.emit("host_exists", () => {
          router.push('/user');
        });
      });

      useEffect(() => { 
        socket.emit("get_session_name", "True")
}, [players]); 

    useEffect(() => { 

            socket.emit("check_if_valid_user", "True")
}, []); 


useEffect(() => { 
    socket.emit("get_story_submitted_for_new_user", "true")
}, []); 


          // ensures the players are correct DONT GET RID OF THE CONSOLE LOGS PLEASE
    useEffect(() => {
      }, [players]); // Runs whenever players state changes


          // ensures the players are correct
    useEffect(() => {
      }, [storyText, players]); // Runs whenever players state changes
    
    
       // ensures the cardSelected variable is correct
    useEffect(() => {
      }, [cardSelected]); // Runs whenever players state changes
    

       // ensures votes are correct
    useEffect(() => {
      }, [displayVote]); 
    

    // ensures checkmark is correct
    useEffect(() => {
      }, [checkVoteAllowedByHost]); 

          // ensures endRound pressed is correct
    useEffect(() => {
      }, [endRoundPressed]); 


    socket.on("return_session_name", (data) => {
        setSessionTopicName(data.session);
        setHostName(data.host)
    })

    


                      // Loading Screen
  if (!shouldRender) {
    return (
<   div>
   <title>Planning Poker - Everfox</title>
  <Stack sx={{ width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center",  }} >
        <CircularProgress />
</Stack>
    </div>);
  }
                                                    

    return (
        <>
            <Box height={135}>
                <Stack 
                    id = "outline"
                    direction="row" 
                    spacing={2}
                    useFlexGap
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box sx={{ width: "16vw", minWidth: 80, maxWidth: 160 }}>
                        <IconButton
                            onClick={() => {handleClick2}}
                            sx = {{
                                width: "12vw",
                                height: "12vw",
                                maxWidth: 75,
                                maxHeight: 75
                            }}                
                        >
                            <Avatar {...stringAvatar(userName)} />
                        </IconButton>
                    </Box>
                    <BasePopup id={id2} open={open2} anchor={anchor2}>
                        <PopupBody>
                            <Link href="/"> Home Page</Link>
                        </PopupBody>
                    </BasePopup>
                    <Stack 
                        direction = "column" 
                        spacing={0}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            bgcolor: "#F3F1F6",
                            borderRadius: '8px',
                            width: "100vw",
                            height: "17vh",
                            maxWidth: 500,
                            boxShadow: 4
                        }}
                        >
                        <ThemeProvider theme = {textTheme}>
                            <Typography
                                variant="h6"
                                align="center"
                            >
                               Session Topic:  {sessionTopicName}
                            </Typography>
                        </ThemeProvider>
                        <ThemeProvider theme = {textTheme}>
                            <Typography
                                variant="subtitle1"
                                align="center"
                            >
                                Host: {hostName}
                            </Typography>
                        </ThemeProvider>
                        {isTimerVisible && `Time Left: ${timeLeft} seconds`}
                        {displayVote ? renderAverage(averageOfAllVotes) : ""}
                    </Stack>
                    <Stack
                        direction="column"
                        spacing={2}
                        width="10vw"
                        height="12vh"
                        sx = {{
                            width: 160,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                    </Stack>
                </Stack>
                <div className = ", footer">
                    <title>Planning Poker - Everfox</title>
                    <Stack               
                        direction="row" 
                        spacing={2}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                      
                        <button onClick={sendVote}  className={buttonStates.get("1") ? "cardUp card1 cardHover" : "card1 cardHover"}  value={"1"}>1</button>
                        <button onClick={sendVote}  className={buttonStates.get("2") ? "cardUp card2 cardHover" : "card2 cardHover"}  value={"2"}>2</button>
                        <button onClick={sendVote}  className={buttonStates.get("3") ? "cardUp card3 cardHover" : "card3 cardHover"}  value={"3"}>3</button>
                        <button onClick={sendVote}  className={buttonStates.get("5") ? "cardUp card5 cardHover" : "card5 cardHover"}  value={"5"}>5</button>
                        <button onClick={sendVote}  className={buttonStates.get("8") ? "cardUp card8 cardHover" : "card8 cardHover"}  value={"8"}>8</button>
                        <button onClick={sendVote}  className={buttonStates.get("13") ? "cardUp card13 cardHover" : "card13 cardHover"}  value={"13"}>13</button>
                        <button onClick={sendVote}  className={buttonStates.get("21") ? "cardUp card21 cardHover" : "card21 cardHover"}  value={"21"}>21</button>
                        <button onClick={sendVote} className={buttonStates.get("PassVote") ? "cardUp cardPass cardHover" : "cardPass cardHover"}  value={"PassVote"}>Pass</button>
                        <button onClick={sendVote} className={buttonStates.get("?") ? "cardUp cardQuestionMark cardHover" : "cardQuestionMark cardHover"}  value={"?"}>?</button>
                    </Stack>

                </div>
            </Box>
            <ThemeProvider theme = {textTheme}>
                            <Typography
                                variant="h6"
                                align="center"
                            >
                    <p style={{opacity: 0}}>Story: </p> 
                        <textarea
        value={storyText}
        className="textarea-class"
        readOnly
        style={{ width: '400px', height: '100px', resize: 'none' }} // Custom styles
      />
                            </Typography>
                        </ThemeProvider>
            {/* Player Arrangement: Simulates sitting around a table */}
             <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 4,
                    marginBottom: 4,
                    border: "transparent",
                    width: "100%",
                    marginTop: 4
                }}
                >
                   {players.map((player, vote) => (
                       <div key={player.name} style ={{textAlign: "center"}}>
                    <Paper
                    elevation={3}
                    sx={{
                        width: 100,  // Size of each player card
                        height: 100, // Size of each player card
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 3,
                        marginRight: 3,
                        backgroundColor: backgroundColor(player.vote, player.name)
                    }}
                    >
                    <Typography sx={{ fontSize: 30 }}>
                    {displayVote ? (player.vote == "PassVote" ? "Pass" : player.vote) : " "}
                </Typography>
                    </Paper>
                    <Typography style={{marginRight: 26, marginTop: 4, fontWeight: "bold"}}>{player.name}</Typography>
                    </div>
                ))}
                </Box>
        </>
    )

}

// For top div's Avatar - Converts name into a color
function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
// For top div's Avatar - Updates avatar's name and bg color
function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: "12vw",
        height: "12vw",
        maxWidth: 75,
        maxHeight: 75
      },
      children: `${name[0]}`,
    };
}