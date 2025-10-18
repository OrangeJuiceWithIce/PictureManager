import { useState } from "react"
import Cropper from "react-easy-crop"
import "./ImageEditor.css"

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
        <div className="image-editor">
            <div className="image-editor-canvas">
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
            
            <div className="image-editor-sidebar">
                <div className="editor-section">
                    <h3 className="section-title">编辑工具</h3>
                    
                    {/* 缩放控制 */}
                    <div className="control-group">
                        <label className="control-label">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                            <span>缩放</span>
                            <span className="control-value">{zoom.toFixed(2)}x</span>
                        </label>
                        <input
                            type="range"
                            className="range-slider"
                            min={1}
                            max={5}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                        />
                    </div>

                    {/* 旋转控制 */}
                    <div className="control-group">
                        <label className="control-label">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                            </svg>
                            <span>旋转</span>
                            <span className="control-value">{rotation}°</span>
                        </label>
                        <div className="rotate-buttons">
                            <button 
                                className="rotate-btn"
                                onClick={handleLeftRotate}
                                title="逆时针旋转90°"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="1 4 1 10 7 10"></polyline>
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                                </svg>
                            </button>
                            <button 
                                className="rotate-btn"
                                onClick={handleRightRotate}
                                title="顺时针旋转90°"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* 滤镜控制 */}
                    <div className="control-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={grayscale}
                                onChange={(e) => setGrayscale(e.target.checked)}
                                className="checkbox-input"
                            />
                            <span className="checkbox-custom"></span>
                            <span>灰度模式</span>
                        </label>
                    </div>
                </div>

                {/* 底部操作按钮 */}
                <div className="editor-actions">
                    <button 
                        className="action-btn cancel-btn"
                        onClick={onCancel}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <span>取消</span>
                    </button>
                    <button 
                        className="action-btn save-btn"
                        onClick={handleSave}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>保存</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageEditor