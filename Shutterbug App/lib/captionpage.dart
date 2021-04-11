import 'package:flutter/material.dart';

import 'SharePage.dart';
import 'home.dart';

class CaptionPage extends StatefulWidget {
  String photo;

  CaptionPage({this.photo});

  @override
  _CaptionPageState createState() => _CaptionPageState();
}

class _CaptionPageState extends State<CaptionPage> {
  @override
  void initState()  {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        image: DecorationImage(
            fit: BoxFit.cover, image: AssetImage('assets/background.png')),
      ),
      child: SafeArea(
        child: Stack(
          children: [
            Align(
              alignment: Alignment.topLeft,
              child: DefaultTextStyle(
                child: Text(
                  "CAPTIONS",
                  textScaleFactor: 3.8,
                ),
                style: TextStyle(
                  letterSpacing: 2.5,
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            Container(
              margin: EdgeInsets.only(top: 70.0),
              child: ListView.builder(
                  padding: const EdgeInsets.all(8),
                  itemCount: captions.length,
                  itemBuilder: (BuildContext context, int index) {
                    return GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => SharePage(
                                  photo: widget.photo,
                                  caption: captions[index].text)),
                        );
                      },
                      child: Container(
                        padding: EdgeInsets.symmetric(vertical: 5.0),
                        decoration: BoxDecoration(
                            border: Border(
                          top: BorderSide(width: 2.0, color: Colors.black),
                        )),
                        child: DefaultTextStyle(
                          child: Text(
                            captions[index].text,
                            textScaleFactor: 1.8,
                          ),
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    );
                  }),
            ),
          ],
        ),
      ),
    );
  }
}

//
// Container(
// decoration: BoxDecoration(
// color: Colors.white,
// image: DecorationImage(
// image: AssetImage('assets/background.png'),
// fit: BoxFit.cover,
// )),
// child: Column(
// children: [
// Padding(
// padding: EdgeInsets.symmetric(vertical: 5.0, horizontal: 10.0),
// child: DefaultTextStyle(
// child: Text(
// "CAPTIONS",
// textScaleFactor: 3.8,
// ),
// style: TextStyle(
// color: Colors.black,
// fontWeight: FontWeight.w900,
// ),
// ),
// ),

// ],
// ),
// ),
