import { useEffect, useRef, useState } from "react";

interface Props {
    url: string
    timestamps?: Array<number>
    skipFirst: boolean
}

interface State {
    isPlaying: boolean,
    currentTime: number,
    duration: number,
    currentTimestampIndex: number | null
    currentTimestampMap: Array<number>
    tIndexMap: Array<number>
}

const AudioPlayer = (props: Props) => {

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const initState: State = {
        isPlaying : false,
        currentTime : 0,
        duration : 0,
        currentTimestampIndex : (props.timestamps !== null && props.timestamps !== undefined && props.timestamps.length > 0) ? 0 : null,
        currentTimestampMap : [],
        tIndexMap : [],
    }

    const [state, setState] = useState<State>(initState);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (state.isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }

            setState((prevState) => ({
                ...prevState,
                isPlaying: !prevState.isPlaying,
            }));
        }
    };

    const resetState = () => {
        setState((prevState) => ({
            ...prevState,
            isPlaying : initState.isPlaying,
            currentTime : initState.currentTime,
            duration : initState.duration,
            currentTimestampIndex : initState.currentTimestampIndex
        }));
    };

    useEffect(resetState, [props.url]);

    const forward = () => {
        console.debug("Forward Clicked");
        console.debug("Does current audio ref exists: ", audioRef.current);
        
        if (audioRef.current && state.currentTimestampIndex != null && state.currentTimestampIndex >= 0 && state.currentTimestampIndex < ((props.timestamps?.length ?? 0) - 1)) {

            console.debug("Currently Selected Timestamp Index: ", state.currentTimestampIndex);
            
            // let nextIndex: number;
            // if (state.currentTimestampIndex === 0) {
            //     nextIndex = 1;
            // } else {
            //     nextIndex = state.currentTimestampIndex + 1;
            // }
            // console.info("Next Index: ", nextIndex);
            // let timestamp: number = 0;
            // for (let i = 0; i <= nextIndex; i++) {
            //     timestamp = timestamp + (props.timestamps ? props.timestamps[i] : 0);
            // }
            // updateCurrentTimestampIndex(nextIndex);
            // audioRef.current.currentTime = timestamp;
            // setState((prevState) => ({
            //     ...prevState,
            //     currentTimestampIndex : nextIndex
            // }));

            let nextIndex = state.currentTimestampIndex + 1;
            if (nextIndex < state.tIndexMap.length) {
                const cTime = state.tIndexMap[nextIndex - 1];
                audioRef.current.currentTime = cTime;
                // updateCurrentTimestampIndex(nextIndex);
            }
        }
    };


    const backward = () => {
        if (audioRef.current && state.currentTimestampIndex !== null && state.currentTimestampIndex > 0) {

            // let nextIndex: number;
            // if (state.currentTimestampIndex === 2) {
            //     nextIndex = props.skipFirst ? (state.currentTimestampIndex - 2) : (state.currentTimestampIndex - 1);
            // } else {
            //     nextIndex = state.currentTimestampIndex - 1;
            // }
            // let timestamp: number = 0;
            // for (let i = 0; i <= nextIndex; i++) {
            //     timestamp = timestamp + (props.timestamps ? props.timestamps[i] : 0);
            // }
            // audioRef.current.currentTime = timestamp;
            // updateCurrentTimestampIndex(nextIndex)
            // setState((prevState) => ({
            //     ...prevState,
            //     currentTimestampIndex : nextIndex
            // }));
            let nextIndex = state.currentTimestampIndex - 1;
            if (nextIndex > 0) {
                const cTime = state.tIndexMap[nextIndex - 1];
                audioRef.current.currentTime = cTime;
                // updateCurrentTimestampIndex(nextIndex);
            }
        }
    };

     // Handle time update: updates current playback time
  const handleTimeUpdate = () => {
    if (audioRef.current) {

        console.info("Current Time: ", Math.floor(audioRef.current.currentTime))
      const index = state.currentTimestampMap[Math.floor(audioRef.current.currentTime)];  
      console.info("Current Index: ", index);
      setState((prevState) => ({
        ...prevState,
        currentTime: audioRef.current!!.currentTime,
      }));
      updateCurrentTimestampIndex(index);
    }
  };

  const updateCurrentTimestampIndex = (index: number) => {
    if (state.currentTimestampIndex !== index) {
        setState((prevState) => ({
            ...prevState,
            currentTimestampIndex : index
        }));
    }
  }

  // Handle duration change: sets the duration of the audio
  const handleDurationChange = () => {
    if (audioRef.current) {

        const map: Array<number> = [];
        let modifiedTimestamps: Array<number> = [];
        if (props.timestamps && props.timestamps.length > 0) {
            const totalDuration = audioRef.current.duration;
            let t = 0;
            modifiedTimestamps = props.timestamps.map((v) => { 
                t = t + v;
                return t;
            });
            t = 0;

            console.log("Total duration: ", totalDuration);
            console.log("Modified Timestamp Arr: ", modifiedTimestamps);
            let start = 0;
            for (let i = 0, j = 0;  i <= totalDuration && j < modifiedTimestamps.length; i++) {
                console.debug("Running: ", i);
                let end = modifiedTimestamps[j];
                if (i >= start && i <= end) {
                    map.push(j);
                } else {
                    j++;
                    start = end;
                    end = modifiedTimestamps[j];
                    if (i >= start && i <= end) {
                        if (j <= 1) {
                            map.push(0);
                        } else {
                            map.push(j);
                        } 
                    }
                }
            }
        }
        

      setState((prevState) => ({
        ...prevState,
        duration: audioRef.current!!.duration,
        currentTimestampMap : map,
        tIndexMap : modifiedTimestamps,
      }));
    }
  };

    return (
        <div className="audio-player">
          <audio
            ref={audioRef}
            src={props.url} // Example audio file
            onTimeUpdate={handleTimeUpdate} // Updates current time on every time update
            onDurationChange={handleDurationChange} // Sets duration when it's changed or available
          />
          <div className="controls">
            <button className="backward" onClick={backward}>⏪</button>
            <button className="play-pause" onClick={togglePlayPause}>
              {state.isPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="forward" onClick={forward}>⏩</button>
          </div>
          
          {/* <div className="time-display">
            <span>{Math.floor(state.currentTime)}s</span> / <span>{Math.floor(state.duration)}s</span>
          </div> */}
        </div>
      );
}

export default AudioPlayer;