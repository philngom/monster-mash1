import Phaser from 'phaser';

const formatScore = (hit) => `Health: ${hit}`;

export default class HitLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, hit, style) {
    super(scene, x, y, formatScore(hit), style);

    this.hit = hit;
  }

  setScore(hit) {
    this.hit = hit;
    this.updateScoreText();
  }

  add(points) {
    this.setScore(this.hit + points);
  }

  updateScoreText() {
    this.setText(formatScore(this.hit));
  }
}
