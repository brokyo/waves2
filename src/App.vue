<template>
  <div>
    <div id="background" :style="{backgroundColor: blendedColor}"></div>
    <!-- <router-view/> -->
    <h1>the sky, the sea, and the earth are just as they are</h1>
    <button @click="newChord">Chord</button>
    <button @click="scheduleEvents">Schedule Events</button>
    <logo id="logo"></logo>
  </div>
</template>
<script>
// JS Stuff
import UnmuteButton from 'unmute'
var Tone = require('tone')
import { Key, Chord } from '@tonaljs/modules';
import chroma from 'chroma-js'
var _ = require('lodash')

var timeline = new Tone.Timeline()
Tone.Transport.start()
UnmuteButton()

class ChoirSection {
  constructor(config) {
    //////////
    // CORE //
    //////////
    this.playing = false
    this.attack = 1
    this.release = 0.7
    this.webColor = 'rgb(0,0,0)'

    ///////////
    // VOICE //
    ///////////
    this.voxOut = new Tone.Gain(0.2)
    this.noise = new Tone.Noise({
      playbackRate: 0.7,
      volume: -10
    }).start()
    this.oscs = []
    this.envs = []

    for (let i = 0; i < 15; i++) {
      let osc = new Tone.OmniOscillator({
        type: 'pulse',
        width: 0.7,
        detune: _.random(-10, 10)
      }).start()

      let env = new Tone.AmplitudeEnvelope({
        attack: 1,
        attackCurve: 'linear',
        decay: 0.7,
        decayCurve: 'linear',
        sustain: 0.6,
        release: 1,
        releaseCurve: 'linear'
      });

      osc.connect(env);
      env.connect(this.voxOut)

      this.oscs.push(osc)
      this.envs.push(env)
    }
    this.noise.connect(this.envs[0])

    //////////////
    // FORMANTS //
    //////////////
    this.formantOut = new Tone.Gain()

    var lfoConfig = {
        type: 'sine',
        min: 0,
        max: 1,
        phase: 0,
        frequency: '4n',
        amplitude: 1
    }

    // LFOs
    var lfo0 = new Tone.LFO(lfoConfig).start()
    var lfo1 = new Tone.LFO(lfoConfig).start()
    var lfo2 = new Tone.LFO(lfoConfig).start()
    var lfo3 = new Tone.LFO(lfoConfig).start()
    var lfo4 = new Tone.LFO(lfoConfig).start()
    this.lfoNodes = [lfo0, lfo1, lfo2, lfo3, lfo4]

    // Filters
    var universalRolloff = -24
    var f0 = new Tone.Filter({
        type: 'bandpass',
        rolloff: universalRolloff
    })
    var f1 = new Tone.Filter({
        type: 'bandpass',
        rolloff: universalRolloff
    })
    var f2 = new Tone.Filter({
        type: 'bandpass',
        rolloff: universalRolloff
    })
    var f3 = new Tone.Filter({
        type: 'bandpass',
        rolloff: universalRolloff
    })
    var f4 = new Tone.Filter({
        type: 'bandpass',
        rolloff: universalRolloff
    })
    this.formantNodes = [f0, f1, f2, f3, f4]

    // Volume Tuning
    var v0 = new Tone.Volume()
    var v1 = new Tone.Volume()
    var v2 = new Tone.Volume()
    var v3 = new Tone.Volume()
    var v4 = new Tone.Volume()
    this.volumeNodes = [v0, v1, v2, v3, v4]


    this.lfoNodes.forEach((node, index) => {
        node.connect(this.formantNodes[index].frequency)
    })

    this.formantNodes.forEach((node, index) => {
      this.voxOut.chain(node, this.volumeNodes[index], this.formantOut)
    })

    /////////////
    // EFFECTS //
    /////////////
    this.formantOut.connect(Tone.Master)
    // this.position = new Tone.Panner(config.position)
    // this.lineOut = new Tone.Gain(0.7)
  }

  start() {
    this.playing = true;
  }

  stop() {

  }

  scheduleNote(note) {
    this.oscs.forEach(osc => {

    })
  }

  changeNote(nextNote) {
    this.oscs.forEach()
  }

  changeFormant(index) {
    var vocalizationConfig = formantPresets[index].formants

    vocalizationConfig.forEach((config, index) => {
        this.formantNodes[index].set({
            frequency: config.frequency,
            Q: config.frequency / config.bw,
        })

        this.volumeNodes[index].set({
            volume: config.volume
        })
    })
  }
}


// Vue Stuff
import logo from '@/components/logo.vue'
var formantPresets = require('@/assets/formants.js').formants

