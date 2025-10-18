import "./home.css"

function HomePage(){
    return(
        <div className="Home">
            <h1>PictureManager</h1>
            <div className="Home-Card">
                What you can do here?
                <ul>
                    <li>上传并管理你喜欢图片</li>
                    <li>进行简单的图片编辑:裁剪,旋转以及选择灰度图</li>
                    <li>给你的图片设置可见权限,或者与大家分享你的图片</li>
                    <li>支持自定义标签,以及按照标签搜索</li>
                </ul>
            </div>
        </div>
    )
}

export default HomePage