const label_map = ['Anger', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'confident']
const video = document.querySelector("video");
const face = document.getElementById("face");
video.srcObject= null;
const canvas = document.getElementById("videoCanvas");
const download = document.getElementById("download");
const image_input_canvas = document.getElementById("image_output");
const inputImageDisplay = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");
const dtx = download.getContext("2d");
const iitx = image_input_canvas.getContext("2d");
let draw_interval = null;
let capture_interval = null;
let flag=1;
const link = document.getElementById("link");
const message = document.getElementById("message");
const undetected = document.getElementById("undetected");
const corrected = document.getElementById("corrected");
var cosinePairs=[[[11,13],[13,15]],[[12,14],[14,16]],[[7,5],[5,11]],[[12,6],[6,8]],[[5,7],[7,9]],[[6,8],[8,10]],[[3,4],[5,6]]];
const captionList = document.getElementById("captionList");
const audioDiv = document.getElementById("audioFile");
//iitx properties

//function to create a skeleton of input image:
const pair_to_connect = [[5,6],[5,7],[7,9],[6,8],[8,10],[5,11],[6,12],[11,13],[12,14],[13,15],[14,16],[11,12]]
function createSketeton(pose){
    image_input_canvas.width = inputImageDisplay.clientWidth;
    image_input_canvas.height = inputImageDisplay.clientHeight;
    
    iitx.clearRect(0,0,image_input_canvas.width,image_input_canvas.height)
    iitx.fillStyle = "black";
    iitx.fillRect(0, 0, image_input_canvas.width, image_input_canvas.height);
    const keypoints = pose.keypoints;
    iitx.beginPath();
    pair_to_connect.forEach(element =>{
        iitx.moveTo(keypoints[element[0]].position.x,keypoints[element[0]].position.y);
        iitx.lineTo(keypoints[element[1]].position.x,keypoints[element[1]].position.y)
    })
    iitx.strokeStyle = "white";
    iitx.stroke();
    for(let i=5;i<17;i++){
        iitx.beginPath();
        iitx.arc(keypoints[i].position.x,keypoints[i].position.y,5,0,2*Math.PI);
        iitx.fillStyle = "#11ede6";
        iitx.fill();
    }
    
}
function cosLines(pose){
  var cosVals=[];
for(let i=0;i<=7;i++){
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
    //console.log(slope);
}
if(slope[0]*slope[1]!=-1){tan=(slope[0]-slope[1])/(1-slope[0]*slope[1]);
    //cos=1/(Math.sqrt(1+tan*tan));
    taninv=Math.atan(tan);
    cosVals.push(taninv);}
}
return cosVals;
}

