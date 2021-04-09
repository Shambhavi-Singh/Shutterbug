function whichHand(hand,index){
  let str= ["slightly up","slightly down"];
  if(hand.charAt(hand.length-1)=='m'){
    str = ["move right","move left"];
  }
  if(index){
    return(`lift your ${hand} ${str[0]}    `);
  }else{
    return(`drop your ${hand} ${str[1]}   `);
}
}
function handScoreAnalyzer(angle,hand,score){
  let index = true;
  if(hand.charAt(0)=='r') index = false;
	if(-0.1<angle && angle<0.1){
    	score.innerHTML= "good ";
  	}else if(0.1<angle){
      score.innerHTML = angle+" "+whichHand(hand,index);
  	}else{
      score.innerHTML = angle+" "+whichHand(hand,!index);
  	}
}
var cosinePairs=[[[11,13],[13,15]],[[5,11],[11,13]],[[5,11],[5,7]],[[5,7],[7,9]]];

function cosLines(pose){
  var tanVals=[];
for(let i=0;i<=3;i++){
  var slope=new Array();
  for(let j=0;j<=1;j++){
    if(pose.keypoints[cosinePairs[i][j][0]].score>0.70 && pose.keypoints[cosinePairs[i][j][1]].score>0.70){
      
      if((pose.keypoints[cosinePairs[i][j][0]].position.x-pose.keypoints[cosinePairs[i][j][1]].position.x)==0){
        score.innerHTML= "failed";
      }
      else{
        slope.push((pose.keypoints[cosinePairs[i][j][0]].position.y-pose.keypoints[cosinePairs[i][j][1]].position.y)/(pose.keypoints[cosinePairs[i][j][0]].position.x-pose.keypoints[cosinePairs[i][j][1]].position.x));
      }
    }
    console.log(slope);
    
}
tan=(slope[0]-slope[1])/(1-slope[0]*slope[1]);
tanVals.push(tan);
}
console.log(tanVals);
return tanVals;
}

function handsout(pose,scoreRightUp,scoreLeftUp){
  for(let i=5;i<=6;i++){
    if(pose.keypoints[i].score>0.70 && pose.keypoints[i+2].score>0.70){
      if((pose.keypoints[i].position.x-pose.keypoints[i+2].position.x)==0){
        score.innerHTML= "failed";
      }
      angle = (pose.keypoints[i].position.y-pose.keypoints[i+2].position.y)/(pose.keypoints[i].position.x-pose.keypoints[i+2].position.x);
      if(i==5){
        handScoreAnalyzer(angle,"left hand",scoreLeftUp);
      }
      else{
        handScoreAnalyzer(angle,"right hand",scoreRightUp);
      }
    }
  }
}
function palmsUp(pose,scoreRightUp,scoreLeftUp){
  for(let i=7;i<=8;i++){
    if(pose.keypoints[i].score>0.70 && pose.keypoints[i+2].score>0.70){
      if((pose.keypoints[i].position.x-pose.keypoints[i+2].position.x)==0){
        score.innerHTML= "failed";
      }
      angle = (pose.keypoints[i].position.x-pose.keypoints[i+2].position.x)/(pose.keypoints[i].position.y-pose.keypoints[i+2].position.y);
      if(i==5){
        handScoreAnalyzer(angle,"left palm",scoreLeftUp);
      }
      else{
        handScoreAnalyzer(angle,"right palm",scoreRightUp);
      }
    }
  }
}
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  if (hasGetUserMedia()) {
    const vgaConstraints = {
        video: { width: { min: 1280 }, height: { min: 720 } },
      };
      const screenshot = document.querySelector(".start");
      const sendData = document.querySelector(".datasend");
      screenshot.disabled = true;
      const video = document.querySelector("video");
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      let captureInterval= null;
      let flag=0;
      //configuring variables
      const scoreRightUp = document.querySelector(".up>.left");
      console.log(scoreRightUp);
      const scoreLeftUp = document.querySelector(".up>.right");
      //outputing the video:
      navigator.mediaDevices.getUserMedia(vgaConstraints).then((stream) => {
        video.srcObject = stream;
        screenshot.disabled = false;
      }).catch(console.log("problem setting up the camera!"));


      screenshot.onclick = async () =>{
          console.log(flag);
          if(flag==1){
              document.querySelector(".up").innerHTML ="";
              clearInterval(captureInterval);
              canvas.style.display = "none";
              flag=0;
          }else{
              flag=1;
              canvas.style.display = "block";
              canvas.width = 640;
              canvas.height = 360;
              
              const imageElement = new Image();
              const net = await posenet.load();
              
              captureInterval = setInterval(()=>{
                ctx.drawImage(video,0,0,640,360);
                imageElement.src = canvas.toDataURL();

                imageElement.onload = async ()=>{
                let pose = await net.estimateSinglePose(imageElement, {
                architecture: 'MobileNetV1',
                outputStride: 16,
                quantBytes: 2,
                inputResolution: 500,
                multiplier:1,
                });
                //console.log(pose);
                
                for(let i=5;i<=8;i++){
                    if((pose.keypoints[i].score>0.70) && (pose.keypoints[i+2].score>0.70)){
                        
                        ctx.beginPath();
                        ctx.arc(pose.keypoints[i].position.x,pose.keypoints[i].position.y, 1, 0, 2 * Math.PI);
                        ctx.arc(pose.keypoints[i+2].position.x,pose.keypoints[i+2].position.y, 1, 0, 2 * Math.PI);
                        ctx.moveTo(pose.keypoints[i].position.x,pose.keypoints[i].position.y);
                        ctx.lineTo(pose.keypoints[i+2].position.x,pose.keypoints[i+2].position.y);
                        ctx.strokeStyle = "	rgb(102, 204, 255)"
                        ctx.stroke();
                    }
                }
                cosLines(pose);
                // handsout(pose,scoreLeftUp,scoreRightUp);
                // palmsUp(pose,scoreLeftUp,scoreRightUp)
                // pose.keypoints.forEach(element => {
                //     if(element.score>0.80){
                //         ctx.beginPath();
                //         ctx.arc(element.position.x, element.position.y, 1, 0, 2 * Math.PI);
                //         ctx.moveTo(element.position.x,element.position.y);
                //         ctx.lineTo(element.position.x+50,element.position.y-50);
                //         ctx.font = "20px Arial";
                //         ctx.fillText(element.part, element.position.x+50,element.position.y-50);
                //         ctx.stroke();
                //     }
                    
                // });
            }
            },100);
             
          }

      }
      sendData.onclick = ()=>{
        if(canvas.style.display != "null"){

          const URL = `http://127.0.0.1:5000/classify_image`;
          const otherParam={
              method:"POST",
              body:`${canvas.toDataURL()}`
          };

          fetch(URL,otherParam)
          .then(data=>{return data.json()})
          .then(res=>{console.log(res)})
          .catch(error => console.log(error))
        }
      }

      
  } else {
    alert("getUserMedia() is not supported by your browser");
  }




