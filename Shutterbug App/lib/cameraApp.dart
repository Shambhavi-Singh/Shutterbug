import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:posecamerahack/captionpage.dart';
import 'package:posecamerahack/user_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'dart:io' as Io;
import 'package:image_picker/image_picker.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'home.dart';

class CameraApp extends StatefulWidget {
  final String imgActivity;

  CameraApp({this.imgActivity});

  @override
  _CameraAppState createState() => _CameraAppState();
}

Future<Welcome> getVal(
    String
        k) async //to get the description model of the image the user wants to mimick
{
  final String url = "http://192.168.1.2:3000/model_image";
  Uri myUri = Uri.parse(url);
  final response = await http.post(myUri, body: {'imgString': k});
  if (response.statusCode == 200) {
    print(response.body);
    return welcomeFromJson(response.body);
  } else {
    print(response.statusCode);
    return null;
  }
}

Future<String> getPos(
    Welcome a, String b) async //to get our otput of hands and all
{
  final String url = "http://192.168.1.2:3000/user_image";
  Uri myUri = await Uri.parse(url);
  final response = await http
      .post(myUri, body: {'modelPose': jsonEncode(a.toJson()), 'imgString': b});
  print("Returned the repsonse: " + response.body);
  return response.body;
}

class _CameraAppState extends State<CameraApp> {
  CameraController controller;
  List cameras;
  Timer t;
  Welcome ab;
  int selectedCameraIdx;
  String imagePath;
  File _image;
  FlutterTts flutterTts;
  bool picked = false;
  final picker = ImagePicker();
  String modelImageData;
  int time = 10;
  bool rec = false;
  bool twice = false; //for checking perfect twice

  @override
  void initState() {
    super.initState();
    flutterTts = new FlutterTts();
    availableCameras().then((availableCameras) {
      cameras = availableCameras;
      selectedCameraIdx = 0;
      if (cameras.length > 0) {
        setState(() {
          // 2
          print("ABCD:" + cameras.toString());
          selectedCameraIdx = 1;
        });
        _initCameraController(cameras[selectedCameraIdx]).then((void v) {});
      } else {
        print("No camera available");
      }
    }).catchError((err) {
      // 3
      print('Error: $err.code\nError Message: $err.message');
    });
  }

  Future _initCameraController(CameraDescription cameraDescription) async {
    if (controller != null) {
      await controller.dispose();
    }
    controller = CameraController(cameraDescription, ResolutionPreset.max);
    controller.addListener(() {
      // 5
      if (mounted) {
        setState(() {});
      }
      if (controller.value.hasError) {
        print('Camera error ${controller.value.errorDescription}');
      }
    });
    try {
      await controller.initialize();
    } on CameraException catch (e) {
      print("Error");
    }

    if (mounted) {
      setState(() {});
    }
    ab = await getVal(widget.imgActivity);
  }

  @override
  void dispose() {
    super.dispose();
    controller.dispose();
  }

  String tempStore;
  Future capturePicture(con) async {
    try {
      final path = join(
        (await getExternalCacheDirectories())[0].path,
        '${DateTime.now()}',
      );
      XFile image = await controller.takePicture();
      await image.saveTo(path + '.jpeg');
      var result = await FlutterImageCompress.compressAndGetFile(
        image.path,
        path + '.jpeg',
        minHeight: 360,
        minWidth: 640,
        quality: 95,
      );
      Fluttertoast.showToast(msg: "Saving Image");
      final bytes = Io.File(result.path).readAsBytesSync();
      String img64 = base64Encode(bytes);
      File f = new File(path + '.txt');
      f.writeAsString(img64);
      String response = await getPos(ab, img64);
      bool fad = response == "perfect";
      if (response == "perfect") {
        int abcd = 55;
        captureStop(context);
        controller.dispose();
        Navigator.push(
          con,
          MaterialPageRoute(
              builder: (context) => CaptionPage(photo: path + '.jpeg')),
        );
      }
      Fluttertoast.showToast(msg: response);
      await flutterTts.setVolume(1.0);
      await flutterTts.speak(response);
      return response;
    } catch (e) {}
  }

  void handleTime(Timer timer, con) async {
    if (time != 0) {
      setState(() {
        time--;
      });
    } else {
      if (t.isActive) {
        t.cancel();
      }
      String response = await capturePicture(con);
      Timer(Duration(seconds: 5), () {
        captureStart(con);
      });
    }
  }

  void captureStart(context) async {
    setState(() {
      time = 10;
    });
    t = Timer.periodic(Duration(seconds: 1), (timer) async {
      handleTime(timer, context);
    });
  }

  void captureStop(context) {
    setState(() {
      t.cancel();
      setState(() {
        time = 10;
      });
      stringButton = "START";
    });
  }

  void getImage() async {
    //to get the image from gallery
    final pickedFile = await picker.getImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      _image = File(pickedFile.path);
      picked = true;
      final bytes = Io.File(pickedFile.path).readAsBytesSync();
      String img64 = base64Encode(bytes);
      tempStore = img64;
      ab = await getVal(img64);
    } else {
      print('No image selected.');
    }
  }

  Color col = Colors.blue;
  String stringButton = "START";
  IconData icons = Icons.camera_rear;
  AnimationController _animationController;

  @override
  Widget build(BuildContext context) {
    if (controller == null) {
      return Container();
    }
    return Stack(
      children: [
        CameraPreview(controller),
        Align(
          alignment: Alignment.topCenter,
          child: Padding(
            padding: EdgeInsets.all(20.0),
            child: DefaultTextStyle(
              child: Text(
                time.toString(),
                textScaleFactor: 5.0,
              ),
              style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
        ),
        Align(
          alignment: Alignment.bottomCenter,
          child: Padding(
            padding: EdgeInsets.all(20.0),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                primary: Color(0xFFBDAED4),
                shape: new RoundedRectangleBorder(
                  borderRadius: new BorderRadius.circular(30.0),
                ),
              ),
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                child: Text(
                  stringButton,
                  style: TextStyle(fontSize: 25),
                ),
              ),
              onPressed: () {
                if (stringButton == 'START') {
                  setState(() {
                    stringButton = 'STOP';
                  });
                  captureStart(context);
                } else {
                  stringButton = 'START';
                  captureStop(context);
                }
              },
            ),
          ),
        ),
        Align(
          alignment: Alignment.bottomLeft,
          child: Padding(
            padding: EdgeInsets.all(20.0),
            child: GestureDetector(
              onTap: () {
                if (icons == Icons.camera_rear) {
                  setState(() {
                    icons = Icons.camera_front;
                    _initCameraController(cameras[0]).then((void v) {});
                  });
                } else {
                  setState(() {
                    icons = Icons.camera_rear;
                    _initCameraController(cameras[1]).then((void v) {});
                  });
                }
              },
              child: Icon(
                icons,
                color: Colors.white,
                size: 50.0,
              ),
            ),
          ),
        ),

      ],
    );
  }
}
// Align(
// alignment: Alignment.bottomRight,
// child: Padding(
// padding: EdgeInsets.all(20.0),
// child: FloatingActionButton(
// onPressed: () {
// getImage();
// },
// ),
// ),
// ),