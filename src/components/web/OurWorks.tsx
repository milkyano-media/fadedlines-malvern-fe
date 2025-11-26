import { useParameterValue } from "@/hooks/useParameter";
import { useEffect, useState } from "react";

interface GalleryImage {
    url: string;
    alt: string;
}

const CarauselGallery = () => {
    const galleryImages = useParameterValue<string>(
        "content.cut_gallery",
        JSON.stringify([
            {
                url: "https://s3.milkyano.com/milkyano/fadedlines-oakleigh/gallery/1.png",
                alt: "High Skin Fade by Josh",
            },
            {
                url: "https://s3.milkyano.com/milkyano/fadedlines-oakleigh/gallery/2.png",
                alt: "High Skin Fade by Josh",
            },
            {
                url: "https://s3.milkyano.com/milkyano/fadedlines-oakleigh/gallery/7.png",
                alt: "Mid to High by Josh",
            },
        ])
    );
    const [images, setImages] = useState<[GalleryImage]>();

    useEffect(() => {
        setImages(JSON.parse(galleryImages));
    }, [galleryImages]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 justify-center items-center gap-y-4 md:gap-10 max-w-screen-lg self-center mt-10">
            {images &&
                images.map((image, index) => (
                    <img key={index} src={image.url} width={500} height={500} alt={image.alt} />
                ))}
        </div>
    );
};

export default CarauselGallery;
