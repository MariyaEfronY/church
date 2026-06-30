"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin safely on the client-side
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
    children: ReactNode;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
}

export default function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    duration = 0.8
}: ScrollRevealProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Define initial starting positions based on direction
        let xOffset = 0;
        let yOffset = 0;
        const distance = 40; // distance in pixels to travel

        if (direction === "up") yOffset = distance;
        if (direction === "down") yOffset = -distance;
        if (direction === "left") xOffset = distance;
        if (direction === "right") xOffset = -distance;

        // GSAP ScrollTrigger Animation
        const ctx = gsap.context(() => {
            gsap.fromTo(
                element,
                {
                    opacity: 0,
                    x: xOffset,
                    y: yOffset,
                },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: duration,
                    delay: delay,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%", // Starts animation when the top of the card hits 85% of screen height
                        toggleActions: "play none none none", // Plays once and retains state
                    },
                }
            );
        });

        return () => ctx.revert(); // Clean up layout calculations on unmount
    }, [direction, delay, duration]);

    return <div ref={elementRef}>{children}</div>;
}