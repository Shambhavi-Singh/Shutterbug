import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:posecamerahack/cameraApp.dart';
import 'package:posecamerahack/captionpage.dart';
import 'inspiration.dart';

void main() {
  runApp(MyApp());
}
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: '/',
      routes:{
        '/':(context) => Inspiration(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}
