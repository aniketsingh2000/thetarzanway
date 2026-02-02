"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { heroImages } from "../assets";
import {
  ANIMATION_CONFIG,
  createEntranceAnimation,
  createFloatingSequence,
  gsap,
  useGSAP,
} from "../common/gsapConfig";
import HeadingContent from "./HeadingContent";
import styles from "./HeroSection.module.scss";

const HeroSection = ({ title, subtitle }) => {
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Track image loading
  const handleImageLoad = useCallback(() => {
    setLoadedImages((prev) => prev + 1);
  }, []);

  // Check if all images are loaded
  const allImagesLoaded = loadedImages >= heroImages.length;

  // GSAP animation using useGSAP hook - only start when all images are loaded
  useGSAP(
    () => {
      // Only start animation if all images are loaded and animation hasn't started yet
      if (!allImagesLoaded || animationStarted) return;

      // Set initial state - images are below viewport and invisible (original behavior)
      gsap.set(imageRefs.current, {
        ...ANIMATION_CONFIG.initialStates.fromBottom,
        transformOrigin: "center bottom",
        willChange: "transform, opacity", // perf hint without changing animation values
      });

      // Create timeline for coordinated animations (original sequence)
      const tl = gsap.timeline();

      // Initial pop-up animation with stagger effect (original helper)
      tl.to(imageRefs.current, createEntranceAnimation(imageRefs.current));

      // Floating animation sequence (original helper)
      createFloatingSequence(tl, imageRefs.current);

      // Infinite repeat (original)
      tl.repeat(-1);

      // Mark animation as started
      setAnimationStarted(true);
    },
    { scope: containerRef, dependencies: [allImagesLoaded, animationStarted] }
  );

  return (
    <>
    <section ref={sectionRef} className={styles.heroSection}>
      <HeadingContent title={title} subtitle={subtitle} />
      <div ref={containerRef} className={styles.backgroundWrapper}>
        {heroImages.map((image, index) => (
          <div
            key={index}
            ref={(el) => (imageRefs.current[index] = el)}
            className={styles.foregroundImage}
          >
            <Image
              src={image}
              alt={`Hero Image ${index + 1}`}
              onLoad={handleImageLoad}
              priority={index < 2} 
            />
          </div>
        ))}
      </div>
 <div className={styles.bottomGreeLine}></div>
     
    </section>

    
    </>
  );
};

export default HeroSection;
