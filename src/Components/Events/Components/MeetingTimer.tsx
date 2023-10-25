import React, { useEffect, useState } from 'react'

const MeetingTimer = ()=>{
  const [timer, setTimer] = useState('');

  useEffect(() => {
    let minutes = 2 ;
    let seconds = minutes * 60;


    const countdownInterval = setInterval(() => {
      seconds--;

      const remainingMinutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;    

      const updatedMinutes =remainingMinutes.toString().length !== 1 ?  remainingMinutes : '0' + remainingMinutes
const updatedSeconds =remainingSeconds.toString().length !== 1 ? remainingSeconds : '0' + remainingSeconds    

      setTimer(`${updatedMinutes}:${updatedSeconds}`);

      if (remainingMinutes == 0 && remainingSeconds == 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

    return <div style={{color: 'white', fontSize:'22px'}}>End Meeting :  <span style={{color: 'red', marginRight:20}}>{timer}</span></div>
}

export default MeetingTimer