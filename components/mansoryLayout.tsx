import React from 'react'
import Image from 'next/image';
import Image1 from "@/assets/images/image1.jpg";
import Image2 from "@/assets/images/image2.jpg";
import Image3 from "@/assets/images/image3.jpg";
import Image4 from "@/assets/images/image4.jpg";
import Image5 from "@/assets/images/image5D.jpg";
import Image6 from "@/assets/images/image6.jpg";
import Image7 from "@/assets/images/image7.jpg";
import Image8 from "@/assets/images/iamge8.jpg";
import Image9 from "@/assets/images/imageD.jpg";

const images = [
  { src: Image1, alt: "Image 1" },
  { src: Image2, alt: "Image 2" },
  { src: Image3, alt: "Image 3" },
  { src: Image9, alt: "Image 9" },
  { src: Image4, alt: "Image 4" },
  { src: Image5, alt: "Image 5" },
  { src: Image6, alt: "Image 6" },
  { src: Image7, alt: "Image 7" },
  { src: Image8, alt: "Image 8" },
];
const MansoryLayout = () => {
  return (
     <div className="columns-3 sm:columns-2 md:columns-3 lg:columns-4 gap-2 p-0 h-[100%]">
           {images.map((image, index) => (
             <div key={index} className={`mb-2 break-inside-avoid`}>
               <Image
                 src={image.src}
                 alt={image.alt}
                 className="aspect-auto"
                 style={{ objectFit: "cover" }}
               />
             </div>
           ))}
         </div>
  )
}

export default MansoryLayout
