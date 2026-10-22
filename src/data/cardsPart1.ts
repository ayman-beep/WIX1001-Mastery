import { Flashcard } from '../types';

export const CARDS_WEEKS_1_TO_7: Flashcard[] = [
  // ============================================================================
  // WEEK 1: Foundation Review and Number Systems (11 cards)
  // ============================================================================
  {
    id: 'w01-01',
    week: 1,
    topic: 'Natural & Whole Numbers',
    category: 'definition',
    question:
      'Write the set of natural numbers $\\mathbb{N}$ in roster notation (first four terms):',
    answer: '{1, 2, 3, 4, ...}',
    answerLatex: '\\mathbb{N} = \\{1, 2, 3, 4, \\dots\\}',
    acceptedVariants: ['ℕ = {1, 2, 3, 4, ...}', '{1, 2, 3, ...}'],
    formatHint: '{1, 2, 3, 4, ...}',
    explanation:
      'In WIX1001, natural numbers start at $1$: $$\\mathbb{N} = \\{1, 2, 3, 4, \\dots\\}$$ whereas whole numbers adjoin zero: $$\\mathbb{W} = \\{0, 1, 2, 3, \\dots\\} = \\mathbb{N} \\cup \\{0\\}.$$',
  },
  {
    id: 'w01-02',
    week: 1,
    topic: 'Whole Numbers Convention',
    category: 'definition',
    question:
      'Express the whole numbers $\\mathbb{W}$ as the union of $\\mathbb{N}$ and $\\{0\\}$:',
    answer: 'ℕ ∪ {0}',
    answerLatex: '\\mathbb{W} = \\mathbb{N} \\cup \\{0\\}',
    acceptedVariants: ['{0} ∪ ℕ', '𝕎 = ℕ ∪ {0}'],
    formatHint: 'ℕ ∪ {0}',
    explanation:
      'Since $\\mathbb{N} = \\{1, 2, 3, \\dots\\}$ and $\\mathbb{W} = \\{0, 1, 2, 3, \\dots\\}$, whole numbers differ from natural numbers solely by the element $0$: $$\\mathbb{W} = \\mathbb{N} \\cup \\{0\\}.$$',
  },
  {
    id: 'w01-03',
    week: 1,
    topic: 'Hierarchy of Number Sets',
    category: 'concept',
    question:
      'Order $\\mathbb{N}, \\mathbb{W}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ from smallest to largest using $\\subset$:',
    answer: 'ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ',
    answerLatex:
      '\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}',
    acceptedVariants: [],
    formatHint: 'ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ',
    explanation:
      'Every natural number is a whole number ($0 \\in \\mathbb{W} \\setminus \\mathbb{N}$), every whole number is an integer ($-1 \\in \\mathbb{Z} \\setminus \\mathbb{W}$), every integer $n = n/1$ is rational ($1/2 \\in \\mathbb{Q} \\setminus \\mathbb{Z}$), every rational is real ($\\sqrt{2} \\in \\mathbb{R} \\setminus \\mathbb{Q}$), and every real $x = x + 0i$ is complex ($i \\in \\mathbb{C} \\setminus \\mathbb{R}$).',
  },
  {
    id: 'w01-04',
    week: 1,
    topic: 'Rational Numbers Set-Builder Form',
    category: 'definition',
    question:
      'Write the set-builder definition of the rational numbers $\\mathbb{Q}$:',
    answer: '{p/q | p ∈ ℤ, q ∈ ℤ, q ≠ 0}',
    answerLatex: '\\mathbb{Q} = \\{p/q \\mid p \\in \\mathbb{Z},\\; q \\in \\mathbb{Z},\\; q \\neq 0\\}',
    acceptedVariants: [
      '{p/q : p ∈ ℤ, q ∈ ℤ, q ≠ 0}',
      '{p/q | p, q ∈ ℤ, q ≠ 0}',
      '{p/q : p, q ∈ ℤ, q ≠ 0}',
      '{p/q | p ∈ ℤ ∧ q ∈ ℤ ∧ q ≠ 0}',
    ],
    formatHint: '{p/q | p ∈ ℤ, q ∈ ℤ, q ≠ 0}',
    explanation:
      'A real number is rational if and only if it can be expressed as a quotient $p/q$ of two integers $p, q \\in \\mathbb{Z}$ with non-zero denominator $q \\neq 0$. Numbers in $\\mathbb{R} \\setminus \\mathbb{Q}$ (such as $\\sqrt{2}, \\pi, e$) are **irrational**.',
  },
  {
    id: 'w01-05',
    week: 1,
    topic: 'Irrational, Imaginary, and Complex Numbers',
    category: 'concept',
    question:
      'In the complex numbers $\\mathbb{C}$, what is the value of $i^2$?',
    answer: '-1',
    answerLatex: 'i^2 = -1',
    acceptedVariants: ['i^2 = -1'],
    formatHint: 'Integer value',
    explanation:
      'The imaginary unit $i$ satisfies $i^2 = -1$. Every complex number has standard form $z = a + bi$ with real part $\\operatorname{Re}(z) = a \\in \\mathbb{R}$ and imaginary part $\\operatorname{Im}(z) = b \\in \\mathbb{R}$. When $a = 0$ and $b \\neq 0$, $bi$ is purely imaginary.',
  },
  {
    id: 'w01-06',
    week: 1,
    topic: 'Linear Equations in One Variable',
    category: 'worked-example',
    question: 'Solve the linear equation $4(2x - 3) = 3x + 8$ for $x$.',
    answer: 'x = 4',
    answerLatex: 'x = 4',
    acceptedVariants: ['4'],
    formatHint: 'x = value (or integer)',
    explanation:
      'Expand and isolate $x$: $$8x - 12 = 3x + 8 \\implies 5x = 20 \\implies x = 4.$$ Check: $4(2(4) - 3) = 4(5) = 20$ and $3(4) + 8 = 20$.',
  },
  {
    id: 'w01-07',
    week: 1,
    topic: 'Slope Formula',
    category: 'formula',
    question:
      'State the slope formula $m$ of the line passing through two distinct points $(x_1, y_1)$ and $(x_2, y_2)$ with $x_1 \\neq x_2$.',
    answer: '(y_2 - y_1) / (x_2 - x_1)',
    answerLatex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
    acceptedVariants: ['m = (y_2 - y_1) / (x_2 - x_1)', '(y2 - y1) / (x2 - x1)', 'm = (y2 - y1) / (x2 - x1)'],
    formatHint: '(y_2 - y_1) / (x_2 - x_1)',
    explanation:
      'Slope measures vertical change ("rise") divided by horizontal change ("run"): $$m = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}, \\quad x_1 \\neq x_2.$$ If $x_1 = x_2$, the line is vertical and the slope is undefined.',
  },
  {
    id: 'w01-08',
    week: 1,
    topic: 'Systems of Linear Equations (Elimination & Substitution)',
    category: 'worked-example',
    question:
      'Solve the $2 \\times 2$ linear system as an ordered pair $(x, y)$: $$2x + y = 7, \\qquad x - y = 2$$',
    answer: '(3, 1)',
    answerLatex: '(x, y) = (3, 1)',
    acceptedVariants: ['x = 3, y = 1'],
    formatHint: 'Ordered pair (x, y)',
    explanation:
      '**By elimination:** Adding $(2x + y) + (x - y) = 7 + 2$ gives $3x = 9 \\implies x = 3$. **By substitution:** $y = x - 2 = 3 - 2 = 1$. Hence $(x, y) = (3, 1)$.',
  },
  {
    id: 'w01-09',
    week: 1,
    topic: 'Factoring Quadratic Expressions',
    category: 'worked-example',
    question: 'Factor the quadratic expression $x^2 - 5x + 6$ completely into linear factors.',
    answer: '(x - 2)(x - 3)',
    answerLatex: '(x - 2)(x - 3)',
    acceptedVariants: ['(x - 3)(x - 2)'],
    formatHint: 'Product of two binomials (x - a)(x - b)',
    explanation:
      'We seek two integers whose product is $+6$ and whose sum is $-5$. Since $(-2)(-3) = 6$ and $(-2) + (-3) = -5$: $$x^2 - 5x + 6 = (x - 2)(x - 3).$$',
  },
  {
    id: 'w01-10',
    week: 1,
    topic: 'Quadratic Formula',
    category: 'formula',
    question:
      'Write the quadratic formula for the roots $x$ of $ax^2 + bx + c = 0$ ($a \\neq 0$), using `±` (or `+-`) and `√(...)`.',
    answer: '(-b +- √(b^2 - 4ac)) / (2a)',
    answerLatex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    acceptedVariants: [
      'x = (-b +- √(b^2 - 4ac)) / (2a)',
      '(-b ± √(b^2 - 4ac)) / (2a)',
      'x = (-b ± √(b^2 - 4ac)) / (2a)',
    ],
    formatHint: '(-b ± √(b^2 - 4ac)) / (2a)',
    explanation:
      'Completing the square on $ax^2 + bx + c = 0$ yields $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}.$$ Remember the entire numerator $-b \\pm \\sqrt{b^2 - 4ac}$ is divided by $2a$.',
  },
  {
    id: 'w01-11',
    week: 1,
    topic: 'Discriminant of a Quadratic',
    category: 'formula',
    question:
      'Write the algebraic expression for the discriminant $\\Delta$ of $ax^2 + bx + c = 0$ that determines the nature of its roots.',
    answer: 'b^2 - 4ac',
    answerLatex: '\\Delta = b^2 - 4ac',
    acceptedVariants: ['Δ = b^2 - 4ac'],
    formatHint: 'Expression in a, b, c',
    explanation:
      'For real coefficients $a, b, c$ ($a \\neq 0$), $\\Delta = b^2 - 4ac$ classifies the roots:\n- $\\Delta > 0$: two distinct real roots\n- $\\Delta = 0$: one repeated real root\n- $\\Delta < 0$: two complex conjugate roots in $\\mathbb{C} \\setminus \\mathbb{R}$.',
  },

  // ============================================================================
  // WEEK 2: Set Definitions, Notation, and Operations (11 cards)
  // ============================================================================
  {
    id: 'w02-01',
    week: 2,
    topic: 'Roster vs Set-Builder Notation',
    category: 'worked-example',
    question:
      'Convert the set $A = \\{x \\in \\mathbb{N} \\mid x \\le 5\\}$ into explicit roster notation.',
    answer: '{1, 2, 3, 4, 5}',
    answerLatex: '\\{1, 2, 3, 4, 5\\}',
    acceptedVariants: [],
    formatHint: '{a, b, c, ...} in ascending order',
    explanation:
      'Because $\\mathbb{N} = \\{1, 2, 3, \\dots\\}$ starts at $1$, the natural numbers less than or equal to $5$ are $1, 2, 3, 4, 5$, giving $\\{1, 2, 3, 4, 5\\}$.',
  },
  {
    id: 'w02-02',
    week: 2,
    topic: 'Membership vs Subset Relation',
    category: 'concept',
    question:
      'Let $A = \\{1, \\{2, 3\\}\\}$. Write the single set relation symbol (`∈`, `∉`, `⊆`, or `⊂`) that makes $\\{2, 3\\} \\;\\_\\; A$ a true statement.',
    answer: '∈',
    answerLatex: '\\{2, 3\\} \\in A',
    acceptedVariants: ['{2, 3} ∈ A'],
    formatHint: 'Single symbol (e.g. ∈ or ⊆)',
    explanation:
      '$A$ contains exactly two elements: the number $1$ and the set $\\{2, 3\\}$. Therefore $\\{2, 3\\} \\in A$ (it is an element of $A$), whereas $\\{2, 3\\} \\not\\subseteq A$ because $2 \\notin A$.',
  },
  {
    id: 'w02-03',
    week: 2,
    topic: 'Non-Membership and Empty Set',
    category: 'concept',
    question:
      'What is the cardinality $|\\{\\emptyset\\}|$ of the set containing the empty set?',
    answer: '1',
    answerLatex: '|\\{\\emptyset\\}| = 1',
    acceptedVariants: [],
    formatHint: 'Single non-negative integer',
    explanation:
      'While $|\\emptyset| = 0$ because $\\emptyset$ has no elements ($x \\notin \\emptyset$ for all $x$), the singleton set $\\{\\emptyset\\}$ contains one element — namely $\\emptyset$ itself (think of a box containing an empty box). Thus $|\\{\\emptyset\\}| = 1$.',
  },
  {
    id: 'w02-04',
    week: 2,
    topic: 'Cardinality of Nested Finite Sets',
    category: 'worked-example',
    question: 'Find the cardinality $|B|$ of $B = \\{a, \\{b, c\\}, \\emptyset, a\\}$.',
    answer: '3',
    answerLatex: '|B| = 3',
    acceptedVariants: ['|B| = 3'],
    formatHint: 'Integer cardinality',
    explanation:
      'Duplicate elements in roster notation are collapsed ($\\{a, a\\} = \\{a\\}$). The distinct elements of $B$ are $a$, $\\{b, c\\}$, and $\\emptyset$, so $|B| = 3$.',
  },
  {
    id: 'w02-05',
    week: 2,
    topic: 'Proper Subset Formal Definition',
    category: 'definition',
    question:
      'Express the condition for $A \\subset B$ ($A$ is a proper subset of $B$) using $\\subseteq$, $\\land$, and $\\neq$.',
    answer: 'A ⊆ B ∧ A ≠ B',
    answerLatex: 'A \\subset B \\iff (A \\subseteq B \\land A \\neq B)',
    acceptedVariants: ['(A ⊆ B) ∧ (A ≠ B)'],
    formatHint: 'A ⊆ B ∧ A ≠ B',
    explanation:
      '$A$ is a subset of $B$ ($A \\subseteq B$) iff $\\forall x (x \\in A \\to x \\in B)$. $A$ is a **proper** subset ($A \\subset B$) iff $A \\subseteq B$ and there exists at least one element in $B \\setminus A$, i.e., $A \\subseteq B \\land A \\neq B$. Notice $\\emptyset \\subseteq A$ holds for every set $A$.',
  },
  {
    id: 'w02-06',
    week: 2,
    topic: 'Power Set Cardinality Formula',
    category: 'formula',
    question:
      'State the formula for the cardinality $|P(A)|$ of the power set of a finite set $A$ in terms of $|A|$.',
    answer: '2^|A|',
    answerLatex: '|P(A)| = 2^{|A|}',
    acceptedVariants: ['2^(|A|)', '|P(A)| = 2^|A|', '|P(A)| = 2^(|A|)'],
    formatHint: 'Exponential expression using |A|',
    explanation:
      'When forming a subset of $A$, each of the $|A|$ elements has $2$ independent choices (either include it or exclude it). By the product rule, there are $2^{|A|}$ subsets in total, so $|P(A)| = 2^{|A|}$.',
  },
  {
    id: 'w02-07',
    week: 2,
    topic: 'Constructing a Power Set',
    category: 'worked-example',
    question:
      'Write the power set $P(\\{1, 2\\})$ in roster form ordered as empty set, singletons, then full set.',
    answer: '{∅, {1}, {2}, {1, 2}}',
    answerLatex: 'P(\\{1, 2\\}) = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{1, 2\\}\\}',
    acceptedVariants: ['{{}, {1}, {2}, {1, 2}}'],
    formatHint: '{∅, {1}, {2}, {1, 2}}',
    explanation:
      'Since $|\\{1, 2\\}| = 2$, $P(\\{1, 2\\})$ has $2^2 = 4$ elements: the $0$-element subset $\\emptyset$, the two $1$-element subsets $\\{1\\}$ and $\\{2\\}$, and the $2$-element subset $\\{1, 2\\}$.',
  },
  {
    id: 'w02-08',
    week: 2,
    topic: 'Union, Intersection, and Set Difference',
    category: 'worked-example',
    question:
      'Given $A = \\{1, 2, 3, 4\\}$ and $B = \\{3, 4, 5, 6\\}$, evaluate the set difference $A - B$ in ascending roster form.',
    answer: '{1, 2}',
    answerLatex: 'A - B = \\{1, 2\\}',
    acceptedVariants: [],
    formatHint: 'Roster set { ... }',
    explanation:
      'Set difference $A - B = \\{x \\mid x \\in A \\land x \\notin B\\}$ removes any elements of $B$ from $A$. Here $A \\cup B = \\{1,2,3,4,5,6\\}$, $A \\cap B = \\{3,4\\}$, and $A - B = \\{1, 2\\}$.',
  },
  {
    id: 'w02-09',
    week: 2,
    topic: 'Complement Relative to Universal Set',
    category: 'worked-example',
    question:
      'Let universal set $U = \\{1, 2, 3, 4, 5, 6\\}$ and $A = \\{2, 4, 6\\}$. Find the complement $\\overline{A}$ in ascending roster form.',
    answer: '{1, 3, 5}',
    answerLatex: '\\overline{A} = U - A = \\{1, 3, 5\\}',
    acceptedVariants: [],
    formatHint: 'Roster set { ... }',
    explanation:
      'The complement $\\overline{A} = A^c = U - A = \\{x \\in U \\mid x \\notin A\\}$. Removing $2, 4, 6$ from $U = \\{1,2,3,4,5,6\\}$ yields $\\{1, 3, 5\\}$.',
  },
  {
    id: 'w02-10',
    week: 2,
    topic: 'Generalized Union and Intersection',
    category: 'worked-example',
    question:
      'Let $A_i = \\{i, i + 1\\}$ for $i \\in \\{1, 2, 3\\}$. Compute the generalized intersection $\\bigcap_{i=1}^{3} A_i$ in roster notation.',
    answer: '∅',
    answerLatex: '\\bigcap_{i=1}^{3} A_i = A_1 \\cap A_2 \\cap A_3 = \\emptyset',
    acceptedVariants: ['{}'],
    formatHint: 'Set symbol or roster set',
    explanation:
      'Here $A_1 = \\{1, 2\\}$, $A_2 = \\{2, 3\\}$, and $A_3 = \\{3, 4\\}$. Then $\\bigcup_{i=1}^{3} A_i = \\{1, 2, 3, 4\\}$, while no single element belongs to all three sets simultaneously: $A_1 \\cap A_2 \\cap A_3 = \\emptyset$.',
  },
  {
    id: 'w02-11',
    week: 2,
    topic: 'Three-Set Cartesian Products',
    category: 'worked-example',
    question:
      'If $|A| = 2$, $|B| = 3$, and $|C| = 4$, what is the cardinality $|A \\times B \\times C|$ of the three-set Cartesian product?',
    answer: '24',
    answerLatex: '|A \\times B \\times C| = |A| \\cdot |B| \\cdot |C| = 24',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'The three-set Cartesian product is $$A \\times B \\times C = \\{(a, b, c) \\mid a \\in A,\\; b \\in B,\\; c \\in C\\}$$ consisting of ordered $3$-tuples. Its cardinality is $|A| \\cdot |B| \\cdot |C| = 2 \\times 3 \\times 4 = 24$.',
  },

  // ============================================================================
  // WEEK 3: Set Problem Solving and Inclusion-Exclusion (9 cards)
  // ============================================================================
  {
    id: 'w03-01',
    week: 3,
    topic: 'Two-Set Inclusion-Exclusion Formula',
    category: 'formula',
    question:
      'State the Principle of Inclusion-Exclusion formula for $|A \\cup B|$ in terms of $|A|$, $|B|$, and $|A \\cap B|$.',
    answer: '|A| + |B| - |A ∩ B|',
    answerLatex: '|A \\cup B| = |A| + |B| - |A \\cap B|',
    acceptedVariants: ['|A ∪ B| = |A| + |B| - |A ∩ B|'],
    formatHint: '|A| + |B| - |A ∩ B|',
    explanation:
      'Summing $|A| + |B|$ counts every element in the overlap $A \\cap B$ twice. Subtracting $|A \\cap B|$ once restores exact counting: $$|A \\cup B| = |A| + |B| - |A \\cap B|.$$',
  },
  {
    id: 'w03-02',
    week: 3,
    topic: 'Three-Set Inclusion-Exclusion Formula',
    category: 'formula',
    question:
      'State the three-set Inclusion-Exclusion formula for $|A \\cup B \\cup C|$ in standard order (singletons, pairwise intersections, triple intersection).',
    answer: '|A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|',
    answerLatex:
      '|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|',
    acceptedVariants: [
      '|A| + |B| + |C| - |A ∩ B| - |B ∩ C| - |A ∩ C| + |A ∩ B ∩ C|',
      '|A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|',
    ],
    formatHint: '|A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|',
    explanation:
      'An element in $A \\cap B \\cap C$ is added $3$ times in $|A| + |B| + |C|$ and subtracted $3$ times in $-|A \\cap B| - |A \\cap C| - |B \\cap C|$ (net $0$), so $+|A \\cap B \\cap C|$ adds it back once.',
  },
  {
    id: 'w03-03',
    week: 3,
    topic: 'Only-A Region Formula',
    category: 'formula',
    question:
      'In a two-set Venn diagram, express the cardinality of "only $A$" ($|A - B|$) in terms of $|A|$ and $|A \\cap B|$.',
    answer: '|A| - |A ∩ B|',
    answerLatex: '|A - B| = |A| - |A \\cap B|',
    acceptedVariants: ['|A - B| = |A| - |A ∩ B|'],
    formatHint: '|A| - |A ∩ B|',
    explanation:
      '$A$ partitions into two disjoint regions: $(A - B)$ and $(A \\cap B)$. Hence $|A| = |A - B| + |A \\cap B| \\implies |A - B| = |A| - |A \\cap B|$. Symmetrically, "only $B$" is $|B - A| = |B| - |A \\cap B|$.',
  },
  {
    id: 'w03-04',
    week: 3,
    topic: 'Only-A in a Three-Set Venn Diagram',
    category: 'worked-example',
    question:
      'In a survey of students taking courses $A, B, C$, $|A| = 50$, $|A \\cap B| = 18$, $|A \\cap C| = 15$, and $|A \\cap B \\cap C| = 7$. How many students take **only** course $A$?',
    answer: '24',
    answerLatex: '|A \\setminus (B \\cup C)| = 50 - 18 - 15 + 7 = 24',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Using Venn diagram region subtraction: $$|A \\setminus (B \\cup C)| = |A| - |A \\cap B| - |A \\cap C| + |A \\cap B \\cap C| = 50 - 18 - 15 + 7 = 24.$$',
  },
  {
    id: 'w03-05',
    week: 3,
    topic: 'Pairwise Intersection Calculation',
    category: 'worked-example',
    question:
      'Out of $80$ CS students who all use Python ($P$) or Java ($J$), $|P| = 52$ and $|J| = 47$. Find $|P \\cap J|$.',
    answer: '19',
    answerLatex: '|P \\cap J| = 52 + 47 - 80 = 19',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Since every student uses at least one language, $|P \\cup J| = 80$. Rearranging $|P \\cup J| = |P| + |J| - |P \\cap J|$ gives $$|P \\cap J| = 52 + 47 - 80 = 19.$$',
  },
  {
    id: 'w03-06',
    week: 3,
    topic: 'Triple Intersection Calculation',
    category: 'worked-example',
    question:
      'Suppose $|A \\cup B \\cup C| = 100$, $|A| = 45$, $|B| = 50$, $|C| = 40$, $|A \\cap B| = 15$, $|A \\cap C| = 12$, and $|B \\cap C| = 14$. Compute $|A \\cap B \\cap C|$.',
    answer: '6',
    answerLatex: '|A \\cap B \\cap C| = 100 - (45 + 50 + 40) + (15 + 12 + 14) = 6',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'From $100 = 45 + 50 + 40 - 15 - 12 - 14 + |A \\cap B \\cap C|$, we compute $100 = 135 - 41 + |A \\cap B \\cap C| = 94 + |A \\cap B \\cap C| \\implies |A \\cap B \\cap C| = 6$.',
  },
  {
    id: 'w03-07',
    week: 3,
    topic: 'Neither-Category Formula',
    category: 'formula',
    question:
      'Given universal set $U$ and events $A, B$, write the cardinality formula for elements in **neither** $A$ nor $B$ in terms of $|U|$ and $|A \\cup B|$.',
    answer: '|U| - |A ∪ B|',
    answerLatex: '|\\overline{A \\cup B}| = |U| - |A \\cup B|',
    acceptedVariants: [],
    formatHint: '|U| - |A ∪ B|',
    explanation:
      'By De Morgan’s law for sets, $\\overline{A} \\cap \\overline{B} = \\overline{A \\cup B}$. Since $A \\cup B \\subseteq U$, $|\\overline{A \\cup B}| = |U| - |A \\cup B|$.',
  },
  {
    id: 'w03-08',
    week: 3,
    topic: 'Neither-Category Word Problem',
    category: 'worked-example',
    question:
      'In a cohort of $120$ WIX1001 students, $70$ join the AI club, $55$ join the Cybersecurity club, and $25$ join both. How many students join **neither** club?',
    answer: '20',
    answerLatex: '120 - (70 + 55 - 25) = 20',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'First compute at least one club: $|A \\cup C| = 70 + 55 - 25 = 100$. Subtracting from $|U| = 120$ gives $|\\overline{A \\cup C}| = 120 - 100 = 20$.',
  },
  {
    id: 'w03-09',
    week: 3,
    topic: 'Translating Word Problems into Set Equations',
    category: 'concept',
    question:
      'Translate "elements belonging to $A$ and $B$, but **not** $C$" into set notation using $\\cap$ and $-$ (without complement symbols).',
    answer: '(A ∩ B) - C',
    answerLatex: '(A \\cap B) - C',
    acceptedVariants: ['A ∩ B - C'],
    formatHint: '(A ∩ B) - C',
    explanation:
      '"In both $A$ and $B$" is $A \\cap B$; excluding elements of $C$ gives $(A \\cap B) - C$, whose cardinality is $|A \\cap B| - |A \\cap B \\cap C|$.',
  },

  // ============================================================================
  // WEEK 4: Propositional Logic (10 cards)
  // ============================================================================
  {
    id: 'w04-01',
    week: 4,
    topic: 'Propositions and Truth Values',
    category: 'definition',
    question:
      'Is the sentence "$x + 3 = 7$" (with free variable $x$) a proposition? Answer `Yes` or `No`.',
    answer: 'No',
    answerLatex: '\\text{No (it is an open predicate } P(x)\\text{)}',
    caseSensitive: false,
    acceptedVariants: [],
    formatHint: 'Yes or No',
    explanation:
      'A **proposition** is a declarative sentence that is definitively either **True ($T$)** or **False ($F$)**, never both or indeterminate. "$x + 3 = 7$" depends on $x$, so it is a predicate $P(x)$ rather than a proposition until $x$ is bound or assigned.',
  },
  {
    id: 'w04-02',
    week: 4,
    topic: 'Negation, Conjunction, and Disjunction',
    category: 'concept',
    question:
      'Suppose $p = T$ and $q = F$. Write the truth values of $\\neg p$, $p \\land q$, and $p \\lor q$ in order separated by commas (using `T` and `F`).',
    answer: 'F, F, T',
    answerLatex: '\\neg p = F,\\quad p \\land q = F,\\quad p \\lor q = T',
    acceptedVariants: [],
    formatHint: 'F, F, T format',
    explanation:
      '- Negation $\\neg p$: flips $T \\mapsto F$.\n- Conjunction $p \\land q$: true only when both $p = T$ and $q = T$, so $T \\land F = F$.\n- Inclusive disjunction $p \\lor q$: true whenever at least one operand is $T$, so $T \\lor F = T$.',
  },
  {
    id: 'w04-03',
    week: 4,
    topic: 'Implication Falsity Condition',
    category: 'concept',
    question:
      'For what truth assignment $(p, q)$ is the conditional proposition $p \\to q$ **false**? Write as an ordered pair using `T` and `F`.',
    answer: '(T, F)',
    answerLatex: '(p, q) = (T, F)',
    acceptedVariants: ['p = T, q = F'],
    formatHint: 'Ordered pair (T, F)',
    explanation:
      'An implication $p \\to q$ ("if $p$, then $q$") is false **only** when the hypothesis $p$ is True and the conclusion $q$ is False. When $p = F$, $p \\to q$ is vacuously True.',
  },
  {
    id: 'w04-04',
    week: 4,
    topic: 'Implication Disjunctive Equivalence',
    category: 'formula',
    question:
      'Express the conditional proposition $p \\to q$ as an equivalent disjunction using only $\\neg$, $\\lor$, $p$, and $q$.',
    answer: '¬p ∨ q',
    answerLatex: 'p \\to q \\equiv \\neg p \\lor q',
    acceptedVariants: ['q ∨ ¬p'],
    formatHint: '¬p ∨ q',
    explanation:
      'Because $p \\to q$ is false solely when $p = T$ and $q = F$, it has the exact same truth table as $\\neg p \\lor q$. This identity is essential when negating implications: $\\neg(p \\to q) \\equiv \\neg(\\neg p \\lor q) \\equiv p \\land \\neg q$.',
  },
  {
    id: 'w04-05',
    week: 4,
    topic: 'Biconditional Proposition',
    category: 'formula',
    question:
      'Express the biconditional $p \\leftrightarrow q$ as a conjunction of two implications.',
    answer: '(p → q) ∧ (q → p)',
    answerLatex: 'p \\leftrightarrow q \\equiv (p \\to q) \\land (q \\to p)',
    acceptedVariants: ['(q → p) ∧ (p → q)'],
    formatHint: '(p → q) ∧ (q → p)',
    explanation:
      '$p \\leftrightarrow q$ ("$p$ if and only if $q$") is True precisely when $p$ and $q$ have identical truth values ($TT$ or $FF$), matching $(p \\to q) \\land (q \\to p)$.',
  },
  {
    id: 'w04-06',
    week: 4,
    topic: 'Truth Table Size',
    category: 'formula',
    question:
      'How many rows (truth assignments) are in a complete truth table for a compound proposition with $n$ distinct propositional variables?',
    answer: '2^n',
    answerLatex: '2^n',
    acceptedVariants: [],
    formatHint: 'Expression in terms of n',
    explanation:
      'Each of the $n$ independent propositional variables can take $2$ values ($T$ or $F$). By the product rule, there are $2 \\times 2 \\times \\dots \\times 2 = 2^n$ distinct rows.',
  },
  {
    id: 'w04-07',
    week: 4,
    topic: 'Contrapositive of an Implication',
    category: 'formula',
    question:
      'Write the **contrapositive** of the conditional statement $p \\to q$, which is logically equivalent to $p \\to q$.',
    answer: '¬q → ¬p',
    answerLatex: '\\neg q \\to \\neg p',
    acceptedVariants: [],
    formatHint: '¬q → ¬p',
    explanation:
      'For $p \\to q$:\n- **Converse:** $q \\to p$ (not equivalent)\n- **Inverse:** $\\neg p \\to \\neg q$ (not equivalent)\n- **Contrapositive:** $\\neg q \\to \\neg p$ (**always logically equivalent** to $p \\to q$!).',
  },
  {
    id: 'w04-08',
    week: 4,
    topic: 'Tautology, Contradiction, and Contingency',
    category: 'definition',
    question:
      'Classify the compound proposition $p \\lor \\neg p$ as a `Tautology`, `Contradiction`, or `Contingency`.',
    answer: 'Tautology',
    answerLatex: 'p \\lor \\neg p \\equiv T \\quad (\\text{Tautology})',
    caseSensitive: false,
    acceptedVariants: [],
    formatHint: 'Single classification term',
    explanation:
      '- **Tautology:** always $T$ under every truth assignment (e.g., $p \\lor \\neg p$).\n- **Contradiction:** always $F$ under every assignment (e.g., $p \\land \\neg p$).\n- **Contingency:** sometimes $T$ and sometimes $F$ (e.g., $p \\to q$).',
  },
  {
    id: 'w04-09',
    week: 4,
    topic: 'Contradiction Classification',
    category: 'definition',
    question:
      'Classify the compound proposition $(p \\land q) \\land \\neg p$ as a `Tautology`, `Contradiction`, or `Contingency`.',
    answer: 'Contradiction',
    answerLatex: '(p \\land q) \\land \\neg p \\equiv F \\quad (\\text{Contradiction})',
    caseSensitive: false,
    acceptedVariants: [],
    formatHint: 'Single classification term',
    explanation:
      'By commutativity and associativity, $(p \\land q) \\land \\neg p \\equiv (p \\land \\neg p) \\land q \\equiv F \\land q \\equiv F$, which is always False.',
  },
  {
    id: 'w04-10',
    week: 4,
    topic: 'Evaluating Compound Logical Expressions',
    category: 'worked-example',
    question:
      'Evaluate $(p \\land \\neg q) \\to r$ when $p = T$, $q = F$, and $r = F$. Answer `T` or `F`.',
    answer: 'F',
    answerLatex: '(T \\land \\neg F) \\to F \\equiv (T \\land T) \\to F \\equiv T \\to F \\equiv F',
    acceptedVariants: ['False'],
    formatHint: 'T or F',
    explanation:
      'Step by step:\n1. $\\neg q = \\neg F = T$\n2. $p \\land \\neg q = T \\land T = T$\n3. $(p \\land \\neg q) \\to r = T \\to F = F$.',
  },

  // ============================================================================
  // WEEK 5: Predicate Logic and Formal Proofs (12 cards)
  // ============================================================================
  {
    id: 'w05-01',
    week: 5,
    topic: 'Universal Quantification',
    category: 'worked-example',
    question:
      'Over the domain of discourse $\\mathbb{Z}$ (all integers), determine the truth value (`T` or `F`) of $\\forall x \\, (x^2 \\ge x)$.',
    answer: 'T',
    answerLatex: '\\forall x \\in \\mathbb{Z},\\; x^2 \\ge x \\quad (T)',
    acceptedVariants: ['True'],
    formatHint: 'T or F',
    explanation:
      'Notice how domain of discourse matters! Over $\\mathbb{R}$, $x = 1/2$ gives $(1/2)^2 = 1/4 < 1/2$ ($F$). Over $\\mathbb{Z}$, for $x \\le 0$, $x^2 \\ge 0 \\ge x$; for $x = 1$, $1 \\ge 1$; for $x \\ge 2$, $x^2 > x$. Thus over $\\mathbb{Z}$ it is **True ($T$)**.',
  },
  {
    id: 'w05-02',
    week: 5,
    topic: 'Existential Quantification',
    category: 'worked-example',
    question:
      'Over the domain $\\mathbb{N} = \\{1, 2, 3, \\dots\\}$, determine the truth value (`T` or `F`) of $\\exists x \\, (x^2 = 2)$.',
    answer: 'F',
    answerLatex: '\\exists x \\in \\mathbb{N},\\; x^2 = 2 \\quad (F)',
    acceptedVariants: ['False'],
    formatHint: 'T or F',
    explanation:
      'Since $1^2 = 1 < 2$ and $2^2 = 4 > 2$ (and $x^2$ strictly increases on $\\mathbb{N}$), no natural number satisfies $x^2 = 2$. Hence $\\exists x \\in \\mathbb{N}\\, (x^2 = 2)$ is **False ($F$)**.',
  },
  {
    id: 'w05-03',
    week: 5,
    topic: 'Negating Universal Quantifiers',
    category: 'formula',
    question:
      'State De Morgan’s Law for negating a universally quantified statement $\\neg \\forall x \\, P(x)$.',
    answer: '∃x ¬P(x)',
    answerLatex: '\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)',
    acceptedVariants: ['∃x (¬P(x))'],
    formatHint: '∃x ¬P(x)',
    explanation:
      'Saying "it is not true that every $x$ satisfies $P(x)$" is equivalent to asserting "there exists at least one counterexample $x$ such that $\\neg P(x)$ holds": $$\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x).$$',
  },
  {
    id: 'w05-04',
    week: 5,
    topic: 'Negating Existential Quantifiers',
    category: 'formula',
    question:
      'State De Morgan’s Law for negating an existentially quantified statement $\\neg \\exists x \\, P(x)$.',
    answer: '∀x ¬P(x)',
    answerLatex: '\\neg \\exists x\\, P(x) \\equiv \\forall x\\, \\neg P(x)',
    acceptedVariants: ['∀x (¬P(x))'],
    formatHint: '∀x ¬P(x)',
    explanation:
      'Saying "there does not exist any $x$ with property $P(x)$" means every $x$ in the domain fails $P(x)$: $$\\neg \\exists x\\, P(x) \\equiv \\forall x\\, \\neg P(x).$$',
  },
  {
    id: 'w05-05',
    week: 5,
    topic: 'De Morgan’s First Propositional Law',
    category: 'formula',
    question: 'Apply De Morgan’s Law to rewrite $\\neg(p \\land q)$ without parentheses.',
    answer: '¬p ∨ ¬q',
    answerLatex: '\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q',
    acceptedVariants: ['¬q ∨ ¬p'],
    formatHint: '¬p ∨ ¬q',
    explanation:
      'De Morgan’s two laws distribute negation across conjunction/disjunction while flipping $\\land \\leftrightarrow \\lor$: $$\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q, \\qquad \\neg(p \\lor q) \\equiv \\neg p \\land \\neg q.$$',
  },
  {
    id: 'w05-06',
    week: 5,
    topic: 'Distributive, Commutative, and Associative Laws',
    category: 'formula',
    question:
      'Expand $p \\land (q \\lor r)$ using the **Distributive Law** of conjunction over disjunction.',
    answer: '(p ∧ q) ∨ (p ∧ r)',
    answerLatex: 'p \\land (q \\lor r) \\equiv (p \\land q) \\lor (p \\land r)',
    acceptedVariants: [],
    formatHint: '(p ∧ q) ∨ (p ∧ r)',
    explanation:
      'Key algebraic laws of logic:\n- **Commutative:** $p \\land q \\equiv q \\land p$\n- **Associative:** $(p \\land q) \\land r \\equiv p \\land (q \\land r)$\n- **Distributive:** $p \\land (q \\lor r) \\equiv (p \\land q) \\lor (p \\land r)$ and $p \\lor (q \\land r) \\equiv (p \\lor q) \\land (p \\lor r)$.',
  },
  {
    id: 'w05-07',
    week: 5,
    topic: 'Absorption Law',
    category: 'formula',
    question: 'Simplify $p \\lor (p \\land q)$ to a single propositional variable using the Absorption Law.',
    answer: 'p',
    answerLatex: 'p \\lor (p \\land q) \\equiv p',
    acceptedVariants: [],
    formatHint: 'Single variable',
    explanation:
      'Both Absorption Laws state: $$p \\lor (p \\land q) \\equiv p \\qquad \\text{and} \\qquad p \\land (p \\lor q) \\equiv p.$$ Proof: $p \\lor (p \\land q) \\equiv (p \\land T) \\lor (p \\land q) \\equiv p \\land (T \\lor q) \\equiv p \\land T \\equiv p$.',
  },
  {
    id: 'w05-08',
    week: 5,
    topic: 'Direct Proof Strategy',
    category: 'proof',
    question:
      'In a **direct proof** of $p \\to q$, we assume $p$ is true and deduce what target proposition?',
    answer: 'q',
    answerLatex: '\\text{Assume } p \\implies \\dots \\implies q',
    acceptedVariants: [],
    formatHint: 'Single proposition symbol',
    explanation:
      'A direct proof of $\\forall x (P(x) \\to Q(x))$ fixes an arbitrary $x$, assumes $P(x)$ is true, applies definitions and axioms step-by-step, and concludes $Q(x)$ is true.',
  },
  {
    id: 'w05-09',
    week: 5,
    topic: 'Proof by Contraposition Structure',
    category: 'proof',
    question:
      'In a **proof by contraposition** of $p \\to q$, what implication do we prove directly instead?',
    answer: '¬q → ¬p',
    answerLatex: '\\neg q \\to \\neg p',
    acceptedVariants: [],
    formatHint: 'Implication using ¬, p, q',
    explanation:
      'Because $(p \\to q) \\equiv (\\neg q \\to \\neg p)$, proving $\\neg q \\to \\neg p$ directly establishes $p \\to q$. Example: to prove "if $3n + 2$ is odd, then $n$ is odd", assume $n = 2k$ is even ($\\neg q$), giving $3n + 2 = 2(3k + 1)$ even ($\\neg p$).',
  },
  {
    id: 'w05-10',
    week: 5,
    topic: 'Proof by Contradiction Assumption',
    category: 'proof',
    question:
      'To prove $p \\to q$ by **contradiction**, write the compound assumption $\\neg(p \\to q)$ in simplified conjunction form that begins the proof.',
    answer: 'p ∧ ¬q',
    answerLatex: 'p \\land \\neg q',
    acceptedVariants: ['¬q ∧ p'],
    formatHint: 'p ∧ ¬q',
    explanation:
      'To prove $p \\to q$ by contradiction, we assume $\\neg(p \\to q) \\equiv p \\land \\neg q$ (i.e., $p$ holds **and** $q$ is false) and derive a logical contradiction $r \\land \\neg r$, forcing $p \\to q$ to be true.',
  },
  {
    id: 'w05-11',
    week: 5,
    topic: 'Even and Odd Integer Parity Proofs',
    category: 'proof',
    question:
      'In a formal parity proof, if an integer $n$ is **odd** ($n = 2k + 1$ for $k \\in \\mathbb{Z}$), expand $n^2$ in the factored form $2(\\dots) + 1$ to show $n^2$ is odd.',
    answer: '2(2k^2 + 2k) + 1',
    answerLatex: 'n^2 = (2k + 1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1',
    acceptedVariants: ['n^2 = 2(2k^2 + 2k) + 1'],
    formatHint: '2(2k^2 + 2k) + 1',
    explanation:
      'Let $n = 2k + 1$ with $k \\in \\mathbb{Z}$. Squaring gives $$n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1.$$ Setting $m = 2k^2 + 2k \\in \\mathbb{Z}$ gives $n^2 = 2m + 1$, proving $n^2$ is odd.',
  },
  {
    id: 'w05-12',
    week: 5,
    topic: 'Divisibility and Counterexamples',
    category: 'proof',
    question:
      'Give the smallest prime **counterexample** $p \\in \\mathbb{N}$ that disproves the claim "For every prime $p$, $2^p - 1$ is prime" (hint: check $p = 2, 3, 5, 7, 11$).',
    answer: '11',
    answerLatex: 'p = 11 \\implies 2^{11} - 1 = 2047 = 23 \\times 89',
    acceptedVariants: ['p = 11'],
    formatHint: 'Integer prime value',
    explanation:
      'Recall integer divisibility: $a \\mid b \\iff \\exists k \\in \\mathbb{Z}\\, (b = ak)$. Checking primes: $2^2-1=3$, $2^3-1=7$, $2^5-1=31$, $2^7-1=127$ are all prime, but at $p = 11$, $$2^{11} - 1 = 2047 = 23 \\times 89,$$ so $23 \\mid 2047$ — a single counterexample disproves $\\forall p\\, P(p)$!',
  },

  // ============================================================================
  // WEEK 6: Functions (10 cards)
  // ============================================================================
  {
    id: 'w06-01',
    week: 6,
    topic: 'Domain, Codomain, and Range',
    category: 'definition',
    question:
      'For $f: \\{-2, -1, 0, 1, 2\\} \\to \\mathbb{Z}$ defined by $f(x) = x^2$, write the **range** (image) of $f$ in ascending roster notation.',
    answer: '{0, 1, 4}',
    answerLatex: '\\operatorname{Range}(f) = \\{0, 1, 4\\}',
    acceptedVariants: [],
    formatHint: 'Roster set {a, b, c}',
    explanation:
      'Here the **domain** is $\\{-2, -1, 0, 1, 2\\}$ and the **codomain** is $\\mathbb{Z}$. Evaluating $f$ at each input produces $f(\\pm 2) = 4$, $f(\\pm 1) = 1$, $f(0) = 0$, so the **range** $f(A) \\subseteq \\mathbb{Z}$ is $\\{0, 1, 4\\}$.',
  },
  {
    id: 'w06-02',
    week: 6,
    topic: 'Injective (One-to-One) Definition',
    category: 'definition',
    question:
      'Write the quantified implication inside $\\forall a, b \\in A,\\; (\\dots)$ that defines $f: A \\to B$ being **injective**.',
    answer: 'f(a) = f(b) → a = b',
    answerLatex: '\\forall a, b \\in A,\\; (f(a) = f(b) \\to a = b)',
    acceptedVariants: ['∀a, b ∈ A, f(a) = f(b) → a = b'],
    formatHint: 'f(a) = f(b) → a = b',
    explanation:
      '$f: A \\to B$ is **injective** (one-to-one) iff distinct inputs map to distinct outputs ($a \\neq b \\to f(a) \\neq f(b)$), whose contrapositive used in algebraic proofs is $$\\forall a, b \\in A,\\; f(a) = f(b) \\to a = b.$$',
  },
  {
    id: 'w06-03',
    week: 6,
    topic: 'Surjective (Onto) Definition',
    category: 'definition',
    question:
      'Write the formal quantified definition stating that $f: A \\to B$ is **surjective** (onto), using variables $b \\in B$ and $a \\in A$.',
    answer: '∀b ∈ B, ∃a ∈ A, f(a) = b',
    answerLatex: '\\forall b \\in B,\\; \\exists a \\in A,\\; f(a) = b',
    acceptedVariants: ['∀b ∈ B ∃a ∈ A (f(a) = b)', '∀b ∈ B, ∃a ∈ A (f(a) = b)'],
    formatHint: '∀b ∈ B, ∃a ∈ A, f(a) = b',
    explanation:
      '$f: A \\to B$ is **surjective** iff its range equals its entire codomain ($f(A) = B$), meaning for every target $b \\in B$, there exists at least one preimage $a \\in A$ with $f(a) = b$.',
  },
  {
    id: 'w06-04',
    week: 6,
    topic: 'Bijective Functions',
    category: 'definition',
    question:
      'What two properties must $f: A \\to B$ satisfy simultaneously to be **bijective**? Answer as `... and ...`.',
    answer: 'Injective and surjective',
    answerLatex: '\\text{Injective (one-to-one) and Surjective (onto)}',
    caseSensitive: false,
    acceptedVariants: ['One-to-one and onto', 'Surjective and injective'],
    formatHint: 'Injective and surjective',
    explanation:
      'A **bijection** (one-to-one correspondence) is both **injective** and **surjective**: every element $b \\in B$ has a **unique** preimage $a \\in A$. For finite sets, a bijection $f: A \\to B$ exists iff $|A| = |B|$.',
  },
  {
    id: 'w06-05',
    week: 6,
    topic: 'Condition for Existence of Inverse Function',
    category: 'concept',
    question:
      'A function $f: A \\to B$ possesses a well-defined inverse function $f^{-1}: B \\to A$ if and only if $f$ is what type of function? (One word)',
    answer: 'Bijective',
    answerLatex: 'f^{-1}: B \\to A \\text{ exists} \\iff f \\text{ is bijective}',
    caseSensitive: false,
    acceptedVariants: ['A bijection'],
    formatHint: 'Single classification word',
    explanation:
      '- Without **surjectivity**, some $b \\in B$ has no preimage, leaving $f^{-1}(b)$ undefined.\n- Without **injectivity**, some $b \\in B$ has multiple preimages, violating single-valuedness of $f^{-1}(b)$.\nThus $f$ is invertible iff $f$ is **bijective**.',
  },
  {
    id: 'w06-06',
    week: 6,
    topic: 'Function Composition Definition',
    category: 'formula',
    question:
      'For $g: A \\to B$ and $f: B \\to C$, write the evaluation rule defining $(f \\circ g)(x)$ for $x \\in A$.',
    answer: 'f(g(x))',
    answerLatex: '(f \\circ g)(x) = f(g(x))',
    acceptedVariants: ['(f o g)(x) = f(g(x))'],
    formatHint: 'Nested function application',
    explanation:
      'In $(f \\circ g)(x) = f(g(x))$, the inner function $g$ acts first ($A \\to B$) and $f$ acts second ($B \\to C$). Function composition is associative, $h \\circ (g \\circ f) = (h \\circ g) \\circ f$, automatic when types align, **not** commutative in general.',
  },
  {
    id: 'w06-07',
    week: 6,
    topic: 'Evaluating Function Composition',
    category: 'worked-example',
    question:
      'Let $f(x) = 2x + 3$ and $g(x) = x^2$ on $\\mathbb{R}$. Write the simplified polynomial expression for $(f \\circ g)(x)$.',
    answer: '2x^2 + 3',
    answerLatex: '(f \\circ g)(x) = f(g(x)) = 2x^2 + 3',
    acceptedVariants: [],
    formatHint: 'Polynomial in x',
    explanation:
      'Compute $f(g(x)) = f(x^2) = 2(x^2) + 3 = 2x^2 + 3$. Contrast this with $(g \\circ f)(x) = g(2x + 3) = (2x + 3)^2 = 4x^2 + 12x + 9 \\neq (f \\circ g)(x)$!',
  },
  {
    id: 'w06-08',
    week: 6,
    topic: 'Computing an Explicit Inverse Function',
    category: 'worked-example',
    question:
      'Find the inverse function formula $f^{-1}(x)$ for the bijection $f: \\mathbb{R} \\to \\mathbb{R}$ given by $f(x) = 3x - 5$.',
    answer: '(x + 5) / 3',
    answerLatex: 'f^{-1}(x) = \\frac{x + 5}{3}',
    acceptedVariants: ['f^(-1)(x) = (x + 5) / 3'],
    formatHint: '(x + 5) / 3',
    explanation:
      'Set $y = 3x - 5$ and solve for $x$ in terms of $y$: $$y + 5 = 3x \\implies x = \\frac{y + 5}{3}.$$ Replacing $y$ with $x$ gives $f^{-1}(x) = \\frac{x + 5}{3}$.',
  },
  {
    id: 'w06-09',
    week: 6,
    topic: 'Classifying Functions Over ℤ',
    category: 'worked-example',
    question:
      'Classify $f: \\mathbb{Z} \\to \\mathbb{Z}$ defined by $f(n) = n + 4$ as `Injective only`, `Surjective only`, `Bijective`, or `Neither`.',
    answer: 'Bijective',
    answerLatex: 'f(n) = n + 4 \\text{ on } \\mathbb{Z} \\text{ is Bijective}',
    caseSensitive: false,
    acceptedVariants: [],
    formatHint: 'Classification phrase from prompt',
    explanation:
      '- **Injective:** $a + 4 = b + 4 \\implies a = b$.\n- **Surjective:** For any $m \\in \\mathbb{Z}$, choose $n = m - 4 \\in \\mathbb{Z}$; then $f(m - 4) = m$.\nHence $f$ is **Bijective** with $f^{-1}(m) = m - 4$. (By contrast, $g(n) = 2n$ on $\\mathbb{Z}$ is injective only!)',
  },
  {
    id: 'w06-10',
    week: 6,
    topic: 'Counting Functions Between Finite Sets',
    category: 'formula',
    question:
      'If $|A| = 3$ and $|B| = 2$, how many total functions $f: A \\to B$ exist?',
    answer: '8',
    answerLatex: '|B|^{|A|} = 2^3 = 8',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Each of the $|A| = 3$ elements of the domain $A$ independently picks any of the $|B| = 2$ images in $B$, giving $|B|^{|A|} = 2^3 = 8$ functions (and by the Pigeonhole Principle, $0$ of them are injective since $|A| > |B|$).',
  },

  // ============================================================================
  // WEEK 7: Test 1 Assessment and Milestone Drill (Weeks 1–6 Mixed Synthesis, 10 cards)
  // ============================================================================
  {
    id: 'w07-01',
    week: 7,
    topic: 'Test 1 Synthesis · Discriminant & Real Roots',
    category: 'worked-example',
    question:
      'For $x^2 - 6x + k = 0$ to have **two distinct real roots**, write the strict inequality that $k$ must satisfy.',
    answer: 'k < 9',
    answerLatex: '\\Delta = (-6)^2 - 4(1)(k) = 36 - 4k > 0 \\iff k < 9',
    acceptedVariants: ['9 > k'],
    formatHint: 'Inequality in k (e.g. k < value)',
    explanation:
      'Two distinct real roots require $\\Delta = b^2 - 4ac > 0$: $$(-6)^2 - 4(1)(k) > 0 \\implies 36 - 4k > 0 \\implies 4k < 36 \\implies k < 9.$$',
  },
  {
    id: 'w07-02',
    week: 7,
    topic: 'Test 1 Synthesis · Power Set of Cartesian Product',
    category: 'worked-example',
    question:
      'If $|A| = 2$ and $|B| = 3$, compute the exact numerical value of $|P(A \\times B)|$.',
    answer: '64',
    answerLatex: '|P(A \\times B)| = 2^{|A \\times B|} = 2^{2 \\cdot 3} = 2^6 = 64',
    acceptedVariants: ['2^6'],
    formatHint: 'Integer value',
    explanation:
      'Combine Week 2 identities step-by-step: $|A \\times B| = |A| \\cdot |B| = 2 \\times 3 = 6$, and therefore $|P(A \\times B)| = 2^{|A \\times B|} = 2^6 = 64$.',
  },
  {
    id: 'w07-03',
    week: 7,
    topic: 'Test 1 Synthesis · Set Algebra Simplification',
    category: 'concept',
    question: 'Simplify the set expression $(A - B) \\cup (A \\cap B)$ to a single set symbol.',
    answer: 'A',
    answerLatex: '(A - B) \\cup (A \\cap B) = A',
    acceptedVariants: [],
    formatHint: 'Single capital set letter',
    explanation:
      'Writing $A - B = A \\cap \\overline{B}$, apply distributivity: $$(A \\cap \\overline{B}) \\cup (A \\cap B) = A \\cap (\\overline{B} \\cup B) = A \\cap U = A.$$',
  },
  {
    id: 'w07-04',
    week: 7,
    topic: 'Test 1 Synthesis · Exam Inclusion-Exclusion Drill',
    category: 'worked-example',
    question:
      'Among $150$ students, $80$ take Discrete Math ($D$), $70$ take Programming ($P$), $60$ take Systems ($S$), $35$ take $D \\cap P$, $30$ take $D \\cap S$, $25$ take $P \\cap S$, and $15$ take all three. How many take **none** of the three courses?',
    answer: '15',
    answerLatex: '150 - (80 + 70 + 60 - 35 - 30 - 25 + 15) = 150 - 135 = 15',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'First compute $|D \\cup P \\cup S| = (80 + 70 + 60) - (35 + 30 + 25) + 15 = 210 - 90 + 15 = 135$. Then students in none $= 150 - 135 = 15$.',
  },
  {
    id: 'w07-05',
    week: 7,
    topic: 'Test 1 Synthesis · Modus Ponens Tautology',
    category: 'concept',
    question:
      'Classify the inference formula $((p \\to q) \\land p) \\to q$ as a `Tautology`, `Contradiction`, or `Contingency`.',
    answer: 'Tautology',
    answerLatex: '((p \\to q) \\land p) \\to q \\equiv T \\quad (\\text{Modus Ponens Tautology})',
    caseSensitive: false,
    acceptedVariants: [],
    formatHint: 'Tautology, Contradiction, or Contingency',
    explanation:
      'If $((p \\to q) \\land p) = T$, both $p = T$ and $p \\to q = T$, forcing $q = T$; otherwise the hypothesis is $F$ and the implication is vacuously $T$. Hence **Modus Ponens** is always a **Tautology**.',
  },
  {
    id: 'w07-06',
    week: 7,
    topic: 'Test 1 Synthesis · Negating Quantified Implication',
    category: 'formula',
    question:
      'Push the negation completely inside $\\neg \\forall x \\, (P(x) \\to Q(x))$ using $\\exists$, $\\land$, and $\\neg$ (no `→`).',
    answer: '∃x (P(x) ∧ ¬Q(x))',
    answerLatex: '\\neg \\forall x\\, (P(x) \\to Q(x)) \\equiv \\exists x\\, (P(x) \\land \\neg Q(x))',
    acceptedVariants: ['∃x, P(x) ∧ ¬Q(x)'],
    formatHint: '∃x (P(x) ∧ ¬Q(x))',
    explanation:
      'Step 1: $\\neg \\forall x (P(x) \\to Q(x)) \\equiv \\exists x\\, \\neg(P(x) \\to Q(x))$.\nStep 2: Since $P(x) \\to Q(x) \\equiv \\neg P(x) \\lor Q(x)$, De Morgan gives $\\neg(\\neg P(x) \\lor Q(x)) \\equiv P(x) \\land \\neg Q(x)$.',
  },
  {
    id: 'w07-07',
    week: 7,
    topic: 'Test 1 Synthesis · Proof Method Selection',
    category: 'proof',
    question:
      'To cleanly avoid taking square roots when proving "For $n \\in \\mathbb{Z}$, if $n^2$ is even, then $n$ is even", which indirect proof technique proves "If $n$ is odd, then $n^2$ is odd"? (`Direct proof`, `Proof by contraposition`, or `Counterexample`)',
    answer: 'Proof by contraposition',
    answerLatex: '\\text{Proof by contraposition: } (n \\text{ odd} \\to n^2 \\text{ odd})',
    caseSensitive: false,
    acceptedVariants: ['Contraposition'],
    formatHint: 'Proof technique name',
    explanation:
      'Assuming $n^2 = 2k$ directly leaves $n = \\pm\\sqrt{2k}$, whereas **proof by contraposition** assumes $n = 2k + 1$ (odd) and immediately computes $n^2 = 2(2k^2 + 2k) + 1$ (odd).',
  },
  {
    id: 'w07-08',
    week: 7,
    topic: 'Test 1 Synthesis · Irrationality Proof Method',
    category: 'proof',
    question:
      'Classic theorem: "$\\sqrt{2}$ is irrational" starts by assuming $\\sqrt{2} = p/q$ in lowest terms ($\\gcd(p, q) = 1$) and deriving $2 \\mid p$ and $2 \\mid q$. Name this proof method.',
    answer: 'Proof by contradiction',
    answerLatex: '\\text{Proof by contradiction}',
    caseSensitive: false,
    acceptedVariants: ['Contradiction'],
    formatHint: 'Proof technique name',
    explanation:
      'Assuming $\\sqrt{2} \\in \\mathbb{Q}$ leads to $2q^2 = p^2 \\implies 2 \\mid p \\implies p = 2k \\implies q^2 = 2k^2 \\implies 2 \\mid q$, contradicting $\\gcd(p, q) = 1$. That is **proof by contradiction**.',
  },
  {
    id: 'w07-09',
    week: 7,
    topic: 'Test 1 Synthesis · Inverse of Composition',
    category: 'formula',
    question:
      'For bijections $f: A \\to B$ and $g: B \\to C$, express $(g \\circ f)^{-1}$ in terms of $f^{-1}$, $g^{-1}$, and $\\circ$ (use `f^(-1) o g^(-1)` or toolbar symbols).',
    answer: 'f^(-1) ∘ g^(-1)',
    answerLatex: '(g \\circ f)^{-1} = f^{-1} \\circ g^{-1}',
    acceptedVariants: ['f^(-1) o g^(-1)', 'f⁻¹ ∘ g⁻¹'],
    formatHint: 'f^(-1) ∘ g^(-1)',
    explanation:
      'By the "socks-and-shoes" property, undoing $g \\circ f$ requires first undoing $g$ via $g^{-1}: C \\to B$ and then undoing $f$ via $f^{-1}: B \\to A$: $$(g \\circ f)^{-1} = f^{-1} \\circ g^{-1}.$$',
  },
  {
    id: 'w07-10',
    week: 7,
    topic: 'Test 1 Synthesis · Function Classification Trap',
    category: 'worked-example',
    question:
      'Classify $f: \\mathbb{R} \\to \\mathbb{R}$ given by $f(x) = x^2$ as `Injective only`, `Surjective only`, `Bijective`, or `Neither`.',
    answer: 'Neither',
    answerLatex: 'f: \\mathbb{R} \\to \\mathbb{R},\\; f(x) = x^2 \\text{ is Neither injective nor surjective}',
    caseSensitive: false,
    acceptedVariants: [],
    formatHint: 'Single classification word',
    explanation:
      '- **Not injective:** $f(-1) = 1 = f(1)$ while $-1 \\neq 1$.\n- **Not surjective:** $-1 \\in \\mathbb{R}$ has no real preimage since $x^2 \\ge 0$ for all $x \\in \\mathbb{R}$.\nHence on $\\mathbb{R} \\to \\mathbb{R}$, $f(x) = x^2$ is **Neither**.',
  },
];
