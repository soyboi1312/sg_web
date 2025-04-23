class TrackGenerator {
    constructor() {
        // Initialize all data arrays
        this.trackProfile = [
            "TOAD_J-Series_Reference_Point",
            "TOAD_J-Series_Air",
            "TOAD_J-Series_Land",
            "TOAD_J-Series_Surface",
            "TOAD_J-Series_SubSurface",
            "TOAD_J-Series_Space",
            "TOAD_J-Series_EW"
        ];

        this.airPlatform = ["N.S.", "Fighter", /*...*/];
        this.callsignList = ["N.S.", "Soy Boi", "9 Lives", /*...*/];
        this.ewEnvironment = ["Air", "Land", "Surface", "Subsurface", "Space"];
        // Add all other data arrays from Python code here...
    }

    getRandomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    generateTrackCode(nTracks, delaySecs, startLat, startLon) {
        let trackLines = [];
        let latOffset = 0;
        let longOffset = 0;
        const lineLength = 1000;

        for (let i = 0; i < nTracks; i++) {
            const lat = startLat + latOffset;
            const lon = startLon + longOffset;

            // Calculate position offsets
            longOffset += 0.02;
            if (i % lineLength === 0 && i !== 0) {
                longOffset = 0.1;
                latOffset += 0.1;
            }

            // Generate track parameters
            const trackNumber = (512 + i).toString(8).slice(1);
            const profile = this.getRandomChoice(this.trackProfile);

            // Generate XML template with parameters
            const trackEntry = `
<createtrack name='${trackNumber}' profile='${profile}'>
    <field name='${this.getCallsignName(profile)}' value='${this.getCallsign(profile)}'/>
    <field name='Latitude' value='${lat.toFixed(6)}'/>
    <field name='Longitude' value='${lon.toFixed(6)}'/>
    ${this.generateProfileFields(profile, trackNumber, i)}
</createtrack>
<wait seconds="${delaySecs}"/>`;

            trackLines.push(trackEntry);
        }
        return trackLines.join('\n');
    }

    generateProfileFields(profile, trackNumber, index) {
        // Implement field generation logic based on profile
        let fields = [];

        // Example field generation - expand with all fields from Python code
        fields.push(`<field name='Track Label' value='${trackNumber}'/>`);

        if (profile === 'TOAD_J-Series_Air') {
            fields.push(`<field name='Altitude' value='${Math.floor(Math.random() * 204750)}'/>`);
            fields.push(`<field name='Callsign' value='${this.getRandomChoice(this.callsignList)}'/>`);
        }
        // Add other profile-specific fields...

        return fields.join('\n    ');
    }

    downloadXML(content, filename) {
        const blob = new Blob([content], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    generateScenario() {
        const numTracks = parseInt(document.getElementById('numTracks').value);
        const lat = parseFloat(document.getElementById('latitude').value);
        const lon = parseFloat(document.getElementById('longitude').value);
        const delay = parseInt(document.getElementById('delay').value);

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
        <wait seconds="86400"/>
    </body>
</scenario>`;

        // Clean XML
        const cleanXML = scenarioTemplate
            .replace(/    <field name='' value=''>\n/g, '')
            .replace(/00000000000/g, '');

        this.downloadXML(cleanXML, `${numTracks}_TacView_All_Tracks.xml`);
    }
}

const generator = new TrackGenerator();

// Helper function for HTML interaction
function generateScenario() {
    generator.generateScenario();
}