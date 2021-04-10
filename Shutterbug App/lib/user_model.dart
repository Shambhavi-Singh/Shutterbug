// To parse this JSON data, do
//
//     final welcome = welcomeFromJson(jsonString);

import 'dart:convert';

Welcome welcomeFromJson(String str) => Welcome.fromJson(json.decode(str));

String welcomeToJson(Welcome data) => json.encode(data.toJson());

class Welcome {
  Welcome({
    this.score,
    this.keypoints,
  });

  double score;
  List<Keypoint> keypoints;

  factory Welcome.fromJson(Map<String, dynamic> json) => Welcome(
    score: json["score"].toDouble(),
    keypoints: List<Keypoint>.from(json["keypoints"].map((x) => Keypoint.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "score": score,
    "keypoints": List<dynamic>.from(keypoints.map((x) => x.toJson())),
  };
}

class Keypoint {
  Keypoint({
    this.score,
    this.keypointPart,
    this.position,
  });

  double score;
  String keypointPart;
  Position position;

  factory Keypoint.fromJson(Map<String, dynamic> json) => Keypoint(
    score: json["score"].toDouble(),
    keypointPart: json["part"],
    position: Position.fromJson(json["position"]),
  );

  Map<String, dynamic> toJson() => {
    "score": score,
    "part": keypointPart,
    "position": position.toJson(),
  };
}

class Position {
  Position({
    this.x,
    this.y,
  });

  double x;
  double y;

  factory Position.fromJson(Map<String, dynamic> json) => Position(
    x: json["x"].toDouble(),
    y: json["y"].toDouble(),
  );

  Map<String, dynamic> toJson() => {
    "x": x,
    "y": y,
  };
}
