import { WeekDefinition, WeekNumber } from '../types';

export const COURSE_CODE = 'WIX1001';
export const COURSE_TITLE = 'Mathematics for Computing 1';
export const UNIVERSITY_NAME = 'Universiti Malaya (Faculty of Computer Science & Information Technology)';

export interface AssessmentItem {
  id: 'test-1' | 'test-2' | 'pop-quizzes' | 'final-exam';
  title: string;
  weight: number;
  coverageLabel: string;
  deckNote: string;
  relatedWeeks: WeekNumber[];
}

export const ASSESSMENT_FRAMEWORK: AssessmentItem[] = [
  {
    id: 'test-1',
    title: 'Test 1',
    weight: 20,
    coverageLabel: 'Weeks 1–5 coverage',
    deckNote:
      'Week 6 (Functions) is additionally included in the Week 7 milestone review deck for comprehensive consolidation.',
    relatedWeeks: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: 'test-2',
    title: 'Test 2',
    weight: 20,
    coverageLabel: 'Weeks 6–11 coverage',
    deckNote:
      'The Week 13 milestone review deck synthesizes Weeks 8–12 (Relations through Trees) alongside core function foundations.',
    relatedWeeks: [6, 8, 9, 10, 11, 12, 13],
  },
  {
    id: 'pop-quizzes',
    title: 'Pop Quizzes',
    weight: 10,
    coverageLabel: 'Continuous tutorial & lecture checkpoints',
    deckNote:
      'Supported continuously by active-recall drills and spaced-repetition daily reviews across all weekly topics.',
    relatedWeeks: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12],
  },
  {
    id: 'final-exam',
    title: 'Final Examination',
    weight: 50,
    coverageLabel: 'Comprehensive Weeks 1–14 course coverage',
    deckNote:
      'Week 14 Master Revision integrates cross-topic capstone synthesis with targeted filters across all course material.',
    relatedWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  },
];

export const CONSOLIDATION_METADATA = {
  title: 'Mid-Semester Break: Consolidation',
  subtitle: 'Targeted Retention & Remediation (Weeks 1–8)',
  summary:
    'Consolidate foundational discrete structures from Weeks 1–8 without duplicating cards. Drill previously missed cards, overdue reviews, Box 1 cards, or mixed revision.',
  coveredWeeks: [1, 2, 3, 4, 5, 6, 7, 8] as WeekNumber[],
};

