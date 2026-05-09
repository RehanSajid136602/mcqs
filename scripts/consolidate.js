// CAVEMAN: large script. read only the function relevant to task.
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "data.json");

const raw = readFileSync(DATA_PATH, "utf-8");
const data = JSON.parse(raw);

const physics = {
  id: "physics",
  name: "Physics",
  icon: "Atom",
  chapters: [
    {
      id: "chapter-15-gravitation",
      name: "Chapter 15: Gravitation",
      sets: [
        {
          id: "chapter-15-gravitation-set-1",
          label: "Set 1",
          questions: [
            { q: "What is the value of acceleration due to gravity $g$ on Earth's surface?", options: ["8.9 m/s²", "9.8 m/s²", "10.2 m/s²", "11.0 m/s²"], correct: 1 },
            { q: "According to Newton's law of gravitation, the force is proportional to:", options: ["$F \\propto r$", "$F \\propto \\frac{1}{r^2}$", "$F \\propto r^2$", "$F \\propto \\frac{1}{r}$"], correct: 1 },
            { q: "The value of gravitational constant $G$ is:", options: ["$6.67 \\times 10^{-11}$ N m²/kg²", "$6.67 \\times 10^{-11}$ N m/kg²", "$9.8 \\times 10^{-11}$ N m²/kg²", "$6.67 \\times 10^{11}$ N m²/kg²"], correct: 0 },
            { q: "If the distance between two masses is doubled, the gravitational force becomes:", options: ["Half", "Double", "One-fourth", "Four times"], correct: 2 },
            { q: "The value of $g$ at the surface of Earth is approximately:", options: ["$8.9 \\text{ m/s}^2$", "$9.8 \\text{ m/s}^2$", "$10.8 \\text{ m/s}^2$", "$11.2 \\text{ m/s}^2$"], correct: 1 },
            { q: "The orbital velocity of a satellite just above Earth's surface is about:", options: ["$5 \\text{ km/s}$", "$7.9 \\text{ km/s}$", "$11.2 \\text{ km/s}$", "$3 \\text{ km/s}$"], correct: 1 },
            { q: "A geostationary satellite has an orbital period of:", options: ["12 hours", "24 hours", "48 hours", "90 minutes"], correct: 1 },
            { q: "The height of a geostationary satellite above Earth's surface is approximately:", options: ["$1.6 \\times 10^4 \\text{ km}$", "$3.6 \\times 10^4 \\text{ km}$", "$4.23 \\times 10^4 \\text{ km}$", "$6.4 \\times 10^3 \\text{ km}$"], correct: 1 },
            { q: "Gravitational potential at a point is:", options: ["Force per unit mass", "Energy per unit mass", "Force per unit area", "Energy per unit volume"], correct: 1 },
            { q: "The gravitational potential energy of two masses $m_1$ and $m_2$ separated by distance $r$ is:", options: ["$U = +\\frac{Gm_1m_2}{r}$", "$U = -\\frac{Gm_1m_2}{r}$", "$U = \\frac{Gm_1m_2}{r^2}$", "$U = -\\frac{Gm_1m_2}{r^2}$"], correct: 1 },
            { q: "As altitude increases, the value of $g$:", options: ["Increases", "Decreases", "Remains constant", "First increases then decreases"], correct: 1 },
            { q: "Newton's law of gravitation applies to:", options: ["Only objects on Earth", "Only celestial bodies", "All objects in the universe", "Only charged particles"], correct: 2 },
          ]
        },
        {
          id: "chapter-15-gravitation-set-2",
          label: "Set 2",
          questions: [
            { q: "Two bodies of masses 45 kg and 50 kg are 1 m apart. The gravitational force between them is:", options: ["$1.5 \\times 10^{-7}$ N", "$1.5 \\times 10^{7}$ N", "$3.0 \\times 10^{-7}$ N", "$1.5 \\times 10^{-9}$ N"], correct: 0 },
            { q: "The mass of Earth is $6 \\times 10^{24}$ kg and radius is $6.4 \\times 10^6$ m. The value of $g$ at a height of 3600 km above Earth's surface is:", options: ["$4.9 \\text{ m/s}^2$", "$9.8 \\text{ m/s}^2$", "$6.4 \\text{ m/s}^2$", "$5.6 \\text{ m/s}^2$"], correct: 0 },
            { q: "The orbital speed of Earth around the Sun is about:", options: ["$15 \\text{ km/s}$", "$30 \\text{ km/s}$", "$45 \\text{ km/s}$", "$60 \\text{ km/s}$"], correct: 1 },
            { q: "If the mass of a planet is doubled and its radius remains same, the value of $g$ on its surface becomes:", options: ["Half", "Double", "Four times", "Same"], correct: 1 },
            { q: "The gravitational potential energy of a body is negative because:", options: ["Gravity is attractive", "Gravity is repulsive", "Work is done against gravity", "Energy is always conserved"], correct: 0 },
            { q: "The orbital velocity of ISS at 400 km altitude is about:", options: ["$5.6 \\text{ km/s}$", "$7.66 \\text{ km/s}$", "$9.8 \\text{ km/s}$", "$11.2 \\text{ km/s}$"], correct: 1 },
            { q: "The minimum number of geostationary satellites needed for global communication coverage is:", options: ["1", "2", "3", "4"], correct: 2 },
            { q: "The value of $g$ on Jupiter's surface ($M_J = 1.898 \\times 10^{27}$ kg, $R_J = 7.15 \\times 10^7$ m) is approximately:", options: ["$9.8 \\text{ m/s}^2$", "$15.6 \\text{ m/s}^2$", "$24.8 \\text{ m/s}^2$", "$32.1 \\text{ m/s}^2$"], correct: 2 },
            { q: "The escape velocity from Earth's surface is:", options: ["$7.9 \\text{ km/s}$", "$9.8 \\text{ km/s}$", "$11.2 \\text{ km/s}$", "$15 \\text{ km/s}$"], correct: 2 },
            { q: "If masses of two bodies are doubled and distance is halved, gravitational force becomes:", options: ["Same", "4 times", "8 times", "16 times"], correct: 3 },
            { q: "The orbital radius of a geostationary satellite from Earth's center is about:", options: ["$2.4 \\times 10^7$ m", "$4.23 \\times 10^7$ m", "$6.4 \\times 10^7$ m", "$8.6 \\times 10^7$ m"], correct: 1 },
            { q: "At infinity, the gravitational potential is taken as:", options: ["Positive", "Negative", "Zero", "Infinite"], correct: 2 },
          ]
        },
        {
          id: "chapter-15-gravitation-set-3",
          label: "Set 3",
          questions: [
            { q: "A satellite orbits at a distance equal to twice Earth's radius from its center. Its orbital speed compared to one at Earth's surface is:", options: ["Same", "About 1.4 times less", "About 2 times less", "About 4 times less"], correct: 1 },
            { q: "The gravitational potential at 1000 km above Earth's surface is approximately:", options: ["$-62.3 \\text{ MJ/kg}$", "$-47.2 \\text{ MJ/kg}$", "$-54.1 \\text{ MJ/kg}$", "$-72.8 \\text{ MJ/kg}$"], correct: 2 },
            { q: "If Earth's radius were halved but mass remained same, the value of $g$ would become:", options: ["Half", "Double", "Four times", "Same"], correct: 2 },
            { q: "An exoplanet has 5 times Earth's mass and 2 times Earth's radius. The value of $g$ on it is:", options: ["$6.1 \\text{ m/s}^2$", "$9.8 \\text{ m/s}^2$", "$12.25 \\text{ m/s}^2$", "$24.5 \\text{ m/s}^2$"], correct: 2 },
            { q: "The gravitational potential energy of the Moon (mass $7.35 \\times 10^{22}$ kg) relative to Earth ($6 \\times 10^{24}$ kg) at distance $3.84 \\times 10^8$ m is:", options: ["$-7.4 \\times 10^{28}$ J", "$-7.4 \\times 10^{27}$ J", "$-7.4 \\times 10^{29}$ J", "$7.4 \\times 10^{28}$ J"], correct: 0 },
            { q: "Inside a uniform sphere, the gravitational field strength:", options: ["Is zero everywhere", "Increases toward the surface", "Decreases toward the surface", "Remains constant"], correct: 1 },
            { q: "The centripetal force for a satellite in circular orbit is provided by:", options: ["Its engine thrust", "Gravitational pull of Earth", "Solar radiation", "Atmospheric pressure"], correct: 1 },
            { q: "Gravitational field strength is defined as:", options: ["Force per unit area", "Force per unit mass", "Energy per unit mass", "Force per unit volume"], correct: 1 },
            { q: "For a satellite in higher orbit, its orbital velocity:", options: ["Increases", "Decreases", "Remains constant", "Becomes zero"], correct: 1 },
            { q: "The SI unit of gravitational potential is:", options: ["N/kg", "J/kg", "N m²/kg²", "J/m"], correct: 1 },
            { q: "Two point masses attract each other with force $F$. If one mass is tripled and distance is doubled, new force is:", options: ["$\\frac{3}{4}F$", "$\\frac{3}{2}F$", "$\\frac{1}{2}F$", "$\\frac{9}{4}F$"], correct: 0 },
            { q: "The gravitational field lines of a point mass are:", options: ["Parallel", "Radially inward", "Radially outward", "Circular"], correct: 1 },
          ]
        },
      ]
    }
  ]
};


