var canvas = document.getElementById("c");
var context = canvas.getContext("2d");
var cw = 0;
var ch=0;

function Loadimg(){
    return new Promise((resolve,reject)=>{
        let tree = new Image;
        tree.src = "/images/warrior2.jpg";
        tree.onload = ()=>{
            cw = tree.naturalWidth;
            ch = tree.naturalHeight;
            canvas.width = cw;
            canvas.height = ch;
            context.drawImage(tree, 0, 0,cw,ch);}
        resolve(tree);
    })
        
    }



var flipHorizontal = false;
async function ld(){
    let tree = await Loadimg();
    return tree;
}
ld().then((imageElement)=>{
    posenet.load().then(function(net) {
        const pose = net.estimateSinglePose(imageElement, {
        flipHorizontal: false,
        architecture: 'ResNet50',
        outputStride: 32,
        quantBytes: 2,
        inputResolution: { width: cw, height: ch },
        });
        return pose;
    }).then(function(pose){
        console.log(pose)
        pose.keypoints.forEach(element => {
            context.beginPath();
            context.arc(element.position.x, element.position.y, 1, 0, 2 * Math.PI);
            context.moveTo(element.position.x,element.position.y);
            context.lineTo(element.position.x+50,element.position.y-50);
            context.font = "20px Arial";
            context.fillText(element.part, element.position.x+50,element.position.y-50);
            context.stroke();
        });
        
        
    })
});




