import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Physics knowledge base for FBISE HSSC-2 (Class 12)
const CHAPTER_TOPICS = {
  "chapter-15-gravitation": ["gravitation", "gravitational field", "gravitational potential", "escape velocity", "satellites", "Newton's law"],
  "chapter-16-electrostatics": ["electric charge", "Coulomb's law", "electric field", "electric flux", "Gauss's law", "electric potential", "capacitors"],
  "chapter-17-current-electricity": ["electric current", "Ohm's law", "resistance", "resistivity", "conductivity", "Kirchhoff's laws", "power dissipation"],
  "chapter-18-electromagnetism": ["magnetic field", "magnetic flux", "Ampere's law", "Faraday's law", "induction", "transformers", "motors"],
  "chapter-19-alternating-current": ["AC current", "AC voltage", "impedance", "reactance", "resonance", "power in AC", "transformers"],
  "chapter-20-physics-of-solids": ["crystalline solids", "amorphous solids", "band theory", "semiconductors", "superconductors"],
  "chapter-21-nuclear-physics": ["radioactivity", "alpha decay", "beta decay", "gamma decay", "half-life", "nuclear fission", "nuclear fusion"],
  "chapter-22-radiation-natural-radioactivity": ["radiation types", "Geiger counter", "Wilson cloud chamber", "nuclear reactions"],
  "chapter-23-dawn-of-modern-physics": ["black body radiation", "photoelectric effect", "photon theory", "Compton effect", "wave-particle duality"],
  "chapter-24-atomic-spectra": ["atomic spectra", "Bohr model", "hydrogen spectrum", "X-rays", "laser"],
  "chapter-25-charged-particles": ["electron", "proton", "mass spectrometer", "cathode rays", "Millikan experiment"],
  "chapter-26-semiconductor-devices": ["p-n junction", "diode", "transistor", "logic gates", "rectifiers"]
};

// Known physics facts for answer verification
const KNOWN_PHYSICS_FACTS = {
  "acceleration due to gravity": { correct: 1, explanation: "Standard value is 9.8 m/s² on Earth's surface" },
  "Newton's law of gravitation": { correct: 1, explanation: "F ∝ 1/r² - inverse square law" },
  "gravitational constant G": { correct: 0, explanation: "G = 6.67 × 10⁻¹¹ N m²/kg²" },
  "Coulomb's law": { correct: 0, explanation: "F ∝ q₁q₂/r² - force proportional to product of charges" },
  "electric flux": { correct: 0, explanation: "Φ = E·A·cos(θ) - dot product of field and area" },
  "Gauss's law": { correct: 0, explanation: "Total flux through closed surface = Q/ε₀" },
  "1 farad": { correct: 0, explanation: "1 F = 1 C/V - one coulomb per volt" },
  "Ohm's law": { correct: 0, explanation: "V = IR - voltage proportional to current" },
  "resistance unit": { correct: 0, explanation: "Ohm (Ω) = V/A" },
  "Kirchhoff's current law": { correct: 0, explanation: "ΣI entering = ΣI leaving - conservation of charge" },
  "Kirchhoff's voltage law": { correct: 0, explanation: "ΣV around loop = 0 - conservation of energy" },
  "magnetic force on charge": { correct: 0, explanation: "F = qvB sin(θ) - Lorentz force" },
  "magnetic flux unit": { correct: 0, explanation: "Weber (Wb) = T·m²" },
  "Faraday's law": { correct: 0, explanation: "ε = -dΦ/dt - induced emf proportional to rate of change of flux" },
  "Lenz's law": { correct: 0, explanation: "Induced current opposes the change - conservation of energy" },
  "rms voltage": { correct: 0, explanation: "V_rms = V_peak/√2 for sinusoidal AC" },
  "impedance": { correct: 0, explanation: "Z = √(R² + (X_L - X_C)²) - total opposition in AC" },
  "resonance frequency": { correct: 0, explanation: "f₀ = 1/(2π√LC) - when X_L = X_C" },
  "band gap": { correct: 0, explanation: "Energy gap between valence and conduction bands" },
  "intrinsic semiconductor": { correct: 0, explanation: "Pure semiconductor with equal electrons and holes" },
  "alpha particle": { correct: 0, explanation: "Helium nucleus: ₂He⁴ - 2 protons, 2 neutrons" },
  "beta particle": { correct: 0, explanation: "High-energy electron from nuclear decay" },
  "half-life": { correct: 0, explanation: "Time for half the nuclei to decay" },
  "nuclear fission": { correct: 0, explanation: "Heavy nucleus splits into lighter nuclei" },
  "nuclear fusion": { correct: 0, explanation: "Light nuclei combine to form heavier nucleus" },
  "photoelectric effect": { correct: 0, explanation: "Einstein: E = hf - photon energy proportional to frequency" },
  "work function": { correct: 0, explanation: "Minimum energy to eject electron from metal surface" },
  "Compton effect": { correct: 0, explanation: "Photon scattering shows particle nature of light" },
  "Bohr radius": { correct: 0, explanation: "r = 0.529 Å - ground state radius of hydrogen" },
  "Balmer series": { correct: 0, explanation: "Transitions to n=2 - visible spectrum" },
  "Lyman series": { correct: 0, explanation: "Transitions to n=1 - ultraviolet spectrum" },
  "p-n junction": { correct: 0, explanation: "Interface between p-type and n-type semiconductors" },
  "forward bias": { correct: 0, explanation: "p-side positive, n-side negative - current flows" },
  "reverse bias": { correct: 0, explanation: "p-side negative, n-side positive - minimal current" }
};

