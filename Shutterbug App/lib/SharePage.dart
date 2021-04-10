import 'dart:io';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:social_share_plugin/social_share_plugin.dart';

class SharePage extends StatefulWidget {
  String photo, caption;

  SharePage({this.photo, this.caption});

  @override
  _SharePageState createState() => _SharePageState();
}

class _SharePageState extends State<SharePage> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    Fluttertoast.showToast(msg: widget.photo);
    Fluttertoast.showToast(msg: widget.caption);
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Stack(
        children: [
          Container(
            child: Image.file(new File(widget.photo)),
          ),
          Padding(
            padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 10.0),
            child: Align(
              alignment: Alignment.topLeft,
              child: GestureDetector(
                onTap: ()
                {


                },
                child: Icon(
                  Icons.save_alt_sharp,
                  size: 50.0,
                ),
              ),
            ),
          ),
          Padding(padding: EdgeInsets.all(10.0),
          child: Align(
            alignment: Alignment.topRight,
            child: GestureDetector(
              onTap: ()
                {
                    SocialSharePlugin.shareToFeedInstagram(path: widget.photo,);
                },
                child: Icon(Icons.share,size: 50.0,)),
          ),),
          Padding(padding: EdgeInsets.symmetric(vertical: 10.0,horizontal: 5.0),
            child: Align(
              alignment: Alignment.bottomCenter,
              child: DefaultTextStyle(
                child: Text(
                  widget.caption,
                  textScaleFactor: 1.8,
                ),
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),),
        ],
      ),
    );
  }
}
