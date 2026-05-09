const fs = require('fs');
const DATA_PATH = 'data/data.json';
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const FRAG_MAP = { physics: 'physics', mathematics: 'maths', english: 'english' };
const FRAG_FILES = {
  physics: ['/tmp/mcq-fragment-physics-1.json','/tmp/mcq-fragment-physics-2.json'],
  mathematics: ['/tmp/mcq-fragment-maths-1.json','/tmp/mcq-fragment-maths-2.json'],
  english: ['/tmp/mcq-fragment-english-1.json','/tmp/mcq-fragment-english-2.json'],
};
for (const [fragKey, fragPaths] of Object.entries(FRAG_FILES)) {
  const subject = data.subjects.find(s => s.id === FRAG_MAP[fragKey]);
  if (!subject) continue;
  const existingIds = new Set(subject.chapters.map(c => c.id));
  for (const fragPath of fragPaths) {
    const frag = JSON.parse(fs.readFileSync(fragPath, 'utf-8'))[fragKey];
    if (!frag?.chapters) continue;
    for (const fc of frag.chapters) {
      if (!existingIds.has(fc.id)) {
        subject.chapters.push(fc);
        existingIds.add(fc.id);
      }
    }
  }
  subject.chapters.sort((a,b) => (parseInt(a.id.match(/(\d+)/)?.[1]??'0')) - (parseInt(b.id.match(/(\d+)/)?.[1]??'0')));
}
fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
let total = 0;
for (const s of data.subjects) {
  let n = 0;
  for (const c of s.chapters) for (const st of c.sets) n += st.questions.length;
  total += n;
  console.log(s.name + ': ' + s.chapters.length + ' ch, ' + n + ' Qs');
}
console.log('---\nTotal: ' + total + ' MCQs');
