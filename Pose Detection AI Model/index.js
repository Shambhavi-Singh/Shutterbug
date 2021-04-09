const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser')
// const tf = require('@tensorflow/tfjs-node');
// const posenet = require('@tensorflow-models/posenet');
// const imageScaleFactor = 0.5;
// const outputStride = 16;
// const flipHorizontal = false;
// const { createCanvas, loadImage } = require('canvas')
// const canvas = createCanvas(640, 360)
// const ctx = canvas.getContext('2d')
const cosinePairs=[[[11,13],[13,15]],[[5,11],[11,13]],[[5,11],[5,7]],[[5,7],[7,9]],[[6,8],[8,10]],[[6,12],[6,8]],[[12,14],[14,16]],[[6,12],[12,14]]];
app.use(bodyParser.urlencoded({ extended: true }))
 
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static('./public'));


app.get('/', (req, res) => {
    res.render("home");
  })

app.get('/input',(req,res)=>{
  res.render("input");
})

// app.post('/model_image', async function (req, res) {
//   const imageString = req.body.imgString;
//   const data = Buffer.from(imageString, 'base64')
//   const t = tf.node.decodeImage(data)

//   posenet.load().then((net)=>{
//         net.estimateSinglePose(t, {
//           architecture: 'ResNet50',
//           outputStride: 16,
//           quantBytes: 2,
//           inputResolution: 500,
//           multiplier:1,
//           }).then((pose)=>{res.send(pose)})

// })
// });

// app.post("/user_image",function(req,res){
//   const imageString = req.body.imgString;
//   const modelObject = JSON.parse(req.body.modelPose);
//   imgcos = cosLines(modelObject);
//   const data = Buffer.from(imageString, 'base64')
//   const t = tf.node.decodeImage(data)

//   posenet.load().then((net)=>{
//         net.estimateSinglePose(t, {
//           architecture: 'ResNet50',
//           outputStride: 16,
//           quantBytes: 2,
//           inputResolution: 500,
//           multiplier:1,
//           }).then((pose)=>{
//             videocos = cosLines(pose);
//             let ans = compareCos(imgcos,videocos);
//             let message = displayMessage(ans);
            
//             res.send(message);
//          })

// })
// })

// app.post("/faceRecognize",(req,res)=>{
//   loadImage(`${req.body.imgString}`).then((image)=>{
//     ctx.drawImage(image, 0, 0, 640, 360);
//     const imageArray = tf.browser.fromPixels(canvas);
//     let imageResize = tf.image.resizeBilinear(imageArray, [48, 48], true);
//     rgb_weights = [0.2989, 0.5870, 0.1140]
//     imageResize = tf.mul(imageResize,rgb_weights)
//     imageResize = tf.sum(imageResize,-1)
//     imageResize = tf.expandDims(imageResize, axis=-1)
//     const preprocessedInput = imageResize.expandDims();
//     console.log(preprocessedInput);
//     const handler = tf.io.fileSystem("public/model/model.json");
//     tf.loadLayersModel(handler).then(model=>{
//       let predictions = model.predict(preprocessedInput);
//       predictions.array().then(ar=>{res.send(ar)})
//     });
//   })
  // const imageString = req.body.imgString;
  // const data = Buffer.from(imageString, 'base64')
  // const t = tf.node.decodeImage(data)
  
  
// })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })

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
  if(slope[0]*slope[1]!=-1){tan=Math.abs(slope[0]-slope[1])/(1-slope[0]*slope[1]);
      cos=1/(Math.sqrt(1+tan*tan));
      cosVals.push(cos);}
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
      for(let i=0;i<=7;i++){
          
          if(vidcos[i]!=NaN){
              lowLimit=imgcos[i]-0.1
              upLimit=imgcos[i]+0.1
              if(i==0){
                  if(vidcos[0]>lowLimit && vidcos[0]<upLimit){ans[i]="left leg is correct";}
                  else if(vidcos[0]<lowLimit){ans[i]="try bending your left knee a little";}
                  else if(vidcos[0]>upLimit){ans[i]="try straightening your left leg a little";}
                  else{ans[i]="undetected"};
              }
              if(i==1){
                  if(vidcos[1]>lowLimit && vidcos[1]<upLimit){ans[i]="torso alignment is correct";}
                  else if(vidcos[1]<lowLimit){ans[i]="try bending your left thigh towards body";}
                  else if(vidcos[1]>upLimit){ans[i]="try straightening your left thigh away from body";}
                  else{ans[i]="undetected"};
              }
              if(i==2){
                  if(vidcos[2]>lowLimit && vidcos[2]<upLimit){ans[i]="left arm position is correct";}
                  else if(vidcos[2]<lowLimit){ans[i]="try moving your left arm towards body";}
                  else if(vidcos[2]>upLimit){ans[i]="try moving your left arm away from body";}
                  else{ans[i]="undetected"};
              }
              if(i==3){
                  if(vidcos[3]>lowLimit && vidcos[3]<upLimit){ans[i]="left arm alignment is correct";}
                  else if(vidcos[3]<lowLimit){ans[i]="try bending your left elbow";}
                  else if(vidcos[3]>upLimit){ans[i]="try straightening your left arm";}
                  else{ans[i]="undetected"};
              }
              if(i==4){
                  if(vidcos[4]>lowLimit && vidcos[4]<upLimit){ans[i]="right arm alignment is correct";}
                  else if(vidcos[4]<lowLimit){ans[i]="try bending your right elbow";}
                  else if(vidcos[4]>upLimit){ans[i]="try straightening your right arm";}
                  else{ans[i]="undetected"};
              }
              if(i==5){
                  if(vidcos[5]>lowLimit && vidcos[5]<upLimit){ans[i]="right arm position is correct";}
                  else if(vidcos[5]<lowLimit){ans[i]="try moving your right arm towards body";}
                  else if(vidcos[5]>upLimit){ans[i]="try moving your right arm away from body";}
                  else{ans[i]="undetected"};
              }
              if(i==6){
                  if(vidcos[6]>lowLimit && vidcos[6]<upLimit){ans[i]="right leg is correct";}
                  else if(vidcos[6]<lowLimit){ans[i]="try bending your right knee a little";}
                  else if(vidcos[6]>upLimit){ans[i]="try straightening your right leg a little";}
                  else{ans[i]="undetected"};
              }
              if(i==7){
                  if(vidcos[7]>lowLimit && vidcos[7]<upLimit){ans[i]="right leg angle from body is correct";}
                  else if(vidcos[7]<lowLimit){ans[i]="try bending your right thigh towards body";}
                  else if(vidcos[7]>upLimit){ans[i]="try moving your right thigh away from body";}
                  else{ans[i]="undetected"};
              }
              if(ans[i] && ans[i].split(" ").includes("correct")){
                  count=count+1;
              }
        }else{
          ans[i]="image not clear in this area"
      }
  }
      console.log(ans);
      if(count==8){console.log("Your complete posture is correct in this frame.");flag=1;}
      return(ans);
  }
  
  function displayMessage(ans){
      let flag=0;
      ans = ans.filter(element =>{
          if(element=="undetected" || element=="image not clear in this area"){
              return false;    
          }else{
              return true;
          }
      })
      console.log(ans);
      for(let i=0;i<ans.length;i++){
        if(!(ans[i] && ans[i].split(" ").includes("correct"))){
          flag=1;
          return(element);
      }
      }
      if(flag==0 && ans.length>=6){
          return("perfect");
      }else{
        return("cound not detect body")
      }
  }