function compareCos(imgcos,vidcos){
    if(!imgcos){
        message.innerHTML = "image not uploaded.Please upload the image"
        stopTracking();
        return;
    }
    var ans=new Array();
    var count=0;
    var flag=0;
    console.log(imgcos)
    for(let i=0;i<=5;i++){
        
        if(vidcos[i]!=NaN){
            lowLimit=imgcos[i]-0.4
            upLimit=imgcos[i]+0.4
            if(i==0){
                if(vidcos[0]>lowLimit && vidcos[0]<upLimit){ans[i]="left leg is correct";}
                else if(vidcos[0]<lowLimit){ans[i]="try straightening your left leg";}
                else if(vidcos[0]>upLimit){ans[i]="try bending your left leg";}
                else{ans[i]="undetected"};
            }
            if(i==1){
                if(vidcos[1]>lowLimit && vidcos[1]<upLimit){ans[i]="right leg is correct";}
                else if(vidcos[1]<lowLimit){ans[i]="try straightening your right leg";}
                else if(vidcos[1]>upLimit){ans[i]="try bending your right leg";}
                else{ans[i]="undetected"};
            }
            if(i==2){
                if(vidcos[2]>lowLimit && vidcos[2]<upLimit){ans[i]="left arm position is correct";}
                else if(vidcos[2]<lowLimit){ans[i]="try moving your left arm away from body";}
                else if(vidcos[2]>upLimit){ans[i]="try moving your left arm towards body";}
                else{ans[i]="undetected"};
            }
            if(i==3){
                if(vidcos[3]>lowLimit && vidcos[3]<upLimit){ans[i]="right arm position is correct";}
                else if(vidcos[3]<lowLimit){ans[i]="try moving your right arm away from body";}
                else if(vidcos[3]>upLimit){ans[i]="try moving your right arm towards body";}
                else{ans[i]="undetected"};
            }
            if(i==4){
                if(vidcos[4]>lowLimit && vidcos[4]<upLimit){ans[i]="left arm alignment is correct";}
                else if(vidcos[4]<lowLimit){ans[i]="try straightening your left arm";}
                else if(vidcos[4]>upLimit){ans[i]="try bending your left arm";}
                else{ans[i]="undetected"};
            }
            if(i==5){
                if(vidcos[5]>lowLimit && vidcos[5]<upLimit){ans[i]="right arm alignment is correct";}
                else if(vidcos[5]<lowLimit){ans[i]="try straightening your right arm";}
                else if(vidcos[5]>upLimit){ans[i]="try bending your right elbow";}
                else{ans[i]="undetected"};
            }
            if(i==6){
                if(vidcos[6]>lowLimit && vidcos[6]<upLimit){ans[i]="face  is correct";}
                else if(vidcos[6]<lowLimit){ans[i]="face left";}
                else if(vidcos[6]>upLimit){ans[i]="face right";}
                else{ans[i]="undetected"};
            }
            // if(i==7){
            //     if(vidcos[7]>lowLimit && vidcos[7]<upLimit){ans[i]="right leg angle from body is correct";}
            //     else if(vidcos[7]<lowLimit){ans[i]="try bending your right thigh towards body";}
            //     else if(vidcos[7]>upLimit){ans[i]="try moving your right thigh away from body";}
            //     else{ans[i]="undetected"};
            }
            if(ans[i] && ans[i].split(" ").includes("correct")){
                count=count+1;
            }
      }else{
        ans[i]="image not clear in this area"
    }
}
    console.log(ans);
    if(count==7){console.log("Your complete posture is correct in this frame.");}
    displayMessage(ans);
}

function displayMessage(ans){
    corrected.innerHTML="";
    let flag=0;
    ans = ans.filter(element =>{
        if(element=="undetected" || element=="image not clear in this area"){
            //undetected.innerHTML = "undetected part:";
            return false;    
        }else{
            return true;
        }
    })
    ans.every(element => {
        if(!(element && element.split(" ").includes("correct"))){
            flag=1;
            message.innerHTML= element;
            return false;
         } //else{
        //     console.log("here");
        //     correctElement = document.createElement("li");
        //     correctElement.innerHTML = element;
        //     corrected.appendChild(correctElement);
        //     return true;
        // }
        return true;
        
    });
    if(flag==0 && ans.length==7){
        message.innerHTML = "perfect";
        point++;
        if(point>20){
            capture();
            point=0;
        }
        
    }
}
function capture(){
    let image = new Image();
    image.src = canvas.toDataURL();
    image.onload = ()=>{
        console.log("here");
        var scale = Math.min(download.width / image.width, download.height / image.height);
        var x = (download.width / 2) - (image.width / 2) * scale;
        var y = (download.height / 2) - (image.height / 2) * scale;
        dtx.drawImage(image,x,y,image.width * scale,image.height * scale);
        link.href= image.src;
    }
}
async function detectPose(imageElement){
    const net = await posenet.load();
    let pose = await net.estimateSinglePose(imageElement, {
        architecture: 'ResNet50',
        outputStride: 32,
        quantBytes: 4,
        inputResolution: 720,
        multiplier:1,
        });
        createSketeton(pose);
        outputAudio();
        window.cosValsImg=cosLines(pose);
}

