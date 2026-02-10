"use client";

import Image from "next/image";
import styles from "./logo-carousel.module.css";

// Logo paths - 15 customer logos
const logos = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  src: `/assets/logos/${i + 1}.png`,
  alt: `לקוח ${i + 1}`,
}));

export function LogoCarousel() {
  return (
    <section className={styles.section} dir="rtl">
      {/* Heading */}
      <div className={styles.header}>
        <h2 className={styles.title}>עוזרים לעסקים הקטנים לצמוח!</h2>
      </div>

      {/* Carousel Container */}
      <div className={styles.carouselWrapper}>
        {/* Fade edges */}
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />

        {/* Scrolling track - duplicated for seamless loop */}
        <div className={styles.track}>
          {/* First set */}
          {logos.map((logo) => (
            <div key={`a-${logo.id}`} className={styles.logoItem}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={80}
                className={styles.logo}
                loading="lazy"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {logos.map((logo) => (
            <div key={`b-${logo.id}`} className={styles.logoItem}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={80}
                className={styles.logo}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
