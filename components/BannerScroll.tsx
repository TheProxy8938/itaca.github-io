import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BannerScroll() {
  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"], // Animamos al 50% para que coincida con la duplicación
        }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        style={{
          width: "200%" // Doble de ancho para las imágenes duplicadas
        }}
      >
        {/* Primera serie de imágenes */}
        <div className="flex-none w-1/2">
          <div className="flex">
            <Image
              src="/banner/banner1.png"
              alt="Banner Marke Online"
              width={1000}
              height={200}
              priority
              className="object-contain"
            />
            <Image
              src="/banner/banner1.png"
              alt="Banner Marke Online"
              width={1000}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
        
        {/* Segunda serie de imágenes (duplicado exacto) */}
        <div className="flex-none w-1/2">
          <div className="flex">
            <Image
              src="/banner/banner1.png"
              alt="Banner Marke Online"
              width={1000}
              height={200}
              className="object-contain"
            />
            <Image
              src="/banner/banner1.png"
              alt="Banner Marke Online"
              width={1000}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}