import { landPlat, landAct, landSpec } from 'files/data/land.js';
import { surfacePlat, surfaceAct, surfaceSpec } from './data/surface.js';
import { subsurfacePlat, subsurfaceAct, subsurfaceSpec, subsurfaceSensor, confidenceLevel, depthContact, dopplerType, soundProp, sensorDepth, audio, broadbandNoise } from './data/subsurface.js';
import { airPlat, airAct, airSpec } from './data/air.js';
import { spacePlat, spaceAct, spaceSpec, spaceBoost, spaceLost, spaceAmp } from './data/space.js';
import { ewEnv, ewEnvInd } from './data/ew.js';
import { refPoint, refAmp, emergencyAmp, generalStationAmp, airStationAmp, generalAreaAmp, hazardAreaAmp, aswAmp, asw1amp, hazardAmp, trackIndName } from './data/reference.js';
import { callSign, spi, strength, trackID, mode1, mode3, mode4, mode5, mode5Nat, localTQ } from './data/other.js';

class TrackGenerator {
  constructor() {
    this.selectedProfile = "All";

    this.displayNames = {
      All: "All Tracks",
      "TOAD_J-Series_Air": "Air",
      "TOAD_J-Series_Land": "Land",
      "TOAD_J-Series_Space": "Space",
      "TOAD_J-Series_Surface": "Surface",
      "TOAD_J-Series_SubSurface": "SubSurface",
      "TOAD_J-Series_EW": "EW",
      "TOAD_J-Series_Reference_Point": "Reference Point",
      "TOAD_J-Series_Unit": "Unit",
    };

    this.trackProfile = [
      "All",
      "TOAD_J-Series_Air",
      "TOAD_J-Series_Land",
      "TOAD_J-Series_Space",
      "TOAD_J-Series_Surface",
      "TOAD_J-Series_SubSurface",
      "TOAD_J-Series_EW",
      "TOAD_J-Series_Reference_Point",
      "TOAD_J-Series_Unit",
    ];

    this.profileFieldsMap = {
      "TOAD_J-Series_Air": [
        "Callsign Published",
        "True Course",
        "Speed",
        "Altitude",
        "Platform",
        "Activity",
        "Specific Type",
        "Strength",
        "Local TQ",
        "SPI",
        "Identity",
        "Hour",
        "Minute",
        "Mode 1 Code",
        "Mode 2 Code",
        "Mode 3 Code",
        "Mode 4 Indicator",
        "Mode 5 Indicator",
        "Mode 5 Nationality",
      ],
      "TOAD_J-Series_Land": [
        "True Course",
        "Speed",
        "Elevation",
        "Point/Track Ind",
        "Platform",
        "Activity",
        "Specific Type",
        "Strength",
        "Local TQ",
        "SPI",
        "Identity",
        "Hour",
        "Minute",
        "Mode 1 Code",
        "Mode 2 Code",
        "Mode 3 Code",
        "Mode 4 Indicator",
        "Mode 5 Indicator",
        "Mode 5 Nationality",
      ],
      "TOAD_J-Series_Space": [
        "True Course",
        "Speed",
        "Altitude",
        "Platform",
        "Activity",
        "Specific Type",
        "Local TQ",
        "SPI",
        "Identity",
        "Minute",
        "Seconds",
        "Boost Ind",
        "Lost Track Indicator",
        "Space Amplification",
        "Space Amplification Ambiguity 1",
      ],
      "TOAD_J-Series_Surface": [
        "True Course",
        "Speed",
        "Platform",
        "Activity",
        "Specific Type",
        "Strength",
        "Local TQ",
        "SPI",
        "Identity",
        "Hour",
        "Minute",
        "Mode 1 Code",
        "Mode 3 Code",
        "Mode 2 Code",
        "Mode 4 Indicator",
        "Mode 5 Indicator",
        "Mode 5 Nationality",
      ],
      "TOAD_J-Series_SubSurface": [
        "True Course",
        "Speed",
        "Depth",
        "Platform",
        "Activity",
        "Specific Type",
        "Local TQ",
        "SPI",
        "Identity",
        "Hour",
        "Minute",
        "Mode 1 Code",
        "Mode 2 Code",
        "Mode 3 Code",
        "Mode 4 Indicator",
        "Mode 5 Indicator",
        "Mode 5 Nationality",
        "Subsurface Sensor",
        "Confidence Level",
        "Depth Contact",
      ],
      "TOAD_J-Series_EW": [
        "Track Type",
        "True Course",
        "Speed",
        "Altitude",
        "Environ/Category",
        "Platform",
        "Activity",
        "Track 3.7/14.0 Indicator",
        "Specific Type",
        "SPI",
        "Identity",
      ],
      "TOAD_J-Series_Reference_Point": [
        "True Course",
        "Speed",
        "Altitude",
        "Amplification",
        "SPI",
      ],
      "TOAD_J-Series_Unit": [
        "Environ/Category",
        "Platform",
        "Activity",
        "Specific Type",
        "Strength",
        "Identity",
        "True Course",
        "Speed",
        "Altitude",
      ],
    };
  }

  getRandomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  populateFieldCheckboxes() {
    const container = document.getElementById("fieldCheckboxes");
    container.innerHTML = "";

    if (this.selectedProfile === "All") {
      container.style.display = "none";
      return;
    }

    const fields = this.profileFieldsMap[this.selectedProfile] || [];
    container.style.display = "block";

    fields.forEach((fieldName) => {
      const checkboxId = `checkbox_${fieldName.replace(/ /g, "_")}`;
      const div = document.createElement("div");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = checkboxId;
      checkbox.value = fieldName;
      checkbox.checked = true;

      const label = document.createElement("label");
      label.htmlFor = checkboxId;
      label.textContent = fieldName;

      div.appendChild(checkbox);
      div.appendChild(label);
      container.appendChild(div);
    });
  }

  initializeProfileSelector() {
    const selector = document.getElementById("profileSelector");
    if (!selector) return;

    selector.innerHTML = "";
    this.trackProfile.forEach((profile) => {
      const option = document.createElement("option");
      option.value = profile;
      option.textContent = this.displayNames[profile];
      selector.appendChild(option);
    });

    selector.value = "All";
    this.selectedProfile = "All";

    selector.addEventListener("change", (e) => {
      this.selectedProfile = e.target.value;
      console.log("Selected profile:", this.selectedProfile);
      this.populateFieldCheckboxes();
    });

    this.populateFieldCheckboxes();
  }

  isFieldSelected(fieldName) {
    if (this.selectedProfile === "All") return true;
    const checkbox = document.querySelector(`input[value="${fieldName}"]`);
    return checkbox ? checkbox.checked : false;
  }

  generateTrackCode(nTracks, delaySecs, startLat, startLon) {
    let trackLines = [];
    let latOffset = 0;
    let longOffset = 0;
    const lineLength = 1000;

    for (let i = 0; i < nTracks; i++) {
      const lat = startLat + latOffset;
      const lon = startLon + longOffset;

      longOffset += 0.01;
      if (i % lineLength === 0 && i !== 0) {
        longOffset = 0.01;
        latOffset += 0.01;
      }

      const trackLabel = (10000 + i).toString();
      const profile =
        this.selectedProfile === "All"
          ? this.getRandomChoice(
            this.trackProfile
              .slice(1)
              .filter((p) => p !== "TOAD_J-Series_Unit")
          )
          : this.selectedProfile;

      const trackEntry = `
<createtrack name='${trackLabel}' profile='${profile}'>
    <field name='Latitude' value='${lat.toFixed(6)}'/>
    <field name='Longitude' value='${lon.toFixed(6)}'/>
    ${this.generateProfileFields(profile, trackLabel, i)}
</createtrack>
<wait seconds="${delaySecs}"/>`;

      trackLines.push(trackEntry);
    }
    return trackLines.join("\n");
  }

