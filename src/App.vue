<template>
  <div>
<!--     <div id="background" :style="{backgroundColor: blendedColor}"></div> -->
    <!-- <router-view/> -->
    <!-- <h1>the sky, the sea, and the earth are just as they are</h1> -->
    <button @click="newChord">Chord</button>
    <button @click="scheduleEvents">Schedule Events</button>
    <logo id="logo"></logo>
    START: {{lights[0].startColor}}
    END: {{lights[0].endColor}}
    CURENT: {{lights[0].currentColor}}
  </div>
</template>
<script>
// JS Stuff
import UnmuteButton from 'unmute'
var Tone = require('tone')
import { Key, Chord } from '@tonaljs/modules';
import chroma from 'chroma-js'
var _ = require('lodash')
import p5 from 'p5'

//////////////
// Hue shit //
//////////////
const v3 = require('node-hue-api').v3
const discovery = v3.discovery
const hueApi = v3.api

// const appName = 'waves'
// const deviceName = 'browser'

// async function discoverBridge() {
//   const discoveryResults = await discovery.nupnpSearch();
//   console.log(discoveryResults)

//   if(discoveryResults.length === 0) {
//     console.error('No bridges found')
//   } else {
//     return discoveryResults[0].ipaddress
//   }
// }

async function discoverAndCreateUser() {
  const ipAddress = '10.0.1.2';
  const api = await hueApi.createInsecureLocal(ipAddress).connect('username');
  // try {
  //   createdUser = await unauthenticatedApi.users.createdUser(appName, deviceName)
  //   console.log(createdUser)
  //   localStorage.setItem('waves_username', createdUser.username)
  //   localStorage.setItem('waves_key', createdUser.clientkey)
  // } catch(err) {
  //   if (err.getHueErrorType() === 101) {
  //     console.error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
  //   } else {
  //     console.error(`Unexpected Error: ${err.message}`);
  //   }
  // }
}

discoverAndCreateUser()






























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
    this.position = new Tone.Panner(config.position)
    this.lineOut = new Tone.Gain(0.5)
    this.formantOut.chain(this.position, this.lineOut)
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

var reverb = new Tone.Freeverb({
  roomSize: 0.6,
  dampening: 1200
})
var eq = new Tone.EQ3(-1, -10, -9)

reverb.chain(eq, Tone.Master)

// Vue Stuff
import logo from '@/components/logo.vue'
var formantPresets = require('@/assets/formants.js').formants

