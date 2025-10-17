import { useState } from "react"
import Cropper from "react-easy-crop"
type ImageEditorProps={
    imgUrl:string,
    onCancel:()=>void,
    onSave:(
        params:{
            rotate:number,
            grayscale:boolean,
            crop:{x:number,y:number,width:number,height:number}|null,
        }
    )=>void,
}

function clamp(value:number,min:number,max:number){
    return Math.max(min,Math.min(max,value))
}

const ImageEditor=({imgUrl,onCancel,onSave}:ImageEditorProps)=>{
    const [crop,setCrop]=useState({x:0,y:0});
    const [zoom,setZoom]=useState(1);
    const [rotation, setRotation] = useState(0);
    const [grayscale, setGrayscale] = useState(false);
    const [croppedPixels,setCroppedPixels]=useState<{
        width:number,
        height:number,
        x:number,
        y:number,
    }|null>(null)
    const onCropComplete=(_:any,croppedAreaPixels:any)=>{
        setCroppedPixels(croppedAreaPixels)
    }

    const handleLeftRotate=()=>setRotation((r)=>(r+270)%360)
    const handleRightRotate=()=>setRotation((r)=>(r+90)%360)

    const handleSave=()=>{
        const cropParam=croppedPixels
        ?{
            x: Math.round(croppedPixels.x),
            y: Math.round(croppedPixels.y),
            width: Math.round(croppedPixels.width),
            height: Math.round(croppedPixels.height),
        }
        :null
        onSave({rotate:rotation,grayscale:grayscale,crop:cropParam})
    }
    return (
        <div className="ImageEditor">
            <div style={{ position: "relative", width: 600, height: 400, background: "#111" }}>
                <Cropper
                    image={imgUrl}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onZoomChange={(z)=>setZoom(clamp(z,1,5))}
                    onCropComplete={onCropComplete}
                    showGrid
                />
            </div>
            <div>
                <label>
                    缩放: {zoom.toFixed(2)}
                    <input
                        type="range"
                        min={1}
                        max={5}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                    />
                </label>
                <div>
                    <button onClick={handleLeftRotate}>左转90°</button>
                    <button onClick={handleRightRotate}>右转90°</button>
                </div>
                <label>
                    <input
                        type="checkbox"
                        checked={grayscale}
                        onChange={(e) => setGrayscale(e.target.checked)}
                    />
                    灰度
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={onCancel}>取消</button>
                    <button onClick={handleSave}>保存</button>
                </div>
            </div>
        </div>
    )
}

export default ImageEditor