const english = {
  id: "english",
  name: "English",
  icon: "BookOpen",
  chapters: [
    {
      id: "chapter-01-lingkuan-gorge",
      name: "Chapter 01: Lingkuan Gorge",
      sets: [
        {
          id: "chapter-01-lingkuan-gorge-set-1",
          label: "Set 1",
          questions: [
            { q: "What does the word 'obliterated' mean in the context of the story?", options: ["Created", "Destroyed or wiped out", "Decorated", "Illuminated"], correct: 1 },
            { q: "The narrator had been following the path of the future railway for how many kilometers?", options: ["Twenty kilometers", "Thirty kilometers", "Forty kilometers", "Fifty kilometers"], correct: 2 },
            { q: "What is the meaning of 'feverishly' as used in the story?", options: ["Slowly and carefully", "With great energy and excitement", "Lazily", "Quietly"], correct: 1 },
            { q: "What did the little boy's name 'Cheng-yu' likely refer to?", options: ["A famous mountain", "The railway project between Chengtu and Chungking", "His father's name", "The gorge name"], correct: 1 },
            { q: "What does 'criss-crossing like a spider web' describe in the gorge?", options: ["The paths", "The electric wires", "The railway tracks", "The mountain ranges"], correct: 1 },
            { q: "What was Cheng-yu's responsibility while his parents worked?", options: ["Cooking meals", "Looking after his baby sister", "Directing traffic", "Drilling holes in the cliff"], correct: 1 },
            { q: "What does the word 'discern' mean?", options: ["To hide", "To see or recognize", "To destroy", "To create"], correct: 1 },
            { q: "What job did Cheng-yu's father do?", options: ["He directed traffic", "He cooked meals", "He opened up mountains (drilling)", "He managed the depot"], correct: 2 },
            { q: "What does 'gale' mean in the story?", options: ["A type of snow", "A strong wind", "A mountain path", "A construction tool"], correct: 1 },
            { q: "Why did Cheng-yu refuse to go to sleep when advised?", options: ["He was not tired", "He said a man should never leave his post", "He was waiting for food", "He wanted to play"], correct: 1 },
            { q: "What is the main theme of 'Lingkuan Gorge'?", options: ["Adventure and exploration", "Sense of responsibility and duty", "Family conflicts", "Nature's beauty"], correct: 1 },
            { q: "What does the setting of Lingkuan Gorge symbolize in the story?", options: ["Peaceful retirement", "Harsh conditions that test character and dedication", "Tourist attraction", "Agricultural prosperity"], correct: 1 },
          ]
        },
        {
          id: "chapter-01-lingkuan-gorge-set-2",
          label: "Set 2",
          questions: [
            { q: "What is the meaning of 'scowling'?", options: ["Smiling happily", "Looking angry or in bad temper", "Crying loudly", "Sleeping peacefully"], correct: 1 },
            { q: "How deep was the snow when the narrator entered Lingkuan Gorge?", options: ["Six inches", "One foot", "Half a foot", "Two feet"], correct: 2 },
            { q: "What does 'hauled' mean in the context of the story?", options: ["Pushed gently", "Pulled with effort", "Dropped carelessly", "Threw away"], correct: 1 },
            { q: "What was the name of Cheng-yu's baby sister?", options: ["Cheng-yu", "Pao-cheng", "Mei-lin", "Su-wen"], correct: 1 },
            { q: "What does 'pulley' refer to in the story?", options: ["A type of food", "A wheel on which a rope passes to lift heavy objects", "A mountain path", "A shelter"], correct: 1 },
            { q: "What did Cheng-yu's mother do for work?", options: ["She drilled holes in cliffs", "She directed traffic by the road", "She cooked for workers", "She managed the cave"], correct: 1 },
            { q: "What is the meaning of 'ravine'?", options: ["A flat plain", "A deep, narrow valley", "A high mountain", "A wide river"], correct: 1 },
            { q: "Why did the narrator decide to rest in the cave?", options: ["He was invited by the boy", "He was hungry, cold, and had tripped and fallen", "It was his destination", "He was lost"], correct: 1 },
            { q: "What does 'swirling' describe in the story?", options: ["Moving quickly with a whirling motion", "Standing still", "Falling straight down", "Melting slowly"], correct: 0 },
            { q: "What lesson did the narrator learn from Cheng-yu?", options: ["How to drill mountains", "The importance of never leaving one's post", "How to cook meals", "How to navigate in snow"], correct: 1 },
            { q: "What does the 'hazy white curtain' symbolize in the opening?", options: ["A decorative item", "The heavy snow creating a barrier between earth and sky", "A tent covering", "Morning fog"], correct: 1 },
            { q: "How does the author's choice of first-person narration affect the story?", options: ["It makes the story less believable", "It allows readers to experience the narrator's personal transformation", "It confuses the reader", "It makes the story longer"], correct: 1 },
          ]
        },
        {
          id: "chapter-01-lingkuan-gorge-set-3",
          label: "Set 3",
          questions: [
            { q: "What is the meaning of 'imp' as used in the story?", options: ["A serious criminal", "A child who misbehaves but not seriously", "A grown-up worker", "A mountain spirit"], correct: 1 },
            { q: "What time did the narrator hope to reach the materials depot?", options: ["Eight o'clock", "Nine o'clock", "Ten o'clock", "Eleven o'clock"], correct: 2 },
            { q: "What does 'scaling' mean in the context of the father's work?", options: ["Measuring weight", "Climbing a ladder or cliff", "Drawing pictures", "Cooking food"], correct: 1 },
            { q: "What picture hung on the wall above the bed in the cave?", options: ["A landscape painting", "'Chubby Children Pulling the Turnip'", "A family photograph", "A railway map"], correct: 1 },
            { q: "What does 'pursed lips' mean?", options: ["Lips spread wide", "Lips brought together in little folds", "Lips painted red", "Lips trembling"], correct: 1 },
            { q: "How did Cheng-yu show his father he was at his post?", options: ["By waving flags", "By sitting in the doorway where his father could see him", "By shouting loudly", "By lighting a fire"], correct: 1 },
            { q: "What is the meaning of 'rent' in the story?", options: ["Payment for housing", "A split or tear", "A type of cloth", "A mountain path"], correct: 1 },
            { q: "What was the narrator's role or job title?", options: ["Railway engineer", "Materials Development Chief", "Cave guardian", "Traffic director"], correct: 1 },
            { q: "What does 'clamped' mean in the glossary?", options: ["To release loosely", "To put securely in place or hold tightly", "To break apart", "To decorate"], correct: 1 },
            { q: "Why does the author end the story with the narrator continuing his journey?", options: ["To show impatience", "To show the narrator was inspired to fulfill his duty", "To indicate the narrator was lost", "To create a sad ending"], correct: 1 },
            { q: "What does the cave dwelling represent in the story?", options: ["Poverty and suffering", "The workers' dedication and sacrifice for national development", "A tourist shelter", "An abandoned place"], correct: 1 },
            { q: "How does the harsh, snowy setting contribute to the story's meaning?", options: ["It makes the story scary", "It emphasizes the workers' determination despite difficult conditions", "It shows nature's beauty", "It indicates poor planning"], correct: 1 },
          ]
        },
      ]
    }
  ]
};

data.subjects = data.subjects.filter((s) => s.id !== "physics" && s.id !== "english");
data.subjects.unshift(physics);
data.subjects.push(english);

writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
console.log("Done. Subjects in file:");
for (const s of data.subjects) {
  console.log("  " + s.name + ": " + s.chapters.map(c => c.sets.length + " sets").join(", "));
}