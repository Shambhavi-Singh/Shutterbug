import 'dart:convert';

List<Captions> captionsFromJson(String str) => List<Captions>.from(json.decode(str).map((x) => Captions.fromJson(x)));

String captionsToJson(List<Captions> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class Captions {
  Captions({
    this.text,
    this.author,
  });

  String text;
  String author;

  factory Captions.fromJson(Map<String, dynamic> json) => Captions(
    text: json["text"],
    author: json["author"] == null ? null : json["author"],
  );

  Map<String, dynamic> toJson() => {
    "text": text,
    "author": author == null ? null : author,
  };
}