export default {
  data() {
    return {
      blendedColor: '#000000',
      colors: ['#000000', '#000000', '#000000', '#000000'],
      colorMap: [
        {
          note: 'C',
          webColor: '#FD0000',
          hueColor: {h: 360, s: 100, b: 100}
        },
        {
          note: 'G',
          webColor: '#FF8002',
          hueColor: {h: 30, s: 99, b: 100}
        },
        {
          note: 'D',
          webColor: '#FEFF04',
          hueColor: {h: 60, s: 99, b: 100}
        },
        {
          note: 'A',
          webColor: '#34CC33',
          hueColor: {h: 120, s: 75, b: 80}
        },
        {
          note: 'E',
          webColor: '#C1F2FF',
          hueColor: {h: 192, s: 24, b: 100}
        },
        {
          note: 'B',
          webColor: '#8ECAFF',
          hueColor: {h: 208, s: 44, b: 100}
        },
        {
          note: 'F#',
          webColor: '#7F8AFE',
          hueColor: {h: 235, s: 50, b: 100}
        },
        {
          note: 'Gb',
          webColor: '#7F8AFE',
          hueColor: {h: 235, s: 50, b: 100}
        },
        {
          note: 'C#',
          webColor: '#9000FF',
          hueColor: {h: 274, s: 100, b: 100}
        },
        {
          note: 'Db',
          webColor: '#9000FF',
          hueColor: {h: 274, s: 100, b: 100}
        },
        {
          note: 'G#',
          webColor: '#BB75FD',
          hueColor: {h: 271, s: 54, b: 100}
        },
        {
          note: 'Ab',
          webColor: '#BB75FD',
          hueColor: {h: 271, s: 54, b: 100}
        },
        {
          note: 'D#',
          webColor: '#B8488D',
          hueColor: {h: 324, s: 64, b: 72}
        },
        {
          note: 'Eb',
          webColor: '#B8488D',
          hueColor: {h: 324, s: 64, b: 72}
        },
        {
          note: 'A#',
          webColor: 'rbg(168, 104, 123)',
          hueColor: {h: 342, s: 38, b: 66}
        },
        {
          note: 'C#',
          webColor: '#A66779',
          hueColor: {h: 342, s: 38, b: 66}
        },
        {
          note: 'Bb',
          webColor: '#A66779',
          hueColor: {h: 342, s: 38, b: 66}
        },
        {
          note: 'F',
          webColor: '#AB0034',
          hueColor: {h: 342, s: 100, b: 66}
        }
      ],
      portamento: 0.05,
      synths: [],
      tonic: '',
      scale: [],
      chords: []
    }
  },
  watch: {
    colors: { 
      deep: true,
      handler() {
        this.blendedColor = chroma.average(this.colors).hex()
      }
    }
  },
  components: {
    logo
  },
  methods: {
    startChoir() {
      synths.forEach(synth = synth.start())

    },
    changeTonic(newTonic) {
      this.tonic = newTonic
      let key = Key.minorKey(this.tonic).natural
      this.scale = key.scale
      this.chords = key.chords
    },
    tweenColor(index, startColor, endColor, time) {
      time *= 1000

      function tween(counter, index, startColor, endColor, time, vue){
        if(counter < 20){
          setTimeout(function(){
            counter++;

            let currentColor = vue.colors[index]
            let nextColor = chroma.mix(currentColor, endColor, counter/12).hex()
            vue.$set(vue.colors, index, nextColor)

            tween(counter, index, startColor, endColor, time, vue);
          }, time / 20);
        }
      }

      tween(0, index, startColor, endColor, time, this);
    },
    newChord() {
      let chord = Chord.chord(this.chords[this.$_.random(5)])
      chord.notes.forEach((note, index) => {
        let frequency = Tone.Frequency(note).toFrequency()

        Tone.Transport.scheduleOnce(time => {
          this.synths[index].oscs.forEach(osc => {
            osc.frequency.linearRampToValueAtTime(
              frequency,
              time + this.portamento
            )
          })

          this.synths[index].envs.forEach(env => {
            env.triggerAttackRelease(2)
          })          
        }, "+1")
      })
    },
    scheduleEvents() {
      console.log(timeline.length)
      this.synths.forEach((synth, index) => {
        let startShift = 0

        for (let i = 0; i < 6; i++) {
          let nextNote = Tone.Frequency(this.$_.sample(this.scale))
          let nextNoteName = nextNote._val
          let nextNoteFrequency = nextNote.toFrequency()
  
          let noteSearch = nextNoteName.slice(0, -1);
          let colorVals = this.$_.find(this.colorMap, {note: noteSearch});

          let start = this.$_.random(1, 5)
          startShift += start

          let newEnvConfig = {
            attack: _.random(1, 5),
            release: _.random(1, 5)
          }

          let attack = new Tone.Event((time, note) => {
            console.log('attack')
            synth.oscs.forEach(osc => {
              osc.frequency.linearRampToValueAtTime(nextNoteFrequency, time + this.portamento)
            })

            synth.envs.forEach(env => {
              env.set(newEnvConfig)
              env.triggerAttack(time)
            })

            this.tweenColor(index, this.colors[index], colorVals.webColor, newEnvConfig.attack)
          }, nextNoteFrequency)

          attack.type = 'attack'
          attack.time = startShift
          attack.section = index
          attack.start(startShift)
          timeline.add(attack)

          let sustain = this.$_.random(3, 11)
          startShift += newEnvConfig.attack + sustain

          let release = new Tone.Event(time => {
            console.log('release')
            synth.envs.forEach(env => {
              env.triggerRelease()
            })

            this.tweenColor(index, this.colors[index], '#000000', newEnvConfig.release)
          })
          release.type = 'release'
          release.time = startShift
          release.section = index
          release.start(startShift)
          timeline.add(release)

          let releaseTime = newEnvConfig.release
          let rest = this.$_.random(3, 10)
          startShift += releaseTime + rest
        }
      })

    }

  },
  mounted() {
    this.changeTonic('E2')
    for(let i = 0; i < 4; i++) {
      let synth = new ChoirSection({
        index: i,
        position: -1 + i * 0.5,

      })
      synth.changeFormant(5)
      this.synths.push(synth)
    }
  }
}

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Julius+Sans+One|Open+Sans&display=swap');

h1,h2,h3,h4,h5 {
  color: white;
  font-family: 'Julius Sans One', sans-serif;  
}

h1 {
  font-size: 120px;
  width: 1440px;
}

p,span,button {
  font-family: 'Open Sans', sans-serif;
}

button {
  z-index: 1;
}

#logo {
  position: fixed;
  bottom: 0;
  right: 20px;
  z-index: 2;
}

#background {
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  z-index: -1;
}

</style>