  generateProfileFields(profile, trackLabel, index) {
    let fields = [];

    if (profile === "TOAD_J-Series_Reference_Point") {
      if (this.isFieldSelected("True Course")) {
        fields.push(
          `<field name='True Course' value='${Math.floor(
            Math.random() * 359
          )}'/>`
        );
      }
      if (this.isFieldSelected("Speed")) {
        fields.push(
          `<field name='Speed' value='${Math.floor(Math.random() * 300)}'/>`
        );
      }
      if (this.isFieldSelected("Altitude")) {
        fields.push(
          `<field name='Altitude' value='${Math.floor(
            Math.random() * 120000
          )}'/>`
        );
      }
      fields.push(
        `<field name='Point Type' value='${this.getRandomChoice(
          refPoint
        )}'/>`
      );
      if (this.isFieldSelected("Amplification")) {
        fields.push(
          `<field name='Amplification' value='${this.getRandomChoice(
            refAmp
          )}'/>`
        );
      }
      if (this.isFieldSelected("SPI")) {
        fields.push(
          `<field name='SPI' value='${this.getRandomChoice(spi)}'/>`
        );
      }
      fields.push(`<field name='Track Label' value='${trackLabel}'/>`);
    }

    if (profile === "TOAD_J-Series_Air") {
      if (this.isFieldSelected("Callsign Published")) {
        fields.push(
          `<field name='Callsign Published' value='${this.getRandomChoice(
            callSign
          )}'/>`
        );
      }
      if (this.isFieldSelected("True Course")) {
        fields.push(
          `<field name='True Course' value='${Math.floor(
            Math.random() * 359
          )}'/>`
        );
      }
      if (this.isFieldSelected("Speed")) {
        fields.push(
          `<field name='Speed' value='${Math.floor(Math.random() * 300)}'/>`
        );
      }
      if (this.isFieldSelected("Altitude")) {
        fields.push(
          `<field name='Altitude' value='${Math.floor(
            Math.random() * 120000
          )}'/>`
        );
      }
      if (this.isFieldSelected("Platform")) {
        fields.push(
          `<field name='Platform' value='${this.getRandomChoice(
            airPlat
          )}'/>`
        );
      }
      if (this.isFieldSelected("Activity")) {
        fields.push(
          `<field name='Activity' value='${this.getRandomChoice(
            airAct
          )}'/>`
        );
      }
      if (this.isFieldSelected("Specific Type")) {
        fields.push(
          `<field name='Specific Type' value='${this.getRandomChoice(
            airSpec
          )}'/>`
        );
      }
      if (this.isFieldSelected("Strength")) {
        fields.push(
          `<field name='Strength' value='${this.getRandomChoice(
            strength
          )}'/>`
        );
      }
      if (this.isFieldSelected("Local TQ")) {
        fields.push(
          `<field name='Local TQ' value='${this.getRandomChoice(
            localTQ
          )}'/>`
        );
      }
      if (this.isFieldSelected("SPI")) {
        fields.push(
          `<field name='SPI' value='${this.getRandomChoice(spi)}'/>`
        );
      }
      fields.push(
        `<field name='Identity' value='${this.getRandomChoice(trackID)}'/>`
      );
      if (this.isFieldSelected("Hour")) {
        fields.push(
          `<field name='Hour' value='${Math.floor(Math.random() * 23)}'/>`
        );
      }
      if (this.isFieldSelected("Minute")) {
        fields.push(
          `<field name='Minute' value='${Math.floor(Math.random() * 59)}'/>`
        );
      }
      if (this.isFieldSelected("Mode 1 Code")) {
        fields.push(
          `<field name='Mode 1 Code' value='${this.getRandomChoice(
            mode1
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 2 Code")) {
        fields.push(
          `<field name='Mode 2 Code' value='${Math.floor(Math.random() * 4096).toString(8)}'/>`
        );
      }
      if (this.isFieldSelected("Mode 3 Code")) {
        fields.push(
          `<field name='Mode 3 Code' value='${this.getRandomChoice(
            mode3
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 4 Indicator")) {
        fields.push(
          `<field name='Mode 4 Indicator' value='${this.getRandomChoice(
            mode4
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 5 Indicator")) {
        fields.push(
          `<field name='Mode 5 Indicator' value='${this.getRandomChoice(
            mode5
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 5 Nationality")) {
        fields.push(
          `<field name='Mode 5 Nationality' value='${this.getRandomChoice(
            mode5Nat
          )}'/>`
        );
      }
      fields.push(`<field name='Track Label' value='${trackLabel}'/>`);
    }
    if (profile === "TOAD_J-Series_Surface") {
      if (this.isFieldSelected("True Course")) {
        fields.push(
          `<field name='True Course' value='${Math.floor(
            Math.random() * 359
          )}'/>`
        );
      }

      if (this.isFieldSelected("Speed")) {
        fields.push(
          `<field name='Speed' value='${Math.floor(Math.random() * 90)}'/>`
        );
      }
      if (this.isFieldSelected("Platform")) {
        fields.push(
          `<field name='Platform' value='${this.getRandomChoice(
            surfacePlat
          )}'/>`
        );
      }
      if (this.isFieldSelected("Activity")) {
        fields.push(
          `<field name='Activity' value='${this.getRandomChoice(
            surfaceAct
          )}'/>`
        );
      }
      if (this.isFieldSelected("Specific Type")) {
        fields.push(
          `<field name='Specific Type' value='${this.getRandomChoice(
            surfaceSpec
          )}'/>`
        );
      }
      if (this.isFieldSelected("Strength")) {
        fields.push(
          `<field name='Strength' value='${this.getRandomChoice(
            strength
          )}'/>`
        );
      }
      if (this.isFieldSelected("Local TQ")) {
        fields.push(
          `<field name='Local TQ' value='${this.getRandomChoice(
            localTQ
          )}'/>`
        );
      }
      if (this.isFieldSelected("SPI")) {
        fields.push(
          `<field name='SPI' value='${this.getRandomChoice(spi)}'/>`
        );
      }
      fields.push(
        `<field name='Identity' value='${this.getRandomChoice(trackID)}'/>`
      );
      if (this.isFieldSelected("Hour")) {
        fields.push(
          `<field name='Hour' value='${Math.floor(Math.random() * 23)}'/>`
        );
      }
      if (this.isFieldSelected("Minute")) {
        fields.push(
          `<field name='Minute' value='${Math.floor(Math.random() * 59)}'/>`
        );
      }
      if (this.isFieldSelected("Mode 1 Code")) {
        fields.push(
          `<field name='Mode 1 Code' value='${this.getRandomChoice(
            mode1
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 2 Code")) {
        fields.push(
          `<field name='Mode 2 Code' value='${Math.floor(Math.random() * 4096).toString(8)}'/>`
        );
      }
      if (this.isFieldSelected("Mode 3 Code")) {
        fields.push(
          `<field name='Mode 3 Code' value='${this.getRandomChoice(
            mode3
          )}'/>`
        );
      }
      fields.push(
        `<field name='Mode 4 Indicator' value='${this.getRandomChoice(
          mode4
        )}'/>`
      );
      fields.push(
        `<field name='Mode 5 Indicator' value='${this.getRandomChoice(
          mode5
        )}'/>`
      );
      fields.push(
        `<field name='Mode 5 Nationality' value='${this.getRandomChoice(
          mode5Nat
        )}'/>`
      );
      fields.push(`<field name='Track Label' value='${trackLabel}'/>`);
    }
    if (profile === "TOAD_J-Series_SubSurface") {
      if (this.isFieldSelected("True Course")) {
        fields.push(
          `<field name='True Course' value='${Math.floor(
            Math.random() * 359
          )}'/>`
        );
      }
      if (this.isFieldSelected("Speed")) {
        fields.push(
          `<field name='Speed' value='${Math.floor(Math.random() * 90)}'/>`
        );
      }
      if (this.isFieldSelected("Depth")) {
        fields.push(
          `<field name='Depth' value='${Math.floor(Math.random() * 6100)}'/>`
        );
      }
      if (this.isFieldSelected("Platform")) {
        fields.push(
          `<field name='Platform' value='${this.getRandomChoice(
            subsurfacePlat
          )}'/>`
        );
      }
      if (this.isFieldSelected("Activity")) {
        fields.push(
          `<field name='Activity' value='${this.getRandomChoice(
            subsurfaceAct
          )}'/>`
        );
      }
      fields.push(
        `<field name='Track 3.4/5.4 Indicator' value='J3.4 Track(ASW)'/>`
      );
      if (this.isFieldSelected("Specific Type")) {
        fields.push(
          `<field name='Specific Type' value='${this.getRandomChoice(
            subsurfaceSpec
          )}'/>`
        );
      }
      if (this.isFieldSelected("Local TQ")) {
        fields.push(
          `<field name='Local TQ' value='${this.getRandomChoice(
            localTQ
          )}'/>`
        );
      }
      if (this.isFieldSelected("SPI")) {
        fields.push(
          `<field name='SPI' value='${this.getRandomChoice(spi)}'/>`
        );
      }
      fields.push(
        `<field name='Identity' value='${this.getRandomChoice(trackID)}'/>`
      );
      if (this.isFieldSelected("Hour")) {
        fields.push(
          `<field name='Hour' value='${Math.floor(Math.random() * 23)}'/>`
        );
      }
      if (this.isFieldSelected("Minute")) {
        fields.push(
          `<field name='Minute' value='${Math.floor(Math.random() * 59)}'/>`
        );
      }
      if (this.isFieldSelected("Mode 1 Code")) {
        fields.push(
          `<field name='Mode 1 Code' value='${this.getRandomChoice(
            mode1
          )}'/>`
        );
      }

      if (this.isFieldSelected("Mode 2 Code")) {
        fields.push(
          `<field name='Mode 2 Code' value='${Math.floor(Math.random() * 4096).toString(8)}'/>`
        );
      }
      if (this.isFieldSelected("Mode 3 Code")) {
        fields.push(
          `<field name='Mode 3 Code' value='${this.getRandomChoice(
            mode3
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 4 Indicator")) {
        fields.push(
          `<field name='Mode 4 Indicator' value='${this.getRandomChoice(
            mode4
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 5 Indicator")) {
        fields.push(
          `<field name='Mode 5 Indicator' value='${this.getRandomChoice(
            mode5
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 5 Nationality")) {
        fields.push(
          `<field name='Mode 5 Nationality' value='${this.getRandomChoice(
            mode5Nat
          )}'/>`
        );
      }
      if (this.isFieldSelected("Subsurface Sensor")) {
        fields.push(
          `<field name='Subsurface Sensor' value='${this.getRandomChoice(
            subsurfaceSensor
          )}'/>`
        );
      }
      if (this.isFieldSelected("Confidence Level")) {
        fields.push(
          `<field name='Confidence Level' value='${this.getRandomChoice(
            confidenceLevel
          )}'/>`
        );
      }
      if (this.isFieldSelected("Depth Contact")) {
        fields.push(
          `<field name='Depth Contact' value='${this.getRandomChoice(
            depthContact
          )}'/>`
        );
      }
      fields.push(`<field name='Track Label' value='${trackLabel}'/>`);
    }
    if (profile === "TOAD_J-Series_Land") {
      if (this.isFieldSelected("True Course")) {
        fields.push(
          `<field name='True Course' value='${Math.floor(
            Math.random() * 359
          )}'/>`
        );
      }
      if (this.isFieldSelected("Speed")) {
        fields.push(
          `<field name='Speed' value='${Math.floor(Math.random() * 300)}'/>`
        );
      }
      if (this.isFieldSelected("Elevation")) {
        fields.push(
          `<field name='Elevation' value='${Math.floor(
            Math.random() * 30000
          )}'/>`
        );
      }
      fields.push(
        `<field name='Point/Track Ind' value='${this.getRandomChoice(
          this.tracktype35
        )}'/>`
      );
      if (this.isFieldSelected("Platform")) {
        fields.push(
          `<field name='Platform' value='${this.getRandomChoice(
            landPlat
          )}'/>`
        );
      }
      if (this.isFieldSelected("Activity")) {
        fields.push(
          `<field name='Activity' value='${this.getRandomChoice(
            landAct
          )}'/>`
        );
      }
      if (this.isFieldSelected("Specific Type")) {
        fields.push(
          `<field name='Specific Type' value='${this.getRandomChoice(
            landSpec
          )}'/>`
        );
      }
      if (this.isFieldSelected("Strength")) {
        fields.push(
          `<field name='Strength' value='${this.getRandomChoice(
            strength
          )}'/>`
        );
      }
      if (this.isFieldSelected("Local TQ")) {
        fields.push(
          `<field name='Local TQ' value='${this.getRandomChoice(
            localTQ
          )}'/>`
        );
      }
      if (this.isFieldSelected("SPI")) {
        fields.push(
          `<field name='SPI' value='${this.getRandomChoice(spi)}'/>`
        );
      }
      fields.push(
        `<field name='Identity' value='${this.getRandomChoice(trackID)}'/>`
      );
      if (this.isFieldSelected("Hour")) {
        fields.push(
          `<field name='Hour' value='${Math.floor(Math.random() * 23)}'/>`
        );
      }
      if (this.isFieldSelected("Minute")) {
        fields.push(
          `<field name='Minute' value='${Math.floor(Math.random() * 59)}'/>`
        );
      }
      if (this.isFieldSelected("Mode 1 Code")) {
        fields.push(
          `<field name='Mode 1 Code' value='${this.getRandomChoice(
            mode1
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 2 Code")) {
        fields.push(
          `<field name='Mode 2 Code' value='${Math.floor(Math.random() * 4096).toString(8)}'/>`
        );
      }
      if (this.isFieldSelected("Mode 3 Code")) {
        fields.push(
          `<field name='Mode 3 Code' value='${this.getRandomChoice(
            mode3
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 4 Indicator")) {
        fields.push(
          `<field name='Mode 4 Indicator' value='${this.getRandomChoice(
            mode4
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 5 Indicator")) {
        fields.push(
          `<field name='Mode 5 Indicator' value='${this.getRandomChoice(
            mode5
          )}'/>`
        );
      }
      if (this.isFieldSelected("Mode 5 Nationality")) {
        fields.push(
          `<field name='Mode 5 Nationality' value='${this.getRandomChoice(
            mode5Nat
          )}'/>`
        );
      }
      fields.push(`<field name='Track Label' value='${trackLabel}'/>`);
    }
    if (profile === "TOAD_J-Series_Space") {
      if (this.isFieldSelected("True Course")) {
        fields.push(
          `<field name='True Course' value='${Math.floor(
            Math.random() * 359
          )}'/>`
        );
      }
      if (this.isFieldSelected("Speed")) {
        fields.push(
          `<field name='Speed' value='${Math.floor(Math.random() * 3000)}'/>`
        );
      }
      if (this.isFieldSelected("Altitude")) {
        fields.push(
          `<field name='Altitude' value='${Math.floor(
            Math.random() * 120000
          )}'/>`
        );
      }
      if (this.isFieldSelected("Platform")) {
        fields.push(
          `<field name='Platform' value='${this.getRandomChoice(
            spacePlat
          )}'/>`
        );
      }
      if (this.isFieldSelected("Activity")) {
        fields.push(
          `<field name='Activity' value='${this.getRandomChoice(
            spaceAct
          )}'/>`
        );
      }
      if (this.isFieldSelected("Specific Type")) {
        fields.push(
          `<field name='Specific Type' value='${this.getRandomChoice(
            spaceSpec
          )}'/>`
        );
      }
      if (this.isFieldSelected("Local TQ")) {
        fields.push(
          `<field name='Local TQ' value='${this.getRandomChoice(
            localTQ
          )}'/>`
        );
      }
      if (this.isFieldSelected("SPI")) {
        fields.push(
          `<field name='SPI' value='${this.getRandomChoice(spi)}'/>`
        );
      }
      fields.push(
        `<field name='Identity' value='${this.getRandomChoice(trackID)}'/>`
      );
      if (this.isFieldSelected("Minute")) {
        fields.push(
          `<field name='Minute' value='${Math.floor(Math.random() * 59)}'/>`
        );
      }
      if (this.isFieldSelected("Seconds")) {
        fields.push(
          `<field name='Seconds' value='${Math.floor(Math.random() * 59)}'/>`
        );
      }
      if (this.isFieldSelected("Boost Ind")) {
        fields.push(
          `<field name='Boost Ind' value='${this.getRandomChoice(
            spaceBoost
          )}'/>`
        );
      }
      if (this.isFieldSelected("Lost Track Indicator")) {
        fields.push(
          `<field name='Lost Track Indicator' value='${this.getRandomChoice(
            spaceLost
          )}'/>`
        );
      }
      if (this.isFieldSelected("Space Amplification")) {
        fields.push(
          `<field name='Space Amplification' value='${this.getRandomChoice(
            spaceAmp
          )}'/>`
        );
      }
      if (this.isFieldSelected("Space Amplification Ambiguity 1")) {
        fields.push(
          `<field name='Space Amplification Ambiguity 1' value='${this.getRandomChoice(
            spaceAmp
          )}'/>`
        );
      }
      fields.push(`<field name='Track Label' value='${trackLabel}'/>`);
    }

    if (profile === "TOAD_J-Series_EW") {
      fields.push(`<field name='Track Type' value='EW'/>`);
      if (this.isFieldSelected("True Course")) {
        fields.push(
          `<field name='True Course' value='${Math.floor(
            Math.random() * 359
          )}'/>`
        );
      }
      if (this.isFieldSelected("Speed")) {
        fields.push(
          `<field name='Speed' value='${Math.floor(Math.random() * 300)}'/>`
        );
      }
      if (this.isFieldSelected("Altitude")) {
        fields.push(
          `<field name='Altitude' value='${Math.floor(
            Math.random() * 30000
          )}'/>`
        );
      }
      if (this.isFieldSelected("Environ/Category")) {
        fields.push(
          `<field name='Environ/Category' value='${this.getRandomChoice(
            ewEnv
          )}'/>`
        );
      }
      if (this.isFieldSelected("Platform")) {
        fields.push(
          `<field name='Platform' value='${this.getRandomChoice(
            landPlat
          )}'/>`
        );
      }
      if (this.isFieldSelected("Activity")) {
        fields.push(
          `<field name='Activity' value='${this.getRandomChoice(
            landAct
          )}'/>`
        );
      }
      if (this.isFieldSelected("Track 3.7/14.0 Indicator")) {
        fields.push(
          `<field name='Track 3.7/14.0 Indicator' value='${this.getRandomChoice(
            ewEnvInd
          )}'/>`
        );
      }
      if (this.isFieldSelected("Specific Type")) {
        fields.push(
          `<field name='Specific Type' value='${this.getRandomChoice(
            landSpec
          )}'/>`
        );
      }
      if (this.isFieldSelected("SPI")) {
        fields.push(
          `<field name='SPI' value='${this.getRandomChoice(spi)}'/>`
        );
      }
      fields.push(
        `<field name='Identity' value='${this.getRandomChoice(trackID)}'/>`
      );
    }


    if (profile === "TOAD_J-Series_Unit") {
      const unitEnviron = this.getRandomChoice([
        "Land Track",
        "Land Point",
        "Air",
        "Surface",
        "Subsurface",
      ]);
      let unitPlatform = [];
      let unitActivity = [];
      let unitSpecific = [];

      if (unitEnviron === "Land Track" || unitEnviron === "Land Point") {
        unitPlatform = this.landPlat;
        unitActivity = this.landAct;
        unitSpecific = this.landSpec;
      } else if (unitEnviron === "Air") {
        unitPlatform = this.airPlat;
        unitActivity = this.airAct;
        unitSpecific = this.airSpec;
      } else if (unitEnviron === "Surface") {
        unitPlatform = this.surfacePlat;
        unitActivity = this.surfaceAct;
        unitSpecific = this.surfaceSpec;
      } else if (unitEnviron === "Subsurface") {
        unitPlatform = this.subsurfacePlat;
        unitActivity = this.subsurfaceAct;
        unitSpecific = this.subsurfaceSpec;
      }

      if (this.isFieldSelected("Environ/Category")) {
        fields.push(
          `<field name='Environ/Category' value='${unitEnviron}'/>`
        );
      }
      if (this.isFieldSelected("Platform")) {
        fields.push(
          `<field name='Platform' value='${this.getRandomChoice(
            unitPlatform
          )}'/>`
        );
      }
      if (this.isFieldSelected("Activity")) {
        fields.push(
          `<field name='Activity' value='${this.getRandomChoice(
            unitActivity
          )}'/>`
        );
      }
      if (this.isFieldSelected("Specific Type")) {
        fields.push(
          `<field name='Specific Type' value='${this.getRandomChoice(
            unitSpecific
          )}'/>`
        );
      }
      if (this.isFieldSelected("Strength")) {
        fields.push(
          `<field name='Strength' value='${this.getRandomChoice(
            this.strength
          )}'/>`
        );
      }
      if (this.isFieldSelected("Identity")) {
        fields.push(
          `<field name='Identity' value='${this.getRandomChoice(
            this.trackID
          )}'/>`
        );
      }
      if (this.isFieldSelected("True Course")) {
        fields.push(
          `<field name='True Course' value='${Math.floor(
            Math.random() * 359
          )}'/>`
        );
      }
      if (this.isFieldSelected("Speed")) {
        fields.push(
          `<field name='Speed' value='${Math.floor(Math.random() * 300)}'/>`
        );
      }
      if (this.isFieldSelected("Altitude")) {
        fields.push(
          `<field name='Altitude' value='${Math.floor(
            Math.random() * 120000
          )}'/>`
        );
      }
    }
    return fields.join("\n    ");
  }

  downloadXML(content, filename) {
    const blob = new Blob([content], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  generateScenario() {
    const numTracks = parseInt(document.getElementById("numTracks").value);
    const lat = parseFloat(document.getElementById("latitude").value);
    const lon = parseFloat(document.getElementById("longitude").value);
    const delay = parseInt(document.getElementById("delay").value);
    const trackBlock = this.generateTrackCode(numTracks, delay, lat, lon);

    const scenarioTemplate = `<?xml version="1.0"?>
<scenario>
    <definestring name="Interface" value="C2 HOST"/>
    <definestring name="Air" value="12"/>
    <definestring name="Land" value="48"/>
    <definestring name="Surface" value="12"/>
    <definestring name="SubSurface" value="12"/>
    <definestring name="Space" value="12"/>
    <definestring name="Reference_Point" value="12"/>
    <definestring name="EW" value="12"/>
    <definestring name="Unit" value="12"/>
    <profile name="TOAD_J-Series_Air" tracktype="TOAD_J-Series_Air" interface="C2 HOST" defaultTurnRate="180" defaultClimbRate="1000" defaultDescentRate="500" defaultAccelerationRate="2.6" defaultDecelerationRate="2" updateInterval="12"/>
    <profile name="TOAD_J-Series_EW" tracktype="TOAD_J-Series_EW" interface="C2 HOST" defaultTurnRate="180" defaultClimbRate="1000" defaultDescentRate="500" defaultAccelerationRate="2.6" defaultDecelerationRate="2" updateInterval="12"/>
    <profile name="TOAD_J-Series_Land" tracktype="TOAD_J-Series_Land" interface="C2 HOST" defaultTurnRate="180" defaultClimbRate="1000" defaultDescentRate="500" defaultAccelerationRate="2.6" defaultDecelerationRate="2" updateInterval="48"/>
    <profile name="TOAD_J-Series_Reference_Point" tracktype="TOAD_J-Series_Reference_Point" interface="C2 HOST" defaultTurnRate="180" defaultClimbRate="1000" defaultDescentRate="500" defaultAccelerationRate="2.6" defaultDecelerationRate="2" updateInterval="12"/>
    <profile name="TOAD_J-Series_Space" tracktype="TOAD_J-Series_Space" interface="C2 HOST" defaultTurnRate="180" defaultClimbRate="1000" defaultDescentRate="500" defaultAccelerationRate="2.6" defaultDecelerationRate="2" updateInterval="12"/>
    <profile name="TOAD_J-Series_Surface" tracktype="TOAD_J-Series_Surface" interface="C2 HOST" defaultTurnRate="180" defaultClimbRate="1000" defaultDescentRate="500" defaultAccelerationRate="2.6" defaultDecelerationRate="2" updateInterval="12"/>
    <profile name="TOAD_J-Series_SubSurface" tracktype="TOAD_J-Series_SubSurface" interface="C2 HOST" defaultTurnRate="180" defaultClimbRate="1000" defaultDescentRate="500" defaultAccelerationRate="2.6" defaultDecelerationRate="2" updateInterval="12"/>
    <profile name="TOAD_J-Series_Unit" tracktype="TOAD_J-Series_Unit" interface="C2 HOST" defaultTurnRate="180" defaultClimbRate="1000" defaultDescentRate="500" defaultAccelerationRate="2.6" defaultDecelerationRate="2" updateInterval="12"/>
    <body>
        ${trackBlock}
    </body>
</scenario>`;


    const cleanXML = scenarioTemplate
      .replace(/    <field name='' value=''>\n/g, "");

    this.downloadXML(cleanXML, `${numTracks} Track TacView Scenario.xml`);
  }
}
const generator = new TrackGenerator();

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("profileSelector")) {
    generator.initializeProfileSelector();
  }

  const generateButton = document.getElementById("generateButton");
  if (generateButton) {
    generateButton.addEventListener("click", () => {
      generator.generateScenario();
    });
  } else {
    console.error("Generate button not found! Check HTML ID");
  }
});