document.getElementById('image').onchange =async function (evt) {
    var tgt = evt.target || window.event.srcElement,
    files = tgt.files;
    let outImage = document.createElement("img");
    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            outImage.src = fr.result;
            facialExpression(fr.result);
            inputImageDisplay.appendChild(outImage);
            detectPose(outImage);
        }
        fr.readAsDataURL(files[0]);
    }
    else {
        console.log("imput processing failed.");
    }
}
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function takeVideoInput(){
    const vgaConstraints = {
        video: { width: { min: 1280 }, height: { min: 720 } },
      };
      if(hasGetUserMedia()){
        navigator.mediaDevices.getUserMedia(vgaConstraints).then((stream) => {
            video.srcObject = stream;
          }).catch(console.log("problem setting up the camera!"));

          canvas.style.display = "block";
            canvas.width = 640;
            canvas.height = 360;
            ctx.translate(640, 0);
            ctx.scale(-1,1);
            draw_interval = setInterval(()=>{
                ctx.drawImage(video,0,0,640,360);},200);
      }else{
          console.log("video load failed");
      }
}
function closeVideoInput(){
    clearInterval(draw_interval);
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function(track) {
        track.stop();
    });

    video.srcObject = null;
    ctx.clearRect(0,0,640,360);
    canvas.style.display="none";
}
async function startTracking(){
    /* add image condition to this if */ 
    if(video.srcObject!=null && flag!=0){
        flag=0;
        const net = await posenet.load();
        const imageElement = new Image();
        capture_interval = setInterval(()=>{
            imageElement.src = canvas.toDataURL();
            imageElement.onload = async ()=>{
                    let pose = await net.estimateSinglePose(imageElement, {
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    quantBytes: 2,
                    inputResolution: 500,
                    multiplier:1,
                    });
                    //console.log(cosLines(pose));
                    //console.log(window.cosValsImg);
                    compareCos(window.cosValsImg,cosLines(pose));
                    //console.log(compareCos(window.cosValsImg,cosLines(pose)));
                    // ctx.beginPath();
                    // ctx.arc(640-pose.keypoints[0].position.x,pose.keypoints[0].position.y,3,0,2*Math.PI);
                    // ctx.stroke();
            }
        },)
    }else{
        console.log("video not open");
    }
}



function stopTracking(){
    flag=1;
    clearInterval(capture_interval);
}
easyScrollDots({
    'fixedNav': false,
    'fixedNavId': '',
    'fixedNavUpward': false,
    'offset': 0
  });

  captions={
      'flowers':['Where flowers bloom so does hope.','Let your joy burst forth, like flowers in the spring.','All the flowers of all the tomorrows are in the seeds of today.'],
      'stars':['Catch me under the stars.','Look at the stars, look how they shine for you.','My favorite place to be is beneath the stars.'],
      'food':['Let food be thy medicine and medicine be thy food','People who love food are always the best people.','I just want someone to look at me the way I look at food'],
      'funny':['It’s funny how your parents tell you it’s their house, but as soon as something needs cleaning, it magically becomes yours too.','I’m actually not funny. I’m just really mean and people think I’m joking.','If I was funny, I’d have a better Instagram caption for this'],
      'code':['Code is like humor. When you have to explain it, it’s bad.','First, solve the problem. Then, write the code.','Any fool can write code that a computer can understand. Good programmers write code that humans can understand.']
  }

  function serchdict(){
      captionList.innerHTML="";
      let inputText = document.querySelector("input[type='text']").value;
      if(captions[inputText]){
          captions[inputText].forEach(element => {
                captionElement = document.createElement("li");
                captionElement.innerHTML = element;
                captionList.appendChild(captionElement);
          });
      }else{
          console.log("there");
      }
      
  }

  async function facialExpression(imageString){
    const URL = "http://localhost:3000/faceRecognize";
    let data= {imgString:imageString}
    const otherParam={
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(data)
    };

    fetch(URL,otherParam)
    .then(data=>{return data.json()})
    .then(res=>{console.log(res)})
    .catch(error => console.log(error))
  }

function outputAudio(){
    audioDiv.innerHTML="";
    let audio = document.createElement("audio");
    audio.autoplay="true";
    audio.src="/audio/demo.mp3";
    audio.loop = false;
    console.log(audio);
    audioDiv.appendChild(audio);
}