export default {
  data() {
    return {
      lights: [
        {
          id: 0,
          iterator: 0,
          iteratorStep: 0.016,
          changing: false,
          startColor: {h: 0, s: 0, b:0},
          endColor: {h: 0, s: 0, b:0},
          currentColor: {h: 0, s: 0, b:0}
        },
        {
          id: 1,
          iterator: 0,
          iteratorStep: 0.016,
          changing: false,
          startColor: {h: 0, s: 0, b:0},
          endColor: {h: 0, s: 0, b:0},
          currentColor: {h: 0, s: 0, b:0}
        }
      ],
      colorMap: [
        {
          note: 'C',
          color: {h: 360, s: 100, b: 100}
        },
        {
          note: 'G',
          color: {h: 30, s: 99, b: 100}
        },
        {
          note: 'D',
          color: {h: 60, s: 99, b: 100}
        },
        {
          note: 'A',
          color: {h: 120, s: 75, b: 80}
        },
        {
          note: 'E',
          color: {h: 192, s: 24, b: 100}
        },
        {
          note: 'B',
          color: {h: 208, s: 44, b: 100}
        },
        {
          note: 'F#',
          color: {h: 235, s: 50, b: 100}
        },
        {
          note: 'Gb',
          color: {h: 235, s: 50, b: 100}
        },
        {
          note: 'C#',
          color: {h: 274, s: 100, b: 100}
        },
        {
          note: 'Db',
          color: {h: 274, s: 100, b: 100}
        },
        {
          note: 'G#',
          color: {h: 271, s: 54, b: 100}
        },
        {
          note: 'Ab',
          color: {h: 271, s: 54, b: 100}
        },
        {
          note: 'D#',
          color: {h: 324, s: 64, b: 72}
        },
        {
          note: 'Eb',
          color: {h: 324, s: 64, b: 72}
        },
        {
          note: 'A#',
          color: {h: 342, s: 38, b: 66}
        },
        {
          note: 'C#',
          color: {h: 342, s: 38, b: 66}
        },
        {
          note: 'Bb',
          color: {h: 342, s: 38, b: 66}
        },
        {
          note: 'F',
          color: {h: 342, s: 100, b: 66}
        }
      ],
      portamento: 0.05,
      synths: [],
      tonic: '',
      scale: [],
      chords: []
    }
  },
  components: {
    logo
  },
  methods: {
    createP5() {
      var background = new p5(sketch => {
        sketch.setup = () => {
          sketch.colorMode(sketch.HSB)
          var canvas = sketch.createCanvas(400, 400)
        }

        sketch.draw = () => {
          sketch.colorMode(sketch.HSB)
          this.lights.forEach(light => {
            if(light.changing) {

              // console.log(light.startColor)
              // console.log(light.endColor)
              let startColor = sketch.color(light.startColor.h, light.startColor.s, light.startColor.b)
              let endColor = sketch.color(light.endColor.h, light.endColor.s, light.endColor.b)
              let currentColor = sketch.lerpColor(startColor, endColor, light.iterator)
              // console.log('start', startColor)
              // console.log('end', endColor)
              console.log('current', currentColor)
              debugger
              light.currentColor = currentColor
              light.iterator += light.iteratorStep
            }
            
            if(light.iterator > 1) {
              light.changing = false
              light.iterator = 0
            }
          })
          
          console.log(this.lights[0].currentColor.levels)
          // let backgroundColor = sketch.lerpColor(sketch.color(this.lights[0].currentColor), sketch.color(this.lights[1].currentColor), 0.5)
          // let backgroundColor = chroma.average(this.lights[0].currentColor, this.lights[1].currentColor).hex()
          // console.log(this.lights[0].currentColor)
          // let backgroundColor = sketch.color(this.lights[0].currentColor.h, this.lights[0].currentColor.s, this.lights[0].currentColor.b)
          sketch.background(0)
        }

      })
    },
    startChoir() {
      synths.forEach(synth = synth.start())

    },
    changeTonic(newTonic) {
      this.tonic = newTonic
      let key = Key.minorKey(this.tonic).natural
      this.scale = key.scale
      this.chords = key.chords
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
      this.synths.forEach((synth, index) => {
        if(index !== 0) { return }
        let startShift = 0

        for (let i = 0; i < 6; i++) {
          let nextNote = Tone.Frequency(this.$_.sample(this.scale))
          let nextNoteName = nextNote._val
          let nextNoteFrequency = nextNote.toFrequency()
  
          let noteSearch = nextNoteName.slice(0, -1);
          let colorVals = this.$_.find(this.colorMap, {note: noteSearch});

          let start = this.$_.random(1, 8)
          startShift += start

          let newEnvConfig = {
            attack: _.random(1, 5),
            release: _.random(1, 5)
          }

          ////////////
          // ATTACK //
          ////////////
          let attack = new Tone.Event((time, note) => {
            console.log('attack')
            synth.oscs.forEach(osc => {
              osc.frequency.linearRampToValueAtTime(nextNoteFrequency, time + this.portamento)
            })

            synth.envs.forEach(env => {
              env.set(newEnvConfig)
              env.triggerAttack(time)
            })

            if(index < 2) {
              this.lights[index].changing = true
              this.lights[index].startColor = this.lights[index].currentColor
              this.lights[index].endColor = colorVals.color
              this.lights[index].iteratorStep = 1 / newEnvConfig.attack * 60
            }

          }, nextNoteFrequency)

          attack.type = 'attack'
          attack.time = startShift
          attack.section = index
          attack.start(Tone.Time().now() + startShift)
          timeline.add(attack)

          let sustain = this.$_.random(3, 7)
          startShift += newEnvConfig.attack + sustain

          /////////////
          // RELEASE //
          /////////////
          let release = new Tone.Event(time => {
            console.log('release')
            synth.envs.forEach(env => {
              env.triggerRelease()
            })

            if(index < 2) {
              this.lights[index].changing = true
              this.lights[index].startColor = this.lights[index].currentColor
              this.lights[index].endColor = {h: 0, s: 0, b: 0}
              this.lights[index].iteratorStep = 1 / newEnvConfig.release * 60              
            }
          })
          release.type = 'release'
          release.time = startShift
          release.section = index
          release.start(Tone.Time().now() + startShift)
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
      synth.lineOut.connect(reverb)
    }
    this.createP5()
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
