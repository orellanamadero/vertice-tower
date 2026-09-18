import { useState } from "react";
import UnidadMap from "./UnidadMap";

function FloorPlan({ project, floor }) {
    const floorImage = floor.imagePiso;

    const [imageSize, setImageSize] = useState({
        width: 0,
        height: 0,
    });

    const handleImageLoad = (event) => {
        const {
            naturalWidth,
            naturalHeight,
        } = event.target;
        setImageSize({
            width: naturalWidth,
            height: naturalHeight,
        });
    };

    return (
        <div
            className="
                relative
                h-full
                w-full
                overflow-x-auto
                overflow-y-hidden
        ">
            <div
                className="
                    relative
                    flex
                    h-full
                    min-w-full
                    w-max
                    items-center
                    justify-center
            ">

                <div
                    className="
                        relative
                        h-full
                        w-auto
                        shrink-0
                    "
                    style={{
                        aspectRatio:
                            imageSize.width && imageSize.height
                                ? `${imageSize.width} / ${imageSize.height}`
                                : "1 / 1",
                    }}
                >
                    <img
                        src={floorImage}
                        alt={`Plano del piso ${floor.numero}`}
                        onLoad={handleImageLoad}
                        className="
                            block
                            h-full
                            w-auto
                            max-w-none
                        "
                    />
                    {imageSize.width > 0 && (
                        <UnidadMap
                            project={project}
                            floor={floor}
                            size={imageSize}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
export default FloorPlan;