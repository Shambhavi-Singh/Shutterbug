import 'package:json_annotation/json_annotation.dart';

class User{
  String img;
  JsonValue model;

  User({ this.model,this.img});

  factory User.fromJson(Map<String,dynamic> json){
    return User(
        img:json['imgString'],
        model:json['modelObject']
    );
  }
  Map<String,dynamic> toJson()=>{
    'modelObject':model,
    'imgString':img

  };
}