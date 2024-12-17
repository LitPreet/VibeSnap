"use client";
import Image from "next/image";
import Image1 from "../assets/images/image1.jpg";
import Image2 from "../assets/images/image2.jpg";
import Image3 from "../assets/images/image3.jpg";
import Image4 from "../assets/images/image4.jpg";
import Image5 from "../assets/images/image5D.jpg";
import Image6 from "../assets/images/image6.jpg";
import Image7 from "../assets/images/image7.jpg";
import Image8 from "../assets/images/iamge8.jpg";
import Image9 from "../assets/images/imageD.jpg";
import Logo from "../assets/images/AppLogo.png";
import GoogleSignin from "@/components/ui/forms/LoginForm";

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
export default function Home() {

  return (
    <div className="h-screen w-full grid overflow-hidden">
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
      <div className="w-full bg-white absolute bottom-0 xs:h-[200px] xs-390:h-[360px] md:h-[200px] rounded-tr-[90px] rounded-tl-[90px] flex flex-col items-center">
        <div className="flex gap-1 mr-10 mt-8 p-0  items-center justify-center w-full">
          <div className="w-[100px] h-[40px] flex justify-end">
            <Image
              src={Logo}
              style={{ objectFit: "cover" }}
              alt="logo"
              className=" translate-x-6"
            
            />
          </div>
          <h2 className="font-[700] text-[28px] text-black tracking-wider">
            Vibesnap
          </h2>
        </div>
        <p className="font-normal text-lg mb-2 tracking-wide text-black">
          Moments That Matter, Shared Forever.
        </p>
        <GoogleSignin />
      </div>
    </div>
  
  );
}
