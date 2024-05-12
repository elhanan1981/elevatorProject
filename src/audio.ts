export class AudioElement {
    audio: HTMLAudioElement;
    constructor() {
      this.audio = document.createElement("audio");
      this.audio.src = "./ding.mp3";
    }
  }
  