export const CURRICULUM_WEEKS: WeekDefinition[] = [
  {
    week: 1,
    title: 'Foundation Review and Number Systems',
    shortTitle: 'Number Systems & Algebra',
    summary:
      'Natural (starting at 1), whole (starting at 0), integer, rational, irrational, real, imaginary, and complex numbers; linear equations, slope, systems, quadratics, factoring, and the discriminant.',
    learningObjectives: [
      'Classify numbers across ℕ, 𝕎, ℤ, ℚ, ℝ\\ℚ, ℝ, and ℂ using ℕ = {1, 2, 3, ...} and 𝕎 = {0, 1, 2, ...}',
      'Express rational numbers in formal set-builder notation',
      'Compute slope and solve linear equations and 2×2 systems via substitution and elimination',
      'Factor quadratics and apply the quadratic formula and discriminant Δ = b² - 4ac',
    ],
  },
  {
    week: 2,
    title: 'Set Definitions, Notation, and Operations',
    shortTitle: 'Sets & Operations',
    summary:
      'Roster and set-builder forms, membership, cardinality, empty/universal sets, subsets, power sets |P(A)| = 2^|A|, standard and generalized set operations, and three-set Cartesian products.',
    learningObjectives: [
      'Translate fluently between roster and set-builder notation',
      'Distinguish element membership (∈, ∉) from subset relations (⊆, ⊂)',
      'Construct power sets and apply |P(A)| = 2^{|A|}',
      'Evaluate union, intersection, difference, complement, generalized operations, and A × B × C',
    ],
  },
  {
    week: 3,
    title: 'Set Problem Solving and Inclusion-Exclusion',
    shortTitle: 'Inclusion-Exclusion',
    summary:
      'Two-set and three-set Principle of Inclusion-Exclusion, Venn diagram region algebra, only-A/only-B counts, pairwise/triple intersections, neither-category counts, and survey modeling.',
    learningObjectives: [
      'Apply |A ∪ B| and |A ∪ B ∪ C| inclusion-exclusion identities accurately',
      'Isolate disjoint Venn diagram regions (only A, pairwise-only, triple, neither)',
      'Translate natural-language survey word problems into exact set equations',
    ],
  },
  {
    week: 4,
    title: 'Propositional Logic',
    shortTitle: 'Propositional Logic',
    summary:
      'Propositions, truth values, ¬, ∧, ∨, →, ↔, complete truth tables, converse/inverse/contrapositive, compound evaluation, tautologies, contradictions, and contingencies.',
    learningObjectives: [
      'Identify valid propositions and evaluate logical connectives ¬, ∧, ∨, →, ↔',
      'Construct 2^n-row truth tables for compound propositions',
      'Form the contrapositive, converse, and inverse of conditional statements',
      'Classify compound statements as tautologies, contradictions, or contingencies',
    ],
  },
  {
    week: 5,
    title: 'Predicate Logic and Formal Proofs',
    shortTitle: 'Predicates & Proofs',
    summary:
      'Predicates, universal (∀) and existential (∃) quantifiers, De Morgan’s laws for quantifiers and logic, algebraic laws of logic, and direct, contrapositive, contradiction, counterexample, parity, and divisibility proofs.',
    learningObjectives: [
      'Express mathematical statements with ∀ and ∃ and negate quantified formulas accurately',
      'Apply De Morgan’s, commutative, associative, distributive, and absorption equivalences',
      'Construct direct proofs, proofs by contraposition, proofs by contradiction, and counterexamples',
      'Write formal parity (even/odd) and integer divisibility arguments',
    ],
  },
  {
    week: 6,
    title: 'Functions',
    shortTitle: 'Functions',
    summary:
      'Domain, codomain, range, function notation, injective, surjective, and bijective properties, function composition, inverse functions, and existence criteria for inverses.',
    learningObjectives: [
      'Distinguish domain, codomain, image/range, and preimages for f: A → B',
      'Prove or test injectivity, surjectivity, and bijectivity formally',
      'Compute composite functions (f ∘ g)(x) and explicit inverses f^{-1}(x)',
      'Verify bijectivity as the necessary and sufficient condition for invertibility',
    ],
  },
  {
    week: 7,
    title: 'Test 1 Assessment and Milestone Drill',
    shortTitle: 'Test 1 Milestone (W1–6)',
    summary:
      'Comprehensive mixed exam-preparation deck integrating Weeks 1–6: number systems, set algebra, inclusion-exclusion, propositional & predicate logic, proof methods, and functions.',
    learningObjectives: [
      'Synthesize definitions, formulas, and proof strategies from Weeks 1–6 under active recall',
      'Solve multi-step exam-style problems on inclusion-exclusion, quantifier negation, and bijections',
    ],
    assessmentTag: 'test-1',
    milestoneNote:
      'Test 1 Milestone Banner: This mixed review deck contributes directly to your preparation for the 20% Test 1 course assessment (planned Weeks 1–5 coverage plus Week 6 Functions consolidation).',
  },
  {
    week: 8,
    title: 'Relations',
    shortTitle: 'Binary Relations',
    summary:
      'Binary relations as subsets of A × B, reflexive, symmetric, antisymmetric, and transitive properties, equivalence relations, equivalence classes, and zero-one relation matrices.',
    learningObjectives: [
      'Represent binary relations using ordered pairs, digraphs, and zero-one matrices M_R',
      'Test reflexivity, symmetry, antisymmetry, and transitivity rigorously',
      'Identify equivalence relations and partition sets into equivalence classes [a]_R',
    ],
  },
  {
    week: 9,
    title: 'Matrices',
    shortTitle: 'Matrices & Linear Systems',
    summary:
      'Matrix dimensions, equality, addition, scalar multiplication, matrix multiplication, identity and inverse matrices, invertibility criteria, and solving AX = B via X = A^{-1}B.',
    learningObjectives: [
      'Perform matrix addition, scalar multiplication, and non-commutative matrix multiplication',
      'Determine invertibility via det(A) ≠ 0 and compute explicit matrix inverses',
      'Formulate linear systems as AX = B and solve X = A^{-1}B when A^{-1} exists',
    ],
  },
  {
    week: 10,
    title: 'Counting Principles',
    shortTitle: 'Counting & Combinatorics',
    summary:
      'Product and sum rules, factorials, permutations, combinations, order vs selection distinctions, the Pigeonhole Principle, the Binomial Theorem, and binomial coefficients.',
    learningObjectives: [
      'Apply sum and product counting rules systematically',
      'Distinguish ordered permutations P(n, r) from unordered combinations C(n, r)',
      'Apply the generalized Pigeonhole Principle ⌈N / k⌉ to worst-case guarantees',
      'Expand expressions and extract specific terms using the Binomial Theorem',
    ],
  },
  {
    week: 11,
    title: 'Graph Theory',
    shortTitle: 'Graph Theory',
    summary:
      'Graphs G = (V, E), directed and undirected models, vertex degrees, the Handshaking Lemma, paths and circuits, Eulerian (edges) vs Hamiltonian (vertices) traversals, and adjacency/incidence matrices.',
    learningObjectives: [
      'Analyze vertex degrees and apply ∑ deg(v) = 2|E| (Handshaking Lemma)',
      'Distinguish Eulerian paths/circuits (every edge once; degree parity theorems) from Hamiltonian paths/circuits (every vertex once)',
      'Construct and interpret adjacency matrices A_G and incidence matrices M_G',
    ],
  },
  {
    week: 12,
    title: 'Trees',
    shortTitle: 'Trees & Traversals',
    summary:
      'Connected acyclic graphs, the fundamental tree identity |E| = |V| - 1, rooted and binary trees, structural terminology, preorder/inorder/postorder traversals, and minimum spanning trees.',
    learningObjectives: [
      'Characterize trees as connected acyclic graphs satisfying |E| = |V| - 1',
      'Identify parents, children, siblings, internal vertices, leaves, level, and height in rooted/binary trees',
      'Execute preorder, inorder, and postorder tree traversals accurately',
      'Construct spanning trees and minimum spanning trees (Kruskal’s & Prim’s principles)',
    ],
  },
  {
    week: 13,
    title: 'Test 2 Assessment and Milestone Drill',
    shortTitle: 'Test 2 Milestone (W8–12)',
    summary:
      'Comprehensive mixed exam-preparation deck covering Weeks 8–12: relation properties, matrix equations, combinatorics, pigeonhole principle, graph theory, Eulerian/Hamiltonian criteria, and trees.',
    learningObjectives: [
      'Recall formulas and theorem conditions across Relations, Matrices, Counting, Graphs, and Trees',
      'Solve multi-step exam problems across Weeks 8–12 without hints',
    ],
    assessmentTag: 'test-2',
    milestoneNote:
      'Test 2 Milestone Banner: This mixed review deck contributes directly to your preparation for the 20% Test 2 course assessment (synthesizing Weeks 8–12 topics alongside core course concepts).',
  },
  {
    week: 14,
    title: 'Final Examination Master Revision',
    shortTitle: 'Final Exam Master Revision',
    summary:
      'Capstone cross-topic synthesis plus dynamic full-course revision drawing directly from all Weeks 1–14 cards across overdue reviews, previously missed items, formulas, definitions, proofs, and worked examples.',
    learningObjectives: [
      'Connect concepts across logic, sets, proofs, functions, relations, matrices, combinatorics, graphs, and trees',
      'Eliminate weak spots using dynamic filters over all course cards prior to the 50% Final Examination',
    ],
    assessmentTag: 'final',
    milestoneNote:
      'Final Examination Milestone Banner: Master Revision mode draws from your complete 14-week WIX1001 deck alongside capstone synthesis cards to prepare for the comprehensive 50% Final Examination.',
  },
];

export function getWeekDefinition(week: WeekNumber): WeekDefinition {
  const found = CURRICULUM_WEEKS.find((w) => w.week === week);
  if (!found) {
    return CURRICULUM_WEEKS[0];
  }
  return found;
}
