const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

const SCRIPTS = [
  {
    filenameBase: '01_the_ancestral_deed',
    title: 'THE ANCESTRAL DEED',
    author: 'Screenplay Adaptation Studio Test Suite',
    genre: 'Agrarian Family Drama / Debt Conflict',
    region: 'Punjab (Majhi / Malwa Context)',
    characters: 'AMAR (32), MOTHER / BEBE (62), KABIR (24), POSTMAN (52)',
    logline: 'When an eviction notice threatens a multi-generational homestead, the elder brother hides the debt while the ambitious younger brother demands to sell his share.',
    scenes: [
      {
        heading: 'SCENE 1: EXT. HOMESTEAD COURTYARD - EARLY MORNING',
        blocks: [
          { type: 'action', text: 'A heavy mist clings to the brick walls of the courtyard. A solitary wooden cot rests near the boundary wall.' },
          { type: 'action', text: 'AMAR (32), weathered beyond his years with dirt under his fingernails, sits on the edge of the cot lacing his worn leather shoes.' },
          { type: 'action', text: 'A POSTMAN enters through the creaking iron gate on an old bicycle. He leans the cycle against the wall and pulls a thick, red-stamped sealed envelope from his leather satchel.' },
          { type: 'character', text: 'POSTMAN' },
          { type: 'dialogue', text: 'Notice for the family of late Harjit Singh. Needs a signature.' },
          { type: 'action', text: 'Amar rises quickly, eyes darting toward the inner verandah.' },
          { type: 'character', text: 'AMAR' },
          { type: 'parenthetical', text: '(hushed)' },
          { type: 'dialogue', text: "Give it here. Don't shout." },
          { type: 'action', text: 'Amar signs the postman\'s slip with a stubby pencil. The postman nods and pedals away.\n\nAmar turns the letter over. The red seal reads: "DEBT LIQUIDATION TRIBUNAL - FINAL DEMAND". His breath catches. His hands tremble as he slips the envelope deep into his coat pocket.' },
          { type: 'action', text: 'Behind him, MOTHER (60), frail but with piercing, watchful eyes, steps out onto the threshold holding a brass cup of warm milk.' },
          { type: 'character', text: 'MOTHER' },
          { type: 'dialogue', text: 'Who was at the gate at dawn, Amar?' },
          { type: 'character', text: 'AMAR' },
          { type: 'parenthetical', text: '(forcing a calm smile)' },
          { type: 'dialogue', text: 'Just the water inspector, Mother. Checking the canal roster. Nothing for you to worry about.' },
          { type: 'action', text: 'She stares at his closed coat pocket. Her eyes narrow, but she says nothing.' }
        ]
      },
      {
        heading: 'SCENE 2: INT. FAMILY HEARTH & KITCHEN - AFTERNOON',
        blocks: [
          { type: 'action', text: 'Sunlight slants through smoke drifting from a clay stove. Utensils clink on low shelves.' },
          { type: 'action', text: 'KABIR (24), dressed in clean, modern denim and sleek leather jacket, sits impatiently on a low wooden stool, scrolling through his phone.' },
          { type: 'action', text: 'Mother stirs lentils in a black iron pan.\n\nThe door creaks open. The elder son, Amar, enters carrying a bundle of dry firewood. He leans the wood against the hearth. His coat is draped over his arm, the red-stamped letter still lodged in the inner lining.' },
          { type: 'character', text: 'KABIR' },
          { type: 'dialogue', text: 'You took your time, elder brother. I have a bus to catch to the provincial capital at five.' },
          { type: 'character', text: 'AMAR' },
          { type: 'dialogue', text: 'The canal silt took three hours to shovel. Sit and eat first, Kabir.' },
          { type: 'character', text: 'KABIR' },
          { type: 'dialogue', text: 'I didn\'t travel six hundred kilometers to eat lentils, Amar. The agent in the city needs the property papers signed by noon tomorrow. If we sell the eastern two acres, my overseas visa is cleared.' },
          { type: 'action', text: 'Mother stops stirring. The wooden ladle hangs still in her hand.' },
          { type: 'character', text: 'MOTHER' },
          { type: 'dialogue', text: 'The eastern parcel was cleared by your grandfather\'s hands before either of you drew breath. It stays with the hearth.' },
          { type: 'character', text: 'KABIR' },
          { type: 'parenthetical', text: '(agitated)' },
          { type: 'dialogue', text: 'Grandfather is gone! This soil pays nothing! Amar, give me the registry ledger from the iron trunk. You promised we would divide fairly.' },
          { type: 'action', text: 'Amar clutches his coat tightly to his ribs, feeling the sharp corners of the eviction letter.' },
          { type: 'character', text: 'AMAR' },
          { type: 'parenthetical', text: '(low, strained)' },
          { type: 'dialogue', text: 'We don\'t sell this month, Kabir. The market is low. Wait until harvest.' },
          { type: 'character', text: 'KABIR' },
          { type: 'dialogue', text: 'You always stall! You want to keep me tethered to this mud just because you gave up on your own life!' },
          { type: 'action', text: 'Kabir kicks the stool back and storms toward the inner corridor.' }
        ]
      },
      {
        heading: 'SCENE 3: EXT. THE DRY CANAL & ANCESTRAL GROVE - SUNSET',
        blocks: [
          { type: 'action', text: 'The golden evening light bathes an old banyan tree by the dry irrigation canal.\n\nAmar stands near the tree, staring at the cracked earth.\n\nFootsteps crunch on dry leaves. Kabir approaches, duffel bag slung over his shoulder, ready to abandon the homestead.' },
          { type: 'character', text: 'KABIR' },
          { type: 'dialogue', text: 'Tell me where Father kept the land deed, Amar. Or I swear by Mother, I will file for partition in court on Monday.' },
          { type: 'action', text: 'Amar doesn\'t turn around. Slowly, he reaches into his coat pocket and pulls out the crumpled, red-stamped letter. He turns and extends it toward his younger brother.' },
          { type: 'character', text: 'AMAR' },
          { type: 'dialogue', text: 'Take it. Read what your half of the land is worth.' },
          { type: 'action', text: 'Kabir snatches the paper with an indignant scoff. As his eyes scan the legal seals and the colossal debt figure accrued over seven years of hospital loans, his face drains of color.' },
          { type: 'character', text: 'KABIR' },
          { type: 'parenthetical', text: '(whispering)' },
          { type: 'dialogue', text: 'Thirty-four lakhs? Since when?' },
          { type: 'character', text: 'AMAR' },
          { type: 'dialogue', text: 'Since Father lay in the intensive care ward for fourteen months. I paid the interest by pawning my wedding ring and taking third-shift transport contracts.' },
          { type: 'action', text: 'Kabir looks from the letter to Amar\'s calloused hands, then to his worn-out shoes.' },
          { type: 'character', text: 'KABIR' },
          { type: 'dialogue', text: 'Why did you carry this alone? You made me look like a thief in front of Mother.' },
          { type: 'character', text: 'AMAR' },
          { type: 'dialogue', text: 'Because you were supposed to be the one who flew, Kabir. If Mother knew the house was mortgaged, her heart would stop before nightfall.' },
          { type: 'action', text: 'The two brothers stand in the quiet twilight. The wind rustles through the dry leaves. Kabir slowly folds the paper, but this time, he tucks it into his own chest pocket.' },
          { type: 'character', text: 'KABIR' },
          { type: 'dialogue', text: 'We sell nothing. Call the transport depot. I am not boarding that bus tonight.' }
        ]
      }
    ]
  },
  {
    filenameBase: '02_the_stolen_dowry_trunk',
    title: 'THE STOLEN DOWRY TRUNK',
    author: 'Screenplay Adaptation Studio Test Suite',
    genre: 'Wedding & Clan Honor Drama',
    region: 'Haryana / Western UP (Haryanvi / Khari Boli Context)',
    characters: 'MEERA (21), VIKRAM (27), UNCLE RAJAN (55)',
    logline: 'On the eve of her arranged wedding, a fiercely educated village girl conceals a government appointment letter inside the ancestral dowry trunk, confronting her authoritarian uncle.',
    scenes: [
      {
        heading: 'SCENE 1: INT. ANCESTRAL STORE ROOM - MORNING',
        blocks: [
          { type: 'action', text: 'Sunlight filters through iron grates onto stacked brass pots and heavy grain bins.\n\nMEERA (21), slender, wearing an unstitched embroidered bridal lehenga, kneels before a massive iron-bound wooden trunk.' },
          { type: 'action', text: 'Her hands tremble as she slips a sealed document into the silk folds at the bottom of the trunk. The envelope header reads: "UNION MEDICAL RECRUITMENT BOARD - OFFICER SELECTION".' },
          { type: 'action', text: 'Footsteps approach. VIKRAM (27), her cousin and childhood confidant, enters holding a velvet jewelry case.' },
          { type: 'character', text: 'VIKRAM' },
          { type: 'dialogue', text: 'The goldsmith delivered the necklace, Meera. Uncle Rajan wants you to wear it for the welcoming feast.' },
          { type: 'action', text: 'Meera snaps the heavy trunk lid shut. The brass latch rings sharply.' },
          { type: 'character', text: 'MEERA' },
          { type: 'dialogue', text: 'Tell Uncle to keep his gold in his safe. I won\'t wear chains disguised as gifts.' },
          { type: 'character', text: 'VIKRAM' },
          { type: 'parenthetical', text: '(stepping closer, noticing the latch)' },
          { type: 'dialogue', text: 'What did you just hide in the dowry chest? If Uncle finds out you wrote the civil exam in secret, he will disown both of us before the wedding party arrives.' },
          { type: 'character', text: 'MEERA' },
          { type: 'dialogue', text: 'Let him. My mother died laboring in his cotton gin. I won\'t spend my life scrubbing brass pots in a stranger\'s courtyard just to satisfy his clan pride.' },
          { type: 'action', text: 'Vikram looks at the closed trunk, torn between fraternal loyalty and fear of their patriarch.' }
        ]
      },
      {
        heading: 'SCENE 2: EXT. WEDDING MANDAP & COURTYARD - AFTERNOON',
        blocks: [
          { type: 'action', text: 'Marigold garlands sway in the dry afternoon breeze. Male elders sit on cushioned bolsters smoking hookah.\n\nUNCLE RAJAN (55), barrel-chested, wearing an ornate silk turban and gold rings on four fingers, laughs loudly as he presents the keys of a tractor to the groom\'s father.' },
          { type: 'character', text: 'UNCLE RAJAN' },
          { type: 'dialogue', text: 'In our clan, daughters leave the threshold like queens! Fifty tolas of gold and the latest diesel tractor. That is the honor of our lineage!' },
          { type: 'action', text: 'Vikram stands by the pillar, hands clenched, watching Meera emerge from the inner corridor without the ceremonial jewelry. A murmur ripples through the seated village elders.' },
          { type: 'character', text: 'UNCLE RAJAN' },
          { type: 'parenthetical', text: '(voice hardening beneath a forced grin)' },
          { type: 'dialogue', text: 'Meera. Where is the heirloom gold necklace your aunt placed in your dowry trunk this morning?' },
          { type: 'character', text: 'MEERA' },
          { type: 'dialogue', text: 'The necklace is in the trunk, Uncle. Alongside the deed of debt you forced my father to sign on his deathbed.' },
          { type: 'action', text: 'The courtyard falls dead silent. The groom\'s family freezes. Rajan takes a threatening step toward her.' },
          { type: 'character', text: 'UNCLE RAJAN' },
          { type: 'dialogue', text: 'You insolent girl! You speak like an unbridled stray in front of thirty clans! Go inside before I forget who brought you up!' }
        ]
      },
      {
        heading: 'SCENE 3: INT. INNER CEREMONIAL BAITHAK - SUNSET',
        blocks: [
          { type: 'action', text: 'The red twilight casts long shadows across the ceremonial carpet.\n\nUncle Rajan stands over Meera, his arm raised in fury. The heavy brass trunk sits open between them on the floor, its silk lining disturbed.' },
          { type: 'character', text: 'UNCLE RAJAN' },
          { type: 'dialogue', text: 'You dare humiliate this house?! You will sign the marriage registry tonight or I will swear by the clan deity you never step foot in this village again!' },
          { type: 'action', text: 'Before his hand can strike, Vikram steps directly between them, his hand gripping his uncle\'s wrist with iron strength.' },
          { type: 'character', text: 'VIKRAM' },
          { type: 'dialogue', text: 'That\'s enough, Uncle.' },
          { type: 'character', text: 'UNCLE RAJAN' },
          { type: 'parenthetical', text: '(shocked, eyes bulging)' },
          { type: 'dialogue', text: 'Vikram? You raise your hand against the head of the house? For an ungrateful girl?' },
          { type: 'character', text: 'VIKRAM' },
          { type: 'dialogue', text: 'I am raising my hand for my sister. Look at what is inside that trunk, Uncle.' },
          { type: 'action', text: 'Meera pulls the government appointment order from the trunk and holds it up into the fading sunset light.' },
          { type: 'character', text: 'MEERA' },
          { type: 'dialogue', text: 'First rank in the state medical council, Uncle. The Chief Magistrate signs my posting in the capital on Monday. I do not need your fifty tolas of gold to exist.' },
          { type: 'action', text: 'Uncle Rajan stares at the official government crest. The patriarchal authority dissolves from his face. Vikram takes Meera\'s duffel bag from behind the pillar.' },
          { type: 'character', text: 'VIKRAM' },
          { type: 'dialogue', text: 'The car is at the canal road, Meera. You are going to the city.' }
        ]
      }
    ]
  },
  {
    filenameBase: '03_the_drought_well',
    title: 'THE DROUGHT WELL',
    author: 'Screenplay Adaptation Studio Test Suite',
    genre: 'Resource Conflict & Moral Thriller',
    region: 'Bundelkhand / Central India (Bhojpuri / Bundeli / Malwi Context)',
    characters: 'DEV (34), CHAUDHARY BALWANT (58), DR. ANANYA (28)',
    logline: 'During the worst summer drought in thirty years, an honest well operator discovers the village chieftain has chained the sole potable well to divert water to his private bottling plant.',
    scenes: [
      {
        heading: 'SCENE 1: EXT. THE DRY COMMONS WELL - NOON',
        blocks: [
          { type: 'action', text: 'A scorching sun beats down on cracked white earth. The air shimmers with mirages. A crowd of thirty parched villagers with empty brass lotas wait in the dust.' },
          { type: 'action', text: 'The deep community borewell sits inside a padlocked iron cage. A heavy forged brass padlock clamps the main discharge valve.' },
          { type: 'action', text: 'DEV (34), a lean mechanic with grease on his forearms and sweat stinging his eyes, adjusts a pressure gauge on the pump housing.\n\nCHAUDHARY BALWANT (58), dressed in crisp white linen, wearing dark sunglasses and holding a heavy silver-tipped bamboo cane, leans against a luxury SUV parked under the only shade tree.' },
          { type: 'character', text: 'BALWANT' },
          { type: 'dialogue', text: 'Tell them the aquifer is dry, Dev. If they panic, they will break the machinery.' },
          { type: 'character', text: 'DEV' },
          { type: 'parenthetical', text: '(low, looking at the crying children in line)' },
          { type: 'dialogue', text: 'The water table is fine, Chaudhary. The pressure gauge reads four hundred PSI. Why are you chaining the public tap?' },
          { type: 'character', text: 'BALWANT' },
          { type: 'dialogue', text: 'Because fifty tankers are contracted to the industrial corridor by midnight. The government pays thirty thousand per tanker. Hand me the key to the master valve.' },
          { type: 'action', text: 'Dev hesitates, feeling the heavy forged iron wrench in his leather tool belt.' },
          { type: 'character', text: 'BALWANT' },
          { type: 'parenthetical', text: '(leaning in, tapping Dev\'s chest with his cane)' },
          { type: 'dialogue', text: 'Remember who paid your sister\'s hospital bail, mechanic. Give me the key.' },
          { type: 'action', text: 'Dev looks away, slowly handing the brass key to the landlord. Balwant locks the cage and drives off in a plume of white dust.' }
        ]
      },
      {
        heading: 'SCENE 2: INT. COMMUNITY CLINIC & LABORATORY - DUSK',
        blocks: [
          { type: 'action', text: 'Flickering tube lights hum. Plastic saline bottles hang from rusty stands.\n\nANANYA (28), a young doctor with ink-stained fingers and tired eyes, examines three test tubes holding murky brown water.\n\nDev knocks on the wire-mesh door and enters, wiping his grease-stained hands on a rag.' },
          { type: 'character', text: 'ANANYA' },
          { type: 'dialogue', text: 'Seven more cholera admissions from the lower hamlet in three hours, Dev. What water did you release from the canal today?' },
          { type: 'character', text: 'DEV' },
          { type: 'dialogue', text: 'The canal is stagnant mud, Doctor. Chaudhary locked the sweet-water deep well. He\'s piping twenty thousand liters an hour to the industrial estate.' },
          { type: 'character', text: 'ANANYA' },
          { type: 'parenthetical', text: '(slamming her clipboard down)' },
          { type: 'dialogue', text: 'The water in the lower hamlet well has three times the permissible arsenic level! It\'s poisoning them! If they don\'t get deep-bore sweet water tonight, three elders won\'t survive till sunrise.' },
          { type: 'character', text: 'DEV' },
          { type: 'dialogue', text: 'Balwant has armed guards at the gate. If I touch that padlock, he will claim theft and the police will lock me away for ten years.' },
          { type: 'character', text: 'ANANYA' },
          { type: 'parenthetical', text: '(pointing to an unconscious child on the cot)' },
          { type: 'dialogue', text: 'Look at that child, Dev. That is your cousin\'s daughter. Are you a mechanic for machines, or a mechanic for people?' },
          { type: 'action', text: 'Dev stares at the child\'s feverish face. His hand slowly tightens around the iron wrench in his pocket.' }
        ]
      },
      {
        heading: 'SCENE 3: EXT. THE RESERVOIR & PUMP HOUSE - MIDNIGHT',
        blocks: [
          { type: 'action', text: 'Silver moonlight turns the water tank into a looming monolith. Crickets chirp in the dry thorn bushes.\n\nDev sneaks through the perimeter wire, gripping his heavy thirty-six-inch iron pipe wrench.\n\nHe reaches the cage. He slots the wrench jaws over the forged brass padlock. He braces his boots against the steel mesh and puts his entire body weight into the lever.\n\nCREAK. The iron shudders.\n\nA harsh spotlight blazes to life.\n\nBalwant stands twenty paces away, flanked by two burly henchmen carrying wooden lathis.' },
          { type: 'character', text: 'BALWANT' },
          { type: 'dialogue', text: 'Step away from the valve, Dev. I thought you were smarter than your father.' },
          { type: 'character', text: 'DEV' },
          { type: 'dialogue', text: 'My father died drinking canal silt while your grandfather grew sugarcane, Chaudhary. Not tonight.' },
          { type: 'character', text: 'BALWANT' },
          { type: 'parenthetical', text: '(signaling his men)' },
          { type: 'dialogue', text: 'Break his knees. Throw him in the dry ditch.' },
          { type: 'action', text: 'The guards step forward. Dev doesn\'t run. With a thunderous grunt, he throws his full weight onto the wrench handle.\n\nSNAP! The forged brass padlock fractures in two.\n\nDev yanks the high-pressure lever.\n\nA deafening roar echoes through the valley. Pressurized, crystal-clear cold water erupts from the main relief sluice, gushing down the dry stone channel toward the village below.\n\nIn the distance, church bells and shouts of joy rise from the village as water reaches the homesteads.\n\nDev stands drenched in the gushing torrent, meeting Balwant\'s furious gaze with quiet, unbreakable resolve.' },
          { type: 'character', text: 'DEV' },
          { type: 'dialogue', text: 'Call the police, Chaudhary. Let them come see the water.' }
        ]
      }
    ]
  }
];

