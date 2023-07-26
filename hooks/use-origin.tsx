import { useState, useEffect } from "react";

// used to be able to use the window object in the browser
export const useOrigin = () => {
    const [mounted, setIsMounted] = useState(false);

    // checking if the window is available,
    // if it is, we check if the location origin is available
    // if it's true, we set the origin to the location origin
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        setIsMounted(true);
    }
    , []);

    if (!mounted) return "";

    return origin

};