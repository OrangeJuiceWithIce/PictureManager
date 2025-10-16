import AddTagSection from "../TagManage/AddTagSection";
import "./PictureCard.css"

type PictureCardProps={
    id:number;
    path:string,
    onDelete:(id:number)=>Promise<void>;
}

function PictureCard({id,path,onDelete}:PictureCardProps){
    return (
        <div className="PictureCard" key={id}>
            <img 
                src={`http://localhost:8080/${path}`}
                alt="pic"
            />
            <button className="deleteBtn"
                onClick={async()=>await onDelete(id)}
            >
                X
            </button>
            <AddTagSection id={id}/>
        </div>
    )
}

export default PictureCard