// Helper to convert structured script into clean text
function scriptToText(s) {
  let out = `${s.title}\nGenre: ${s.genre}\nSetting / Dialect: ${s.region}\nCharacters: ${s.characters}\nLogline: ${s.logline}\n\n`;
  out += '======================================================================\n\n';

  s.scenes.forEach(sc => {
    out += `${sc.heading}\n\n`;
    sc.blocks.forEach(b => {
      if (b.type === 'action') {
        out += `${b.text}\n\n`;
      } else if (b.type === 'character') {
        out += `${b.text}\n`;
      } else if (b.type === 'parenthetical') {
        out += `${b.text}\n`;
      } else if (b.type === 'dialogue') {
        out += `${b.text}\n\n`;
      }
    });
    out += '\n';
  });

  return out.trim();
}

// Helper to generate standardized PDF with jsPDF
function generatePdf(s, outputPath) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter'
  });

  const pageHeight = 792;
  const topMargin = 72;
  const bottomMargin = 72;
  let y = topMargin;

  // Title Page / Header
  doc.setFont('courier', 'bold');
  doc.setFontSize(16);
  doc.text(s.title, 306, y, { align: 'center' });
  y += 24;

  doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  doc.text(`Genre: ${s.genre}`, 306, y, { align: 'center' });
  y += 14;
  doc.text(`Cultural Context: ${s.region}`, 306, y, { align: 'center' });
  y += 14;
  doc.text(`Characters: ${s.characters}`, 306, y, { align: 'center' });
  y += 22;

  doc.setLineWidth(0.5);
  doc.line(72, y, 540, y);
  y += 24;

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = topMargin;
    }
  };

  s.scenes.forEach((sc, scIdx) => {
    checkPageBreak(40);
    if (scIdx > 0) y += 12;

    // Scene Heading (Bold, Uppercase)
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.text(sc.heading, 72, y);
    y += 18;

    sc.blocks.forEach(b => {
      doc.setFont('courier', 'normal');
      doc.setFontSize(10);

      if (b.type === 'action') {
        const lines = doc.splitTextToSize(b.text, 468); // 72 to 540
        checkPageBreak(lines.length * 13 + 10);
        doc.text(lines, 72, y);
        y += lines.length * 13 + 10;
      } else if (b.type === 'character') {
        checkPageBreak(35);
        doc.setFont('courier', 'bold');
        doc.text(b.text, 252, y); // Industry centered indentation
        y += 13;
      } else if (b.type === 'parenthetical') {
        checkPageBreak(25);
        doc.setFont('courier', 'italic');
        doc.text(b.text, 216, y);
        y += 12;
      } else if (b.type === 'dialogue') {
        const lines = doc.splitTextToSize(b.text, 270); // Industry dialogue block width (180 to 450)
        checkPageBreak(lines.length * 13 + 12);
        doc.setFont('courier', 'normal');
        doc.text(lines, 180, y);
        y += lines.length * 13 + 12;
      }
    });
  });

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, pdfBuffer);
}

