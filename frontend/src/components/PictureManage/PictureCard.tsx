type PictureCardProps={
    id:number;
    path:string,
    onDelete:(id:number)=>Promise<void>;
}

function PictureCard({id,path,onDelete}:PictureCardProps){
    return (
        <div key={id}>
            <img 
                src={`http://10.162.139.102:8080/${path}`}
                alt="pic"
            />
            <button
                onClick={async()=>await onDelete(id)}
            >
                X
            </button>
        </div>
    )
}

export default PictureCard