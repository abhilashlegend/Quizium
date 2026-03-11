import { useState, useEffect } from "react"; 

export default function Progressbar({timer, onTimeout, active = true}) {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!active) return;

        const tmr = setTimeout(() => {
            onTimeout();
        }, timer);

        return () => {
            clearTimeout(tmr);
        };
    }, [timer, onTimeout, active]);

    useEffect(() => {
        if (!active) {
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            setProgress((prev) => {
                return prev + 100;
            });
        }, 100);

        return () => {
            clearInterval(interval);
            setProgress(0);
        };
    }, [timer, onTimeout, active]);

    return (
        <>
            <progress id="question-time" max={timer} value={progress} />
        </>
    );
}