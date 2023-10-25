import React, { useEffect, useState } from 'react'

const MeetingTimer = ()=>{
  const [timer, setTimer] = useState('');
  console.log("====:>>>>>", timer)

  useEffect(() => {
    let minutes = 2 ;
    let seconds = minutes * 60;
    console.log('====:>>>>>', seconds)


    const countdownInterval = setInterval(() => {
     console.log("INTERVAL RUN")
      seconds--;

      const remainingMinutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;    

      const updatedMinutes =remainingMinutes.toString().length !== 1 ?  remainingMinutes : '0' + remainingMinutes
const updatedSeconds =remainingSeconds.toString().length !== 1 ? remainingSeconds : '0' + remainingSeconds    

      setTimer(`${updatedMinutes}:${updatedSeconds}`);

      if (remainingMinutes == 0 && remainingSeconds == 0) {
        console.log('Countdown complete!');
        clearInterval(countdownInterval);
        // dispatch(
        //   showMessage({
        //     message: 'Time Over',
        //     variant: 'error',
        //   })
        // );
        // History.go(-1);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

    return <div style={{color: 'white', fontSize:'22px'}}>End Meeting :  <span style={{color: 'red', marginRight:20}}>{timer}</span></div>
}

export default MeetingTimer