// Check LaTeX validity
function checkLaTeX(text) {
  const errors = [];
  
  const dollarCount = (text.match(/\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    errors.push("Unclosed $ delimiter");
  }
  
  const brokenFractions = text.match(/\\frac\{[^}]*$/m);
  if (brokenFractions) {
    errors.push("Malformed \\frac - missing closing brace");
  }
  
  const brokenSuperscripts = text.match(/\^[^{]*$/m);
  if (brokenSuperscripts && !text.match(/\^\{[^}]*\}/)) {
    errors.push("Potentially malformed superscript");
  }
  
  const brokenSubscripts = text.match(/_[^{]*$/m);
  if (brokenSubscripts && !text.match(/_\{[^}]*\}/)) {
    errors.push("Potentially malformed subscript");
  }
  
  const missingBackslash = text.match(/(href|frac|sqrt|times|leq|geq|infty)\{/);
  if (missingBackslash) {
    errors.push(`Missing backslash before ${missingBackslash[1]}`);
  }
  
  return { valid: errors.length === 0, errors };
}

// Verify answer correctness
function verifyAnswer(question, options, markedCorrect, chapterTopics) {
  const qLower = question.toLowerCase();
  
  for (const [keyword, fact] of Object.entries(KNOWN_PHYSICS_FACTS)) {
    if (qLower.includes(keyword)) {
      if (markedCorrect === fact.correct) {
        return { isCorrect: true, confidence: "HIGH", reason: "Matches known physics fact" };
      } else {
        return { 
          isCorrect: false, 
          confidence: "HIGH", 
          suggestedCorrect: fact.correct,
          reason: fact.explanation
        };
      }
    }
  }
  
  for (const topic of chapterTopics) {
    if (qLower.includes(topic.toLowerCase())) {
      if (topic === "gravitation") {
        if (qLower.includes("escape velocity") && options[markedCorrect]?.includes("11.2")) {
          return { isCorrect: true, confidence: "HIGH", reason: "Earth's escape velocity is 11.2 km/s" };
        }
        if (qLower.includes("geostationary") && options[markedCorrect]?.includes("24")) {
          return { isCorrect: true, confidence: "HIGH", reason: "Geostationary satellite period is 24 hours" };
        }
      }
      
      if (topic === "electric field" || topic === "Coulomb's law") {
        if (qLower.includes("inside conductor") && options[markedCorrect]?.toLowerCase().includes("zero")) {
          return { isCorrect: true, confidence: "HIGH", reason: "Electric field inside conductor is zero" };
        }
      }
      
      if (topic === "resistance" || topic === "Ohm's law") {
        if (qLower.includes("temperature") && qLower.includes("resistance") && 
            options[markedCorrect]?.toLowerCase().includes("increases")) {
          return { isCorrect: true, confidence: "MEDIUM", reason: "Resistance typically increases with temperature for metals" };
        }
      }
      
      if (topic === "resonance") {
        if (qLower.includes("power factor") && options[markedCorrect]?.includes("1")) {
          return { isCorrect: true, confidence: "HIGH", reason: "Power factor is 1 at resonance" };
        }
      }
      
      if (topic === "half-life" || topic === "radioactivity") {
        if (qLower.includes("half-life") && options[markedCorrect]?.toLowerCase().includes("constant")) {
          return { isCorrect: true, confidence: "HIGH", reason: "Half-life is constant for a given isotope" };
        }
      }
      
      if (topic === "photoelectric effect") {
        if (qLower.includes("threshold frequency") && options[markedCorrect]?.toLowerCase().includes("minimum")) {
          return { isCorrect: true, confidence: "HIGH", reason: "Threshold frequency is minimum frequency for photoelectric emission" };
        }
        if (qLower.includes("stopping potential") && options[markedCorrect]?.toLowerCase().includes("frequency")) {
          return { isCorrect: true, confidence: "HIGH", reason: "Stopping potential depends on frequency, not intensity" };
        }
      }
      
      if (topic === "p-n junction" || topic === "diode") {
        if (qLower.includes("forward bias") && options[markedCorrect]?.toLowerCase().includes("low")) {
          return { isCorrect: true, confidence: "MEDIUM", reason: "Forward bias has low resistance" };
        }
        if (qLower.includes("reverse bias") && options[markedCorrect]?.toLowerCase().includes("high")) {
          return { isCorrect: true, confidence: "MEDIUM", reason: "Reverse bias has high resistance" };
        }
      }
    }
  }
  
  return { 
    isCorrect: true, 
    confidence: "LOW", 
    reason: "No specific physics fact matched - manual review recommended" 
  };
}

// Check explanation quality
function checkExplanation(question, explanation, correctAnswer) {
  const issues = [];
  
  if (!explanation) {
    issues.push("Missing explanation");
    return { isValid: false, issues };
  }
  
  const expLower = explanation.toLowerCase();
  const qLower = question.toLowerCase();
  
  const questionKeywords = qLower.split(/\s+/).filter(w => w.length > 4 && !["which", "what", "about", "does", "from", "with", "that", "this", "have", "been", "would", "could", "should"].includes(w));
  const explanationCoversQuestion = questionKeywords.some(kw => expLower.includes(kw));
  
  if (!explanationCoversQuestion) {
    issues.push("Explanation may not address the question topic");
  }
  
  if (expLower.includes("wrong") || expLower.includes("incorrect") || expLower.includes("not the")) {
    if (!expLower.includes("correct")) {
      issues.push("Explanation focuses on wrong answers without clearly stating the correct one");
    }
  }
  
  if (explanation.length < 50) {
    issues.push("Explanation is too brief - may lack sufficient detail");
  }
  
  if (!expLower.includes(correctAnswer.toLowerCase().substring(0, 20))) {
    issues.push("Explanation does not explicitly mention or reference the correct answer");
  }
  
  if (expLower.includes("because") && !expLower.includes("therefore") && explanation.length > 200) {
    const becauseCount = (expLower.match(/because/g) || []).length;
    if (becauseCount > 3) {
      issues.push("Explanation may be poorly structured with multiple 'because' clauses");
    }
  }
  
  return { 
    isValid: issues.length === 0, 
    issues,
    suggestedFix: issues.length > 0 ? "Consider rewriting to clearly state the correct answer and provide concise physics reasoning" : undefined
  };
}

// Check distractor quality
function checkDistractors(options, correctIndex, question) {
  const issues = [];
  const correctAnswer = options[correctIndex];
  
  for (let i = 0; i < options.length; i++) {
    if (i === correctIndex) continue;
    
    const distractor = options[i].toLowerCase();
    
    if (distractor.includes("none of these") || distractor.includes("all of these")) {
      continue;
    }
    
    const numbers = distractor.match(/[\d.]+/g);
    const correctNumbers = correctAnswer.toLowerCase().match(/[\d.]+/g);
    
    if (numbers && correctNumbers) {
      for (const num of numbers) {
        const n = parseFloat(num);
        for (const correctNum of correctNumbers) {
          const cn = parseFloat(correctNum);
          if (cn !== 0 && Math.abs(n / cn) > 1000) {
            issues.push(`Option ${i+1} has magnitude ${n} which is 1000x different from correct ${cn} - may be too obviously wrong`);
          }
        }
      }
    }
  }
  
  return {
    hasBadDistractors: issues.length > 0,
    issues
  };
}

// Main audit function
function auditPhysics() {
  const dataPath = join(process.cwd(), "data", "data.json");
  const data = JSON.parse(readFileSync(dataPath, "utf-8"));
  
  const physics = data.subjects.find(s => s.id === "physics" || s.name === "Physics");
  if (!physics) {
    console.error("Physics subject not found in data.json");
    process.exit(1);
  }
  
  console.log(`Auditing Physics: ${physics.chapters.length} chapters`);
  
  const results = [];
  const questionTexts = new Map();
  
  let totalQuestions = 0;
  const verdictCounts = {};
  const chapterErrors = {};
  
  for (const chapter of physics.chapters) {
    console.log(`\nProcessing ${chapter.name}...`);
    const chapterTopics = CHAPTER_TOPICS[chapter.id] || [];
    chapterErrors[chapter.name] = 0;
    
    for (const set of chapter.sets) {
      for (let i = 0; i < set.questions.length; i++) {
        const q = set.questions[i];
        totalQuestions++;
        
        const qText = q.q.toLowerCase().trim();
        const existing = questionTexts.get(qText);
        if (existing) {
          results.push({
            subject: "Physics",
            chapter: chapter.name,
            set_id: set.id,
            question_index: i,
            question: q.q,
            marked_correct_index: q.correct,
            marked_correct_answer: q.options[q.correct],
            verdict: "DUPLICATE",
            issue: `Duplicate of question in ${existing.chapter}, ${existing.setId}, question ${existing.index + 1}`,
            suggested_correct_index: q.correct,
            suggested_correct_answer: q.options[q.correct]
          });
          verdictCounts["DUPLICATE"] = (verdictCounts["DUPLICATE"] || 0) + 1;
          chapterErrors[chapter.name]++;
        }
        questionTexts.set(qText, { chapter: chapter.name, setId: set.id, index: i });
        
        const latexCheck = checkLaTeX(q.q + " " + q.options.join(" ") + " " + (q.explanation || ""));
        if (!latexCheck.valid) {
          results.push({
            subject: "Physics",
            chapter: chapter.name,
            set_id: set.id,
            question_index: i,
            question: q.q,
            marked_correct_index: q.correct,
            marked_correct_answer: q.options[q.correct],
            verdict: "LATEX_ERROR",
            issue: latexCheck.errors.join("; "),
            suggested_correct_index: q.correct,
            suggested_correct_answer: q.options[q.correct]
          });
          verdictCounts["LATEX_ERROR"] = (verdictCounts["LATEX_ERROR"] || 0) + 1;
          chapterErrors[chapter.name]++;
        }
        
        const answerCheck = verifyAnswer(q.q, q.options, q.correct, chapterTopics);
        if (!answerCheck.isCorrect && answerCheck.confidence !== "LOW") {
          results.push({
            subject: "Physics",
            chapter: chapter.name,
            set_id: set.id,
            question_index: i,
            question: q.q,
            marked_correct_index: q.correct,
            marked_correct_answer: q.options[q.correct],
            verdict: "WRONG_ANSWER",
            issue: answerCheck.reason,
            suggested_correct_index: answerCheck.suggestedCorrect,
            suggested_correct_answer: answerCheck.suggestedCorrect !== undefined ? q.options[answerCheck.suggestedCorrect] : undefined
          });
          verdictCounts["WRONG_ANSWER"] = (verdictCounts["WRONG_ANSWER"] || 0) + 1;
          chapterErrors[chapter.name]++;
        } else if (answerCheck.confidence === "LOW") {
          results.push({
            subject: "Physics",
            chapter: chapter.name,
            set_id: set.id,
            question_index: i,
            question: q.q,
            marked_correct_index: q.correct,
            marked_correct_answer: q.options[q.correct],
            verdict: "NEEDS_REVIEW",
            issue: answerCheck.reason,
            suggested_correct_index: q.correct,
            suggested_correct_answer: q.options[q.correct]
          });
          verdictCounts["NEEDS_REVIEW"] = (verdictCounts["NEEDS_REVIEW"] || 0) + 1;
        }
        
        if (q.explanation) {
          const expCheck = checkExplanation(q.q, q.explanation, q.options[q.correct]);
          if (!expCheck.isValid) {
            results.push({
              subject: "Physics",
              chapter: chapter.name,
              set_id: set.id,
              question_index: i,
              question: q.q,
              marked_correct_index: q.correct,
              marked_correct_answer: q.options[q.correct],
              verdict: "WRONG_EXPLANATION",
              issue: expCheck.issues.join("; "),
              suggested_explanation: expCheck.suggestedFix
            });
            verdictCounts["WRONG_EXPLANATION"] = (verdictCounts["WRONG_EXPLANATION"] || 0) + 1;
            chapterErrors[chapter.name]++;
          }
        }
        
        const distractorCheck = checkDistractors(q.options, q.correct, q.q);
        if (distractorCheck.hasBadDistractors) {
          results.push({
            subject: "Physics",
            chapter: chapter.name,
            set_id: set.id,
            question_index: i,
            question: q.q,
            marked_correct_index: q.correct,
            marked_correct_answer: q.options[q.correct],
            verdict: "BAD_DISTRACTOR",
            issue: distractorCheck.issues.join("; "),
            suggested_correct_index: q.correct,
            suggested_correct_answer: q.options[q.correct]
          });
          verdictCounts["BAD_DISTRACTOR"] = (verdictCounts["BAD_DISTRACTOR"] || 0) + 1;
          chapterErrors[chapter.name]++;
        }
      }
    }
  }
  
  console.log(`\n=== Audit Complete ===`);
  console.log(`Total MCQs checked: ${totalQuestions}`);
  console.log(`Total issues found: ${results.length}`);
  console.log(`Issues by verdict:`, verdictCounts);
  
  const outputPath = join(process.cwd(), "audit", "audit_physics.json");
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nWritten: ${outputPath}`);
  
  const topChapters = Object.entries(chapterErrors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  let summary = `# Physics MCQ Audit Report\n\n`;
  summary += `## Summary Statistics\n\n`;
  summary += `- **Total MCQs Checked:** ${totalQuestions}\n`;
  summary += `- **Total Issues Found:** ${results.length}\n`;
  summary += `- **Clean MCQs:** ${totalQuestions - results.length}\n\n`;
  
  summary += `## Issues by Verdict Type\n\n`;
  summary += `| Verdict | Count |\n`;
  summary += `|---------|-------|\n`;
  for (const [verdict, count] of Object.entries(verdictCounts)) {
    summary += `| ${verdict} | ${count} |\n`;
  }
  
  summary += `\n## Top 3 Most Error-Prone Chapters\n\n`;
  summary += `| Chapter | Issues |\n`;
  summary += `|---------|--------|\n`;
  for (const [chapter, count] of topChapters) {
    summary += `| ${chapter} | ${count} |\n`;
  }
  
  summary += `\n## Patterns Observed\n\n`;
  
  const patterns = [];
  
  if ((verdictCounts["LATEX_ERROR"] || 0) > 5) {
    patterns.push("- LaTeX errors are common - consider using a LaTeX validator in the data entry workflow");
  }
  
  if ((verdictCounts["WRONG_EXPLANATION"] || 0) > 10) {
    patterns.push("- Many explanations lack clarity or completeness - consider providing explanation templates");
  }
  
  if ((verdictCounts["DUPLICATE"] || 0) > 0) {
    patterns.push("- Duplicate questions detected across sets - consider implementing duplicate detection during data entry");
  }
  
  if ((verdictCounts["NEEDS_REVIEW"] || 0) > totalQuestions * 0.5) {
    patterns.push("- Large number of questions flagged for manual review - consider expanding the automated verification knowledge base");
  }
  
  for (const [chapter, count] of Object.entries(chapterErrors)) {
    if (count > 10) {
      patterns.push(`- ${chapter} has ${count} issues - may need focused review`);
    }
  }
  
  if (patterns.length === 0) {
    patterns.push("- No significant patterns identified - issues appear randomly distributed");
  }
  
  summary += patterns.join("\n");
  summary += "\n";
  
  const summaryPath = join(process.cwd(), "audit", "audit_physics_summary.md");
  writeFileSync(summaryPath, summary);
  console.log(`Written: ${summaryPath}`);
}

auditPhysics();
