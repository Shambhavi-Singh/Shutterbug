import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'dart:io' as Io;
import 'dart:convert';
import 'package:flutter/services.dart';

import 'cameraApp.dart';

class Inspiration extends StatefulWidget {
  @override
  _InspirationState createState() => _InspirationState();
}

class _InspirationState extends State<Inspiration> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Container(alignment: Alignment.center,
          decoration: BoxDecoration(
            color: Colors.white,
            image: DecorationImage(
              image: AssetImage('assets/background.png'),
                  fit: BoxFit.cover,
            )
          ),
          child: Stack(
            children: [
              Align(
                alignment: Alignment.topCenter,
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 5.0,horizontal: 10.0),
                  child: DefaultTextStyle(
                    child:Text("INSPIRATION",textScaleFactor: 3.8,),
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            Padding(
              padding: EdgeInsets.only(top:90.0,left: 10.0,right: 10.0),
              child: StaggeredGridView.countBuilder(
              itemCount: 16,
              itemBuilder: (BuildContext context, int index) => GestureDetector(
                onTap: () async
                {
                  Fluttertoast.showToast(msg: index.toString());
                  ByteData bytes = await rootBundle.load('assets/modelPhoto.jpg');
                  var buffer = bytes.buffer;
                  var m = base64.encode(Uint8List.view(buffer));
                  String img64=m;
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => CameraApp(imgActivity: img64)),
                  );
                },
                child: Container(
                  margin: EdgeInsets.symmetric(vertical: 2.0,horizontal: 5.0),
                  decoration: BoxDecoration(
                    shape: BoxShape.rectangle,
                    image:  DecorationImage(image: AssetImage('assets/modelPhoto.jpg'),fit: BoxFit.fill),
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(20.0),
                  ),

                ),
              ),
              mainAxisSpacing: 8.0,
              staggeredTileBuilder: (int index) => new StaggeredTile.count(2, index.isEven ? 2 : 2),
              crossAxisCount: 4 ,
              shrinkWrap: true,
          ),
            )
            ],
          ),
        ),
    );
  }
}