// Target directories
const targetDirs = [
  path.join(__dirname, '..', 'test_scripts'),
  path.join(__dirname, '..', 'public', 'test_scripts'),
  path.join(__dirname, '..', 'sample_output', 'test_scripts')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Generating 3 distinct test scripts in TXT and PDF formats...');

SCRIPTS.forEach((s, idx) => {
  const rawText = scriptToText(s);

  targetDirs.forEach(dir => {
    // 1. Text File (.txt)
    const txtPath = path.join(dir, `${s.filenameBase}.txt`);
    fs.writeFileSync(txtPath, rawText, 'utf8');

    // 2. PDF File (.pdf)
    const pdfPath = path.join(dir, `${s.filenameBase}.pdf`);
    generatePdf(s, pdfPath);
  });

  console.log(`✓ Script ${idx + 1} generated: ${s.title} (${s.genre})`);
});

// Also create a README in test_scripts
const readmeContent = `# Test Screenplay Scripts Suite

This directory contains 3 distinct, multi-scene high-stakes screenplays designed for end-to-end testing of the **Cultural Screenplay & Visual Adaptation Studio**.

## 1. 01_the_ancestral_deed (TXT & PDF)
- **Genre**: Agrarian Family Drama & Debt Conflict
- **Target Dialects**: Punjabi (Majhi / Malwa), Haryanvi, Bagri Rajasthani
- **Key Characters**: Amar (stoic elder son), Kabir (ambitious city-bound younger brother), Mother / Bebe (matriarch), Postman
- **Key Props**: Red-stamped Debt Liquidation Tribunal eviction envelope, warm brass milk kaansa, dry firewood bundle, urban travel duffel
- **Continuity Test**: Verifies the eviction letter remains concealed across Scenes 1, 2, and 3 until the dramatic reveal at the banyan tree.

## 2. 02_the_stolen_dowry_trunk (TXT & PDF)
- **Genre**: Wedding, Clan Honor & Female Agency Thriller
- **Target Dialects**: Haryanvi, Khari Boli, Rajasthani (Marwari), Awadhi
- **Key Characters**: Meera (first-rank medical recruit defying arranged dowry), Vikram (protective cousin), Uncle Rajan (clan patriarch)
- **Key Props**: Ancestral iron dowry trunk, Union Medical Selection letter, 50-tola gold heirloom necklace, father's debt promissory note
- **Continuity Test**: Verifies the trunk remains locked with hidden exam letter in Scene 1, opened at the mandap in Scene 2, and unveiled in Scene 3.

## 3. 03_the_drought_well (TXT & PDF)
- **Genre**: Resource Conflict & Moral Environmental Thriller
- **Target Dialects**: Bundeli, Bhojpuri (Bhojpur/Rohtas), Malwi, Eastern Hindi
- **Key Characters**: Dev (honest borewell operator), Chaudhary Balwant (private water tanker baron), Dr. Ananya (community clinic doctor)
- **Key Props**: Heavy 36-inch cast iron pipe wrench, brass padlock key, contaminated arsenic water test tubes, padlocked aquifer valve
- **Continuity Test**: Tracks the master padlock key handed over under coercion in Scene 1, moral confrontation in Scene 2, and the physical padlock snapping by wrench in Scene 3.

### How to Test in the Studio:
1. Open the Studio web app at http://localhost:3000
2. Click **"Upload PDF / TXT"** on Stage 1.
3. Select any of the \`.pdf\` or \`.txt\` files from \`d:\\projects\\assignment3\\test_scripts\\\`.
4. Observe automatic document parsing, entity normalization, costume assignment, and cross-scene continuity validation!
`;

fs.writeFileSync(path.join(__dirname, '..', 'test_scripts', 'README.md'), readmeContent, 'utf8');
console.log('✓ Created test_scripts/README.md documentation');
