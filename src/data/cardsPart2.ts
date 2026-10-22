import { Flashcard } from '../types';

export const CARDS_WEEKS_8_TO_14: Flashcard[] = [
  // ============================================================================
  // WEEK 8: Relations (10 cards)
  // ============================================================================
  {
    id: 'w08-01',
    week: 8,
    topic: 'Binary Relations as Cartesian Subsets',
    category: 'definition',
    question:
      'Formally, a binary relation $R$ from set $A$ to set $B$ is a subset of what set expression?',
    answer: 'A × B',
    answerLatex: 'R \\subseteq A \\times B',
    acceptedVariants: ['R ⊆ A × B'],
    formatHint: 'Cartesian product expression',
    explanation:
      'A binary relation from $A$ to $B$ is any subset $R \\subseteq A \\times B$. Since $|A \\times B| = |A||B|$, there are $2^{|A||B|}$ binary relations from $A$ to $B$ (and $2^{n^2}$ relations on an $n$-element set $A$).',
  },
  {
    id: 'w08-02',
    week: 8,
    topic: 'Reflexive Relations',
    category: 'definition',
    question:
      'Write the quantified condition for a relation $R$ on set $A$ to be **reflexive** using variable $a \\in A$.',
    answer: '∀a ∈ A, (a, a) ∈ R',
    answerLatex: '\\forall a \\in A,\\; (a, a) \\in R',
    acceptedVariants: ['∀a ∈ A ((a, a) ∈ R)'],
    formatHint: '∀a ∈ A, (a, a) ∈ R',
    explanation:
      'Every element $a \\in A$ must be related to itself: $(a, a) \\in R$. If $A = \\{1, 2, 3\\}$ and $R = \\{(1,1), (2,2)\\}$, $R$ is **not** reflexive because $(3, 3) \\notin R$.',
  },
  {
    id: 'w08-03',
    week: 8,
    topic: 'Symmetric Relations',
    category: 'definition',
    question:
      'Write the implication inside $\\forall a, b \\in A,\\; (\\dots)$ that defines a relation $R$ on $A$ being **symmetric**.',
    answer: '(a, b) ∈ R → (b, a) ∈ R',
    answerLatex: '\\forall a, b \\in A,\\; ((a, b) \\in R \\to (b, a) \\in R)',
    acceptedVariants: ['∀a, b ∈ A, (a, b) ∈ R → (b, a) ∈ R'],
    formatHint: '(a, b) ∈ R → (b, a) ∈ R',
    explanation:
      'Whenever $a$ is related to $b$, $b$ must also be related to $a$. In digraph terms, every non-loop directed edge has a matching opposite edge.',
  },
  {
    id: 'w08-04',
    week: 8,
    topic: 'Antisymmetric Relations',
    category: 'definition',
    question:
      'Write the implication inside $\\forall a, b \\in A,\\; (\\dots)$ that defines $R$ being **antisymmetric**.',
    answer: '((a, b) ∈ R ∧ (b, a) ∈ R) → a = b',
    answerLatex: '\\forall a, b \\in A,\\; (((a, b) \\in R \\land (b, a) \\in R) \\to a = b)',
    acceptedVariants: ['(a, b) ∈ R ∧ (b, a) ∈ R → a = b'],
    formatHint: '((a, b) ∈ R ∧ (b, a) ∈ R) → a = b',
    explanation:
      'No two *distinct* elements can mutually relate to each other. Note that **antisymmetric is NOT the negation of symmetric**: the identity relation $I_A = \\{(a, a) \\mid a \\in A\\}$ is both symmetric and antisymmetric!',
  },
  {
    id: 'w08-05',
    week: 8,
    topic: 'Transitive Relations',
    category: 'definition',
    question:
      'Write the implication inside $\\forall a, b, c \\in A,\\; (\\dots)$ that defines $R$ being **transitive**.',
    answer: '((a, b) ∈ R ∧ (b, c) ∈ R) → (a, c) ∈ R',
    answerLatex: '\\forall a, b, c \\in A,\\; (((a, b) \\in R \\land (b, c) \\in R) \\to (a, c) \\in R)',
    acceptedVariants: ['(a, b) ∈ R ∧ (b, c) ∈ R → (a, c) ∈ R'],
    formatHint: '((a, b) ∈ R ∧ (b, c) ∈ R) → (a, c) ∈ R',
    explanation:
      'Whenever a two-step chain $a \\to b \\to c$ exists in $R$, the direct shortcut $(a, c)$ must also belong to $R$.',
  },
  {
    id: 'w08-06',
    week: 8,
    topic: 'Equivalence Relations',
    category: 'definition',
    question:
      'List the three properties a relation $R$ on $A$ must satisfy to be an **equivalence relation** (in standard order: `..., ..., and ...`).',
    answer: 'Reflexive, symmetric, and transitive',
    answerLatex: '\\text{Reflexive, Symmetric, and Transitive}',
    caseSensitive: false,
    acceptedVariants: ['Reflexive, symmetric, transitive'],
    formatHint: 'Reflexive, symmetric, and transitive',
    explanation:
      '- **Equivalence relation:** Reflexive + Symmetric + Transitive (partitions $A$ into disjoint equivalence classes).\n- **Partial order:** Reflexive + Antisymmetric + Transitive (e.g., $(A, \\le)$ or $(\\mathbb{N}, \\mid)$).',
  },
  {
    id: 'w08-07',
    week: 8,
    topic: 'Equivalence Classes',
    category: 'worked-example',
    question:
      'On $A = \\{0, 1, 2, 3, 4, 5, 6\\}$, let $R$ be congruence modulo $3$: $(a, b) \\in R \\iff 3 \\mid (a - b)$. Write the equivalence class $[1]_R$ in ascending roster notation.',
    answer: '{1, 4}',
    answerLatex: '[1]_R = \\{x \\in A \\mid x \\equiv 1 \\pmod{3}\\} = \\{1, 4\\}',
    acceptedVariants: [],
    formatHint: 'Roster set { ... }',
    explanation:
      '$[a]_R = \\{x \\in A \\mid (a, x) \\in R\\}$. Testing elements of $A = \\{0,1,2,3,4,5,6\\}$ with remainder $1$ upon division by $3$ yields $[1]_R = \\{1, 4\\}$ (while $[0]_R = \\{0, 3, 6\\}$ and $[2]_R = \\{2, 5\\}$).',
  },
  {
    id: 'w08-08',
    week: 8,
    topic: 'Zero-One Relation Matrices',
    category: 'worked-example',
    question:
      'Let $A = \\{1, 2\\}$ and $R = \\{(1, 1), (1, 2), (2, 2)\\}$. Write the $2 \\times 2$ zero-one relation matrix $M_R$ in nested bracket notation `[[a, b], [c, d]]`.',
    answer: '[[1, 1], [0, 1]]',
    answerLatex: 'M_R = \\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}',
    acceptedVariants: [],
    formatHint: '[[row1_col1, row1_col2], [row2_col1, row2_col2]]',
    explanation:
      'Entry $(i, j)$ is $1$ iff $(i, j) \\in R$, else $0$. Row 1 has $(1,1) \\in R \\to 1$ and $(1,2) \\in R \\to 1$; Row 2 has $(2,1) \\notin R \\to 0$ and $(2,2) \\in R \\to 1$.',
  },
  {
    id: 'w08-09',
    week: 8,
    topic: 'Matrix Criteria for Reflexivity and Symmetry',
    category: 'concept',
    question:
      'In terms of the zero-one relation matrix $M_R$ and its transpose $M_R^T$, write the matrix equation that holds if and only if $R$ is **symmetric**.',
    answer: 'M_R = M_R^T',
    answerLatex: 'M_R = M_R^T',
    acceptedVariants: ['M_R^T = M_R'],
    formatHint: 'M_R = M_R^T',
    explanation:
      '- **Reflexive:** Every main diagonal entry $m_{ii} = 1$.\n- **Symmetric:** $m_{ij} = m_{ji}$ for all $i, j$, i.e., $M_R = M_R^T$.\n- **Antisymmetric:** Whenever $i \\neq j$, at least one of $m_{ij}, m_{ji}$ is $0$ ($m_{ij} \\cdot m_{ji} = 0$).',
  },
  {
    id: 'w08-10',
    week: 8,
    topic: 'Identifying Relation Properties from Examples',
    category: 'worked-example',
    question:
      'On $A = \\{1, 2, 3\\}$, let $R = \\{(1, 2), (2, 1)\\}$. Which single property among `Reflexive`, `Symmetric`, `Antisymmetric`, `Transitive` holds for $R$?',
    answer: 'Symmetric',
    answerLatex: 'R = \\{(1, 2), (2, 1)\\} \\text{ is Symmetric ONLY}',
    caseSensitive: false,
    acceptedVariants: [],
    formatHint: 'Single property name',
    explanation:
      '- **Not reflexive:** $(1,1) \\notin R$.\n- **Symmetric:** $(1,2) \\in R \\leftrightarrow (2,1) \\in R$.\n- **Not antisymmetric:** $(1,2) \\in R \\land (2,1) \\in R$ with $1 \\neq 2$.\n- **Not transitive:** $(1,2) \\in R \\land (2,1) \\in R$, yet $(1,1) \\notin R$!',
  },

  // ============================================================================
  // WEEK 9: Matrices (10 cards)
  // ============================================================================
  {
    id: 'w09-01',
    week: 9,
    topic: 'Matrix Dimensions and Equality',
    category: 'definition',
    question:
      'A matrix with $3$ horizontal rows and $4$ vertical columns has dimension written in `rows × cols` notation as what?',
    answer: '3 × 4',
    answerLatex: '3 \\times 4',
    acceptedVariants: ['3x4', '3 * 4'],
    formatHint: 'm × n',
    explanation:
      'Matrix order is always **rows $\\times$ columns** ($m \\times n$). Two matrices $A$ and $B$ are equal ($A = B$) iff they have the exact same dimensions $m \\times n$ AND $a_{ij} = b_{ij}$ for all $1 \\le i \\le m, 1 \\le j \\le n$.',
  },
  {
    id: 'w09-02',
    week: 9,
    topic: 'Matrix Addition and Scalar Multiplication',
    category: 'worked-example',
    question:
      'Given $A = \\begin{bmatrix} 1 & -2 \\\\ 3 & 0 \\end{bmatrix}$ and $B = \\begin{bmatrix} 4 & 5 \\\\ -1 & 2 \\end{bmatrix}$, compute $2A + B$ in `[[a, b], [c, d]]` format.',
    answer: '[[6, 1], [5, 2]]',
    answerLatex: '2A + B = \\begin{bmatrix} 2 & -4 \\\\ 6 & 0 \\end{bmatrix} + \\begin{bmatrix} 4 & 5 \\\\ -1 & 2 \\end{bmatrix} = \\begin{bmatrix} 6 & 1 \\\\ 5 & 2 \\end{bmatrix}',
    acceptedVariants: [],
    formatHint: '[[a, b], [c, d]]',
    explanation:
      'Scale every entry of $A$ by $2$ to get $[[2, -4], [6, 0]]$, then add corresponding entries of $B$: $[[2+4, -4+5], [6+(-1), 0+2]] = [[6, 1], [5, 2]]$.',
  },
  {
    id: 'w09-03',
    week: 9,
    topic: 'Matrix Multiplication Conformability',
    category: 'concept',
    question:
      'If $A$ has dimension $2 \\times 5$ and $B$ has dimension $5 \\times 3$, what is the dimension of the matrix product $AB$?',
    answer: '2 × 3',
    answerLatex: '(2 \\times 5)(5 \\times 3) \\longrightarrow 2 \\times 3',
    acceptedVariants: ['2x3'],
    formatHint: 'm × p',
    explanation:
      'For $AB$ to be defined, the inner dimensions must match ($5 = 5$), and the resulting product has the outer dimensions $2 \\times 3$. Note that $BA$ ($(5 \\times 3)(2 \\times 5)$) is **undefined**!',
  },
  {
    id: 'w09-04',
    week: 9,
    topic: 'Worked 2×2 Matrix Multiplication',
    category: 'worked-example',
    question:
      'Compute the product $AB$ for $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$ and $B = \\begin{bmatrix} 2 & 0 \\\\ 1 & 3 \\end{bmatrix}$ in `[[a, b], [c, d]]` form.',
    answer: '[[4, 6], [10, 12]]',
    answerLatex: 'AB = \\begin{bmatrix} 1(2)+2(1) & 1(0)+2(3) \\\\ 3(2)+4(1) & 3(0)+4(3) \\end{bmatrix} = \\begin{bmatrix} 4 & 6 \\\\ 10 & 12 \\end{bmatrix}',
    acceptedVariants: [],
    formatHint: '[[a, b], [c, d]]',
    explanation:
      'Dot each row of $A$ with each column of $B$:\n- $c_{11} = 1(2) + 2(1) = 4$, $c_{12} = 1(0) + 2(3) = 6$\n- $c_{21} = 3(2) + 4(1) = 10$, $c_{22} = 3(0) + 4(3) = 12$.',
  },
  {
    id: 'w09-05',
    week: 9,
    topic: 'Identity Matrix I_n',
    category: 'definition',
    question: 'Write the $2 \\times 2$ multiplicative identity matrix $I_2$ in `[[a, b], [c, d]]` format.',
    answer: '[[1, 0], [0, 1]]',
    answerLatex: 'I_2 = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
    acceptedVariants: [],
    formatHint: '[[a, b], [c, d]]',
    explanation:
      '$I_n$ has $1$s on the main diagonal and $0$s elsewhere, satisfying $AI_n = I_nA = A$ for every $n \\times n$ square matrix $A$.',
  },
  {
    id: 'w09-06',
    week: 9,
    topic: 'Condition for Matrix Invertibility',
    category: 'formula',
    question:
      'For a $2 \\times 2$ matrix $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, write the inequality on $a, b, c, d$ that must hold for $A^{-1}$ to exist.',
    answer: 'ad - bc ≠ 0',
    answerLatex: '\\det(A) = ad - bc \\neq 0',
    acceptedVariants: ['det(A) ≠ 0'],
    formatHint: 'ad - bc ≠ 0',
    explanation:
      'A square matrix $A$ is invertible (nonsingular) if and only if $\\det(A) \\neq 0$. For $2 \\times 2$ matrices, $\\det(A) = ad - bc \\neq 0$; if $ad - bc = 0$, $A$ is **singular** and has no inverse.',
  },
  {
    id: 'w09-07',
    week: 9,
    topic: 'Explicit 2×2 Inverse Matrix Calculation',
    category: 'worked-example',
    question:
      'Compute the exact inverse matrix $A^{-1}$ of $A = \\begin{bmatrix} 3 & 5 \\\\ 1 & 2 \\end{bmatrix}$ in `[[a, b], [c, d]]` format.',
    answer: '[[2, -5], [-1, 3]]',
    answerLatex: 'A^{-1} = \\frac{1}{3(2) - 5(1)} \\begin{bmatrix} 2 & -5 \\\\ -1 & 3 \\end{bmatrix} = \\begin{bmatrix} 2 & -5 \\\\ -1 & 3 \\end{bmatrix}',
    acceptedVariants: [],
    formatHint: '[[a, b], [c, d]]',
    explanation:
      'Using $A^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$: here $ad - bc = 6 - 5 = 1$, swapping diagonal entries gives $2, 3$ and negating off-diagonals gives $-5, -1$.',
  },
  {
    id: 'w09-08',
    week: 9,
    topic: 'Matrix Equation AX = B Representation',
    category: 'concept',
    question:
      'Write the coefficient matrix $A$ for the system $4x - y = 9$, $2x + 3y = 1$ in `[[a, b], [c, d]]` format.',
    answer: '[[4, -1], [2, 3]]',
    answerLatex: 'A = \\begin{bmatrix} 4 & -1 \\\\ 2 & 3 \\end{bmatrix}, \\quad X = \\begin{bmatrix} x \\\\ y \\end{bmatrix}, \\quad B = \\begin{bmatrix} 9 \\\\ 1 \\end{bmatrix}',
    acceptedVariants: [],
    formatHint: '[[a, b], [c, d]]',
    explanation:
      'The system writes compactly as $AX = B$ where $A = [[4, -1], [2, 3]]$, $X = [[x], [y]]$, and $B = [[9], [1]]$.',
  },
  {
    id: 'w09-09',
    week: 9,
    topic: 'Solving AX = B Using Matrix Inverse',
    category: 'formula',
    question:
      'Given the linear matrix equation $AX = B$ where $A$ is invertible, express the unique solution vector $X$ in terms of $A^{-1}$ and $B$ (watch multiplication order!).',
    answer: 'A^(-1)B',
    answerLatex: 'X = A^{-1}B',
    acceptedVariants: ['X = A^(-1)B', 'A⁻¹B', 'X = A⁻¹B'],
    formatHint: 'A^(-1)B',
    explanation:
      'Left-multiplying both sides of $AX = B$ by $A^{-1}$ yields $$A^{-1}(AX) = A^{-1}B \\implies (A^{-1}A)X = A^{-1}B \\implies I_n X = A^{-1}B \\implies X = A^{-1}B.$$ **Crucial caution:** Because matrix multiplication is non-commutative, $BA^{-1}$ is generally invalid or unequal!',
  },
  {
    id: 'w09-10',
    week: 9,
    topic: 'Worked Linear System via X = A^{-1}B',
    category: 'worked-example',
    question:
      'Given $A^{-1} = \\begin{bmatrix} 2 & -5 \\\\ -1 & 3 \\end{bmatrix}$ and $B = \\begin{bmatrix} 11 \\\\ 4 \\end{bmatrix}$ for $AX = B$, compute the solution column matrix $X$ as `[[x], [y]]`.',
    answer: '[[2], [1]]',
    answerLatex: 'X = A^{-1}B = \\begin{bmatrix} 2(11) - 5(4) \\\\ -1(11) + 3(4) \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}',
    acceptedVariants: [],
    formatHint: '[[x], [y]]',
    explanation:
      'Multiply $X = A^{-1}B$: first entry $2(11) + (-5)(4) = 22 - 20 = 2$; second entry $(-1)(11) + 3(4) = -11 + 12 = 1$, giving $X = [[2], [1]]$.',
  },

  // ============================================================================
  // WEEK 10: Counting Principles (10 cards)
  // ============================================================================
  {
    id: 'w10-01',
    week: 10,
    topic: 'Product Rule',
    category: 'worked-example',
    question:
      'A server password consists of $2$ uppercase English letters (`A`–`Z`, $26$ choices each) followed by $3$ digits (`0`–`9`, $10$ choices each), repetition allowed. Compute the total number of valid passwords.',
    answer: '676000',
    answerLatex: '26 \\times 26 \\times 10 \\times 10 \\times 10 = 676{,}000',
    acceptedVariants: ['26^2 * 10^3'],
    formatHint: 'Integer value (no commas)',
    explanation:
      'By the **Product Rule**, sequential independent choices multiply: $26 \\times 26 \\times 10 \\times 10 \\times 10 = 676 \\times 1000 = 676000$.',
  },
  {
    id: 'w10-02',
    week: 10,
    topic: 'Sum Rule for Disjoint Choices',
    category: 'worked-example',
    question:
      'A student must choose **one** project topic from $14$ AI topics, $9$ Networking topics, or $11$ Security topics (all lists pairwise disjoint). How many choices are available?',
    answer: '34',
    answerLatex: '14 + 9 + 11 = 34',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'By the **Sum Rule**, when choosing one option from pairwise disjoint sets $A_1, A_2, A_3$, total ways $= |A_1| + |A_2| + |A_3| = 14 + 9 + 11 = 34$.',
  },
  {
    id: 'w10-03',
    week: 10,
    topic: 'Zero Factorial Convention',
    category: 'definition',
    question: 'What is the exact defined integer value of $0!$?',
    answer: '1',
    answerLatex: '0! = 1',
    acceptedVariants: ['0! = 1'],
    formatHint: 'Integer value',
    explanation:
      'There is exactly $1$ way to arrange zero objects (the empty permutation), and $0! = 1$ ensures $P(n, n) = \\frac{n!}{(n - n)!} = \\frac{n!}{0!} = n!$ and $\\binom{n}{n} = \\frac{n!}{n!0!} = 1$.',
  },
  {
    id: 'w10-04',
    week: 10,
    topic: 'Permutations Formula (Order Matters)',
    category: 'formula',
    question:
      'State the factorial formula for $P(n, r)$ — the number of ordered $r$-permutations of $n$ distinct objects ($0 \\le r \\le n$).',
    answer: 'n! / (n - r)!',
    answerLatex: 'P(n, r) = \\frac{n!}{(n - r)!}',
    acceptedVariants: ['P(n, r) = n! / (n - r)!'],
    formatHint: 'n! / (n - r)!',
    explanation:
      '$P(n, r) = n(n - 1)(n - 2)\\cdots(n - r + 1) = \\frac{n!}{(n - r)!}$ counts selections where **order matters** (e.g., assigning President, Vice-President, Secretary).',
  },
  {
    id: 'w10-05',
    week: 10,
    topic: 'Combinations Formula (Order Does Not Matter)',
    category: 'formula',
    question:
      'State the factorial formula for $C(n, r) = \\binom{n}{r}$ — the number of unordered $r$-combinations of $n$ distinct objects.',
    answer: 'n! / (r!(n - r)!)',
    answerLatex: 'C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}',
    acceptedVariants: ['n! / ((n - r)! r!)', 'C(n, r) = n! / (r!(n - r)!)'],
    formatHint: 'n! / (r!(n - r)!)',
    explanation:
      'Dividing $P(n, r)$ by the $r!$ internal orderings of each chosen subset gives $$C(n, r) = \\frac{P(n, r)}{r!} = \\frac{n!}{r!(n - r)!}.$$',
  },
  {
    id: 'w10-06',
    week: 10,
    topic: 'Permutations vs Combinations Comparison',
    category: 'worked-example',
    question:
      'From $8$ finalists, compute (a) ways to award Gold, Silver, Bronze medals, and (b) ways to choose an unordered $3$-person committee. Write as `a, b`.',
    answer: '336, 56',
    answerLatex: 'P(8, 3) = 336,\\quad C(8, 3) = 56',
    acceptedVariants: [],
    formatHint: 'Two integers separated by comma: a, b',
    explanation:
      '- **Medals (order matters):** $P(8, 3) = 8 \\times 7 \\times 6 = 336$.\n- **Committee (order ignored):** $C(8, 3) = \\frac{8 \\times 7 \\times 6}{3!} = \\frac{336}{6} = 56$.',
  },
  {
    id: 'w10-07',
    week: 10,
    topic: 'Generalized Pigeonhole Principle',
    category: 'worked-example',
    question:
      'If $100$ data packets are distributed across $12$ servers, what is the **minimum guaranteed** number of packets on the busiest server?',
    answer: '9',
    answerLatex: '\\lceil 100 / 12 \\rceil = \\lceil 8.33\\dots \\rceil = 9',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'By the **Generalized Pigeonhole Principle**, placing $N$ objects into $k$ boxes guarantees at least one box has at least $\\lceil N / k \\rceil$ objects: $\\lceil 100 / 12 \\rceil = 9$.',
  },
  {
    id: 'w10-08',
    week: 10,
    topic: 'Pigeonhole Worst-Case Sizing',
    category: 'worked-example',
    question:
      'What is the minimum number of students needed in a WIX1001 tutorial to **guarantee** that at least $3$ students share the same birth month ($12$ months)?',
    answer: '25',
    answerLatex: '12(3 - 1) + 1 = 25',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'In the worst case, $12 \\times 2 = 24$ students can split evenly with $2$ per month. Adding the $25\\text{th}$ student forces $\\lceil 25 / 12 \\rceil = 3$ in at least one month.',
  },
  {
    id: 'w10-09',
    week: 10,
    topic: 'Binomial Theorem General Term',
    category: 'formula',
    question:
      'In the Binomial Theorem $(x + y)^n = \\sum_{k=0}^{n} T_k$, write the summand term $T_k$ using `C(n, k)`, `x`, `y`, `n`, and `k`.',
    answer: 'C(n, k) x^(n - k) y^k',
    answerLatex: '\\binom{n}{k} x^{n - k} y^k',
    acceptedVariants: ['C(n, k) * x^(n - k) * y^k', 'C(n, k) x^k y^(n - k)'],
    formatHint: 'C(n, k) x^(n - k) y^k',
    explanation:
      'Expanding $(x + y)^n$ chooses $y$ from $k$ factors and $x$ from the remaining $n - k$ factors in $\\binom{n}{k}$ ways: $$(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k.$$',
  },
  {
    id: 'w10-10',
    week: 10,
    topic: 'Worked Binomial Coefficient Extraction',
    category: 'worked-example',
    question: 'Find the numerical coefficient of $x^3 y^2$ in the expansion of $(2x + y)^5$.',
    answer: '80',
    answerLatex: '\\binom{5}{2} (2x)^3 y^2 = 10 \\cdot 8 x^3 y^2 = 80 x^3 y^2',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Setting $k = 2$ gives $\\binom{5}{2}(2x)^{5-2} y^2 = 10 \\cdot 2^3 x^3 y^2 = 10 \\times 8 x^3 y^2 = 80 x^3 y^2$, so the coefficient is $80$.',
  },

  // ============================================================================
  // WEEK 11: Graph Theory (10 cards)
  // ============================================================================
  {
    id: 'w11-01',
    week: 11,
    topic: 'Graph Ordered-Pair Definition',
    category: 'definition',
    question:
      'Write the standard ordered-pair notation defining a graph $G$ with vertex set $V$ ($V \\neq \\emptyset$) and edge set $E$.',
    answer: 'G = (V, E)',
    answerLatex: 'G = (V, E)',
    acceptedVariants: ['(V, E)'],
    formatHint: 'G = (V, E)',
    explanation:
      'In an **undirected graph**, edges in $E$ are unordered pairs $\\{u, v\\}$; in a **directed graph (digraph)**, edges are ordered pairs $(u, v)$ from tail $u$ to head $v$.',
  },
  {
    id: 'w11-02',
    week: 11,
    topic: 'Handshaking Lemma',
    category: 'formula',
    question:
      'For any undirected graph $G = (V, E)$, state what the sum of all vertex degrees $\\sum_{v \\in V} \\deg(v)$ equals in terms of $|E|$.',
    answer: '2|E|',
    answerLatex: '\\sum_{v \\in V} \\deg(v) = 2|E|',
    acceptedVariants: ['2 * |E|'],
    formatHint: 'Expression in |E|',
    explanation:
      'Every undirected edge contributes $+2$ to the sum of vertex degrees ($+1$ to each endpoint, or $+2$ for a self-loop). Consequently, **every undirected graph has an even number of odd-degree vertices**.',
  },
  {
    id: 'w11-03',
    week: 11,
    topic: 'Handshaking Lemma Worked Problem',
    category: 'worked-example',
    question:
      'An undirected graph has $6$ vertices with degrees $3, 3, 2, 2, 1, 1$. How many edges $|E|$ does the graph contain?',
    answer: '6',
    answerLatex: '2|E| = 3 + 3 + 2 + 2 + 1 + 1 = 12 \\implies |E| = 6',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'By the Handshaking Lemma, $2|E| = \\sum \\deg(v) = 12 \\implies |E| = 12 / 2 = 6$.',
  },
  {
    id: 'w11-04',
    week: 11,
    topic: 'Directed Graph Degree Sum Theorem',
    category: 'formula',
    question:
      'In a directed graph $G = (V, E)$, what does the total sum of out-degrees $\\sum_{v \\in V} \\deg^+(v)$ equal in terms of $|E|$?',
    answer: '|E|',
    answerLatex: '\\sum_{v \\in V} \\deg^-(v) = \\sum_{v \\in V} \\deg^+(v) = |E|',
    acceptedVariants: [],
    formatHint: '|E|',
    explanation:
      'Every directed edge $(u, v) \\in E$ has exactly one tail (adding $1$ to $\\deg^+(u)$) and one head (adding $1$ to $\\deg^-(v)$), so both sums equal $|E|$.',
  },
  {
    id: 'w11-05',
    week: 11,
    topic: 'Edges in Complete Graph K_n',
    category: 'formula',
    question:
      'State the formula for the number of edges $|E|$ in the simple complete graph $K_n$ on $n$ vertices.',
    answer: 'n(n - 1) / 2',
    answerLatex: '|E(K_n)| = \\binom{n}{2} = \\frac{n(n - 1)}{2}',
    acceptedVariants: ['C(n, 2)'],
    formatHint: 'n(n - 1) / 2',
    explanation:
      'Every vertex in $K_n$ has degree $n - 1$. By the Handshaking Lemma, $2|E| = n(n - 1) \\implies |E| = \\frac{n(n - 1)}{2}$.',
  },
  {
    id: 'w11-06',
    week: 11,
    topic: 'Eulerian vs Hamiltonian Fundamental Distinction',
    category: 'definition',
    question:
      'Fill both blanks separated by a comma: An **Eulerian** path/circuit traverses every `___` exactly once, whereas a **Hamiltonian** path/circuit visits every `___` exactly once.',
    answer: 'edge, vertex',
    answerLatex: '\\text{Eulerian} \\leftrightarrow \\text{every edge once}, \\qquad \\text{Hamiltonian} \\leftrightarrow \\text{every vertex once}',
    caseSensitive: false,
    acceptedVariants: [],
    formatHint: 'word1, word2',
    explanation:
      '**Core WIX1001 distinction:**\n- **Eulerian** = **E**dges (every edge used once; vertices may repeat; polynomial degree characterization!).\n- **Hamiltonian** = **V**ertices (every vertex visited once; many edges stay unused; no simple necessary-and-sufficient local degree theorem!).',
  },
  {
    id: 'w11-07',
    week: 11,
    topic: 'Euler’s Theorem for Eulerian Circuits',
    category: 'concept',
    question:
      'A connected multigraph with at least two vertices contains an **Eulerian circuit** if and only if every vertex has what kind of degree? (`even` or `odd`)',
    answer: 'even',
    answerLatex: '\\forall v \\in V,\\; \\deg(v) \\text{ is even}',
    caseSensitive: false,
    acceptedVariants: ['even degree'],
    formatHint: 'even or odd',
    explanation:
      'Each time a circuit enters a vertex along an unused edge, it must exit along another unused edge, pairing edges up at every vertex — so every vertex degree must be **even**.',
  },
  {
    id: 'w11-08',
    week: 11,
    topic: 'Eulerian Path Degree Condition',
    category: 'concept',
    question:
      'A connected graph contains an **Eulerian path** that is *not* a circuit if and only if it has how many vertices of **odd** degree?',
    answer: '2',
    answerLatex: '\\text{Exactly } 2 \\text{ vertices of odd degree (start and finish)}',
    acceptedVariants: ['two'],
    formatHint: 'Single integer',
    explanation:
      'An open Eulerian walk starts at one odd-degree vertex and ends at the second odd-degree vertex, while every intermediate vertex has even degree.',
  },
  {
    id: 'w11-09',
    week: 11,
    topic: 'Hamiltonian Circuit on Cycle / Complete Graphs',
    category: 'worked-example',
    question:
      'For what integers $n$ does the complete graph $K_n$ contain a **Hamiltonian circuit**? Write as an inequality in $n$.',
    answer: 'n ≥ 3',
    answerLatex: 'n \\ge 3',
    acceptedVariants: ['n >= 3'],
    formatHint: 'Inequality in n',
    explanation:
      'A Hamiltonian circuit in a simple graph requires at least $3$ vertices to form a simple cycle visiting every vertex once and returning to start. Notice $K_4$ is **Hamiltonian** ($1 - 2 - 3 - 4 - 1$) even though $K_4$ is **not Eulerian** (all degrees are $3$, odd)!',
  },
  {
    id: 'w11-10',
    week: 11,
    topic: 'Adjacency Matrix vs Incidence Matrix Dimensions',
    category: 'concept',
    question:
      'Let $G = (V, E)$ have $|V| = 5$ vertices and $|E| = 8$ edges. Write the dimensions of its **adjacency matrix** $A_G$ and **incidence matrix** $M_G$ separated by a comma.',
    answer: '5 × 5, 5 × 8',
    answerLatex: 'A_G:\\; 5 \\times 5, \\qquad M_G:\\; 5 \\times 8',
    acceptedVariants: ['5x5, 5x8'],
    formatHint: 'm × m, m × e',
    explanation:
      '- **Adjacency matrix $A_G$:** $|V| \\times |V| = 5 \\times 5$ (vertex-by-vertex).\n- **Incidence matrix $M_G$:** $|V| \\times |E| = 5 \\times 8$ (vertex-by-edge).',
  },

  // ============================================================================
  // WEEK 12: Trees (10 cards)
  // ============================================================================
  {
    id: 'w12-01',
    week: 12,
    topic: 'Definition of a Tree',
    category: 'definition',
    question:
      'Fill both blanks separated by a comma: A **tree** is an undirected graph that is `___` and `___` (contains no simple circuits).',
    answer: 'connected, acyclic',
    answerLatex: '\\text{Connected and Acyclic}',
    caseSensitive: false,
    acceptedVariants: ['acyclic, connected'],
    formatHint: 'connected, acyclic',
    explanation:
      'Equivalently, a graph $T$ is a tree iff there is a **unique simple path** between every pair of vertices. An acyclic graph that is not necessarily connected is a **forest**.',
  },
  {
    id: 'w12-02',
    week: 12,
    topic: 'Fundamental Tree Edge-Count Property',
    category: 'formula',
    question:
      'State the exact formula for $|E|$ in terms of $|V|$ for any tree $T = (V, E)$ with $|V| \\ge 1$ vertices.',
    answer: '|V| - 1',
    answerLatex: '|E| = |V| - 1',
    acceptedVariants: ['|E| = |V| - 1'],
    formatHint: '|V| - 1',
    explanation:
      'Every tree on $|V|$ vertices has **always** $|E| = |V| - 1$ edges. Adding any single edge creates a unique cycle; deleting any single edge disconnects $T$ into $2$ components.',
  },
  {
    id: 'w12-03',
    week: 12,
    topic: 'Rooted Tree Structural Terminology',
    category: 'definition',
    question:
      'In a rooted tree, what single term describes a vertex that has **no children**?',
    answer: 'Leaf',
    answerLatex: '\\text{Leaf (external / terminal vertex)}',
    caseSensitive: false,
    acceptedVariants: ['Leaves', 'A leaf'],
    formatHint: 'Single tree terminology term',
    explanation:
      '- **Root:** unique top vertex with no parent (level $0$).\n- **Internal vertex:** vertex with at least one child.\n- **Leaf:** vertex with zero children.\n- **Siblings:** vertices sharing the same parent.',
  },
  {
    id: 'w12-04',
    week: 12,
    topic: 'Maximum Vertices in a Binary Tree of Height h',
    category: 'formula',
    question:
      'At most how many vertices can a binary tree of height $h \\ge 0$ have? Express in terms of $h$.',
    answer: '2^(h + 1) - 1',
    answerLatex: '\\sum_{k=0}^{h} 2^k = 2^{h + 1} - 1',
    acceptedVariants: ['2^(h+1) - 1'],
    formatHint: '2^(h + 1) - 1',
    explanation:
      'Level $k$ has at most $2^k$ vertices (and at most $2^h$ leaves at height $h$). Summing the geometric series $1 + 2 + 4 + \\dots + 2^h$ yields $2^{h + 1} - 1$.',
  },
  {
    id: 'w12-05',
    week: 12,
    topic: 'Full Binary Tree Vertex-Leaf Theorem',
    category: 'worked-example',
    question:
      'A **full binary tree** (every internal vertex has exactly $2$ children) has $i = 6$ internal vertices. Compute total vertices $n$ and leaves $l$ as `n, l`.',
    answer: '13, 7',
    answerLatex: 'n = 2i + 1 = 13, \\qquad l = i + 1 = 7',
    acceptedVariants: [],
    formatHint: 'n, l',
    explanation:
      'For any full $m$-ary tree with $i$ internal vertices: $$n = mi + 1 \\quad \\text{and} \\quad l = (m - 1)i + 1.$$ For $m = 2, i = 6$: $n = 2(6) + 1 = 13$ vertices and $l = 6 + 1 = 7$ leaves.',
  },
  {
    id: 'w12-06',
    week: 12,
    topic: 'Preorder Traversal Rule',
    category: 'worked-example',
    question:
      'Consider a binary tree with root `A`, left child `B` (which has children left `D`, right `E`), and right child `C`. Write the **preorder** traversal sequence separated by commas.',
    answer: 'A, B, D, E, C',
    answerLatex: '\\text{Preorder (Root, Left, Right): } A, B, D, E, C',
    acceptedVariants: ['A B D E C'],
    formatHint: 'A, B, ...',
    explanation:
      '**Preorder** visits **Root $\\to$ Left subtree $\\to$ Right subtree** recursively:\nVisit `A`, recurse left (`B`, then `D`, then `E`), recurse right (`C`) $\\implies A, B, D, E, C$.',
  },
  {
    id: 'w12-07',
    week: 12,
    topic: 'Inorder Traversal Rule',
    category: 'worked-example',
    question:
      'For the same binary tree (root `A`; `B` has left `D`, right `E`; right child of `A` is `C`), write the **inorder** traversal sequence separated by commas.',
    answer: 'D, B, E, A, C',
    answerLatex: '\\text{Inorder (Left, Root, Right): } D, B, E, A, C',
    acceptedVariants: ['D B E A C'],
    formatHint: 'X, Y, ...',
    explanation:
      '**Inorder** visits **Left subtree $\\to$ Root $\\to$ Right subtree** recursively:\nLeft subtree of `A` yields `D, B, E`, then root `A`, then right subtree `C` $\\implies D, B, E, A, C$.',
  },
  {
    id: 'w12-08',
    week: 12,
    topic: 'Postorder Traversal Rule',
    category: 'worked-example',
    question:
      'For the same binary tree (root `A`; `B` has left `D`, right `E`; right child of `A` is `C`), write the **postorder** traversal sequence separated by commas.',
    answer: 'D, E, B, C, A',
    answerLatex: '\\text{Postorder (Left, Right, Root): } D, E, B, C, A',
    acceptedVariants: ['D E B C A'],
    formatHint: 'X, Y, ...',
    explanation:
      '**Postorder** visits **Left subtree $\\to$ Right subtree $\\to$ Root** recursively (root is ALWAYS last!):\nLeft subtree yields `D, E, B`, right subtree yields `C`, finally root `A` $\\implies D, E, B, C, A$.',
  },
  {
    id: 'w12-09',
    week: 12,
    topic: 'Spanning Tree Edge Removal Count',
    category: 'worked-example',
    question:
      'A simple connected graph $G$ has $|V| = 9$ vertices and $|E| = 14$ edges. How many edges must be removed from cycles of $G$ to form a **spanning tree** of $G$?',
    answer: '6',
    answerLatex: '14 - (9 - 1) = 14 - 8 = 6',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Every spanning tree of $G$ retains all $|V| = 9$ vertices and has $|V| - 1 = 8$ edges. Thus $14 - 8 = 6$ edges must be removed without disconnecting $G$.',
  },
  {
    id: 'w12-10',
    week: 12,
    topic: 'Minimum Spanning Tree (MST) Worked Calculation',
    category: 'worked-example',
    question:
      'On vertices $\\{A, B, C, D\\}$, weighted edges are $w(A,B)=1$, $w(B,C)=2$, $w(A,C)=3$, $w(C,D)=4$, $w(B,D)=5$. Find the total weight of a **Minimum Spanning Tree**.',
    answer: '7',
    answerLatex: 'w(\\text{MST}) = w(A,B) + w(B,C) + w(C,D) = 1 + 2 + 4 = 7',
    acceptedVariants: [],
    formatHint: 'Integer total weight',
    explanation:
      'Apply **Kruskal’s algorithm** in non-decreasing weight order:\n1. Pick $(A,B)$ of weight $1$ $\\checkmark$\n2. Pick $(B,C)$ of weight $2$ $\\checkmark$\n3. Skip $(A,C)$ of weight $3$ (forms cycle $A-B-C-A$!)\n4. Pick $(C,D)$ of weight $4$ $\\checkmark$ ($|V|-1 = 3$ edges complete).\nTotal MST weight $= 1 + 2 + 4 = 7$.',
  },

  // ============================================================================
  // WEEK 13: Test 2 Assessment and Milestone Drill (Weeks 8–12 Synthesis, 10 cards)
  // ============================================================================
  {
    id: 'w13-01',
    week: 13,
    topic: 'Test 2 Synthesis · Divisibility Partial Order',
    category: 'concept',
    question:
      'Consider the divisibility relation $R = \\{(a, b) \\mid a \\text{ divides } b\\}$ on $\\mathbb{N} = \\{1, 2, 3, \\dots\\}$. Which property among `Reflexive`, `Symmetric`, `Antisymmetric`, `Transitive` fails?',
    answer: 'Symmetric',
    answerLatex: '\\text{Symmetric fails (e.g. } 2 \\mid 6 \\text{ yet } 6 \\nmid 2\\text{)}',
    caseSensitive: false,
    acceptedVariants: ['Symmetry'],
    formatHint: 'Single property name',
    explanation:
      'On $\\mathbb{N}$, $a \\mid a$ (reflexive), $a \\mid b \\land b \\mid a \\implies a = b$ (antisymmetric on $\\mathbb{N}$), and $a \\mid b \\land b \\mid c \\implies a \\mid c$ (transitive). Thus $(\\mathbb{N}, \\mid)$ is a **partial order**, NOT symmetric ($2 \\mid 6$ but $6 \\nmid 2$).',
  },
  {
    id: 'w13-02',
    week: 13,
    topic: 'Test 2 Synthesis · Counting Equivalence Classes',
    category: 'worked-example',
    question:
      'How many distinct equivalence classes partition $\\mathbb{Z}$ under the congruence relation $a \\equiv b \\pmod{7}$?',
    answer: '7',
    answerLatex: '\\{[0]_7, [1]_7, [2]_7, [3]_7, [4]_7, [5]_7, [6]_7\\} \\implies 7',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Every integer has a unique remainder $r \\in \\{0, 1, 2, 3, 4, 5, 6\\}$ modulo $7$, partitioning $\\mathbb{Z}$ into $7$ pairwise disjoint equivalence classes.',
  },
  {
    id: 'w13-03',
    week: 13,
    topic: 'Test 2 Synthesis · Matrix Determinant Parameter',
    category: 'worked-example',
    question:
      'For what value of $k$ is the matrix $A = \\begin{bmatrix} 6 & k \\\\ 3 & 4 \\end{bmatrix}$ **singular** (non-invertible)?',
    answer: '8',
    answerLatex: '\\det(A) = 6(4) - 3k = 24 - 3k = 0 \\iff k = 8',
    acceptedVariants: ['k = 8'],
    formatHint: 'Integer value',
    explanation:
      '$A$ fails to be invertible iff $\\det(A) = 0 \\iff 24 - 3k = 0 \\iff k = 8$.',
  },
  {
    id: 'w13-04',
    week: 13,
    topic: 'Test 2 Synthesis · Transpose of Matrix Product',
    category: 'formula',
    question:
      'Express $(AB)^T$ in terms of $A^T$ and $B^T$ (watch multiplication order!).',
    answer: 'B^T A^T',
    answerLatex: '(AB)^T = B^T A^T',
    acceptedVariants: ['(AB)^T = B^T A^T'],
    formatHint: 'B^T A^T',
    explanation:
      'Just like matrix inverses $(AB)^{-1} = B^{-1}A^{-1}$, transposing a matrix product reverses factor order: $(AB)^T = B^T A^T$.',
  },
  {
    id: 'w13-05',
    week: 13,
    topic: 'Test 2 Synthesis · Bit Strings with Weight Constraint',
    category: 'worked-example',
    question:
      'How many bit strings of length $8$ contain **at least** $6$ ones?',
    answer: '37',
    answerLatex: '\\binom{8}{6} + \\binom{8}{7} + \\binom{8}{8} = 28 + 8 + 1 = 37',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Partition by exact number of $1$s (Sum Rule + Combinations): $\\binom{8}{6} + \\binom{8}{7} + \\binom{8}{8} = 28 + 8 + 1 = 37$.',
  },
  {
    id: 'w13-06',
    week: 13,
    topic: 'Test 2 Synthesis · Committee with Gender/Year Constraint',
    category: 'worked-example',
    question:
      'A club has $5$ seniors and $6$ juniors. How many $4$-member committees contain **exactly** $2$ seniors and $2$ juniors?',
    answer: '150',
    answerLatex: '\\binom{5}{2} \\cdot \\binom{6}{2} = 10 \\times 15 = 150',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Choose $2$ seniors in $\\binom{5}{2} = 10$ ways AND choose $2$ juniors in $\\binom{6}{2} = 15$ ways. By the Product Rule, $10 \\times 15 = 150$.',
  },
  {
    id: 'w13-07',
    week: 13,
    topic: 'Test 2 Synthesis · Degree Sequence Existence Check',
    category: 'worked-example',
    question:
      'Does there exist an undirected graph with vertex degree sequence $(4, 3, 3, 2, 1)$? Answer `Yes` or `No`.',
    answer: 'No',
    answerLatex: '4 + 3 + 3 + 2 + 1 = 13 \\text{ (odd, violates } \\sum \\deg(v) = 2|E|\\text{)}',
    caseSensitive: false,
    acceptedVariants: [],
    formatHint: 'Yes or No',
    explanation:
      'Summing the degrees gives $4 + 3 + 3 + 2 + 1 = 13$, which is **odd** ($3$ odd-degree vertices). By the Handshaking Lemma, $\\sum \\deg(v) = 2|E|$ must always be even, so no such graph exists!',
  },
  {
    id: 'w13-08',
    week: 13,
    topic: 'Test 2 Synthesis · Eulerian Check on Complete Graphs',
    category: 'worked-example',
    question:
      'Between $K_4$ and $K_5$, which complete graph has an **Eulerian circuit**?',
    answer: 'K_5',
    answerLatex: 'K_5 \\; (\\forall v,\\; \\deg(v) = 4 \\text{ is even})',
    acceptedVariants: ['K5'],
    formatHint: 'K_4 or K_5',
    explanation:
      'In $K_n$, every vertex has degree $n - 1$. In $K_4$, all $4$ vertices have odd degree $3$ (not even an Eulerian path!). In $K_5$, every vertex has even degree $4$, so $K_5$ has an Eulerian circuit.',
  },
  {
    id: 'w13-09',
    week: 13,
    topic: 'Test 2 Synthesis · Forest Edge Calculation',
    category: 'worked-example',
    question:
      'A forest (disconnected acyclic graph) has $|V| = 15$ vertices and $c = 4$ connected components (each component is a tree). How many edges $|E|$ does the forest have?',
    answer: '11',
    answerLatex: '|E| = |V| - c = 15 - 4 = 11',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Summing $|E_k| = |V_k| - 1$ over $c$ tree components yields $$|E| = \\sum_{k=1}^{c} (|V_k| - 1) = |V| - c = 15 - 4 = 11.$$',
  },
  {
    id: 'w13-10',
    week: 13,
    topic: 'Test 2 Synthesis · Prefix/Postfix Arithmetic Evaluation',
    category: 'worked-example',
    question:
      'An expression tree has root `*`, whose left child is `+` (children `3` and `4`) and right child is `5`. Write its **postorder** (Reverse Polish) token sequence separated by commas.',
    answer: '3, 4, +, 5, *',
    answerLatex: '3, 4, +, 5, * \\quad ((3 + 4) \\times 5 = 35)',
    acceptedVariants: ['3 4 + 5 *'],
    formatHint: 'Tokens separated by commas',
    explanation:
      'Postorder evaluates left subtree (`3, 4, +`), then right subtree (`5`), then root (`*`), giving postfix notation `3, 4, +, 5, *` without needing parentheses!',
  },

  // ============================================================================
  // WEEK 14: Final Examination Master Revision (8 Cross-Topic Capstone Cards)
  // (Plus Week 14 dynamically surfaces cumulative queues across ALL Weeks 1–14!)
  // ============================================================================
  {
    id: 'w14-01',
    week: 14,
    topic: 'Final Synthesis · Bijections, Permutations & Set Cardinality',
    category: 'worked-example',
    question:
      'If $|A| = 5$ and $|B| = 5$, how many **bijective** functions $f: A \\to B$ exist?',
    answer: '120',
    answerLatex: '5! = 120',
    acceptedVariants: ['5!'],
    formatHint: 'Integer value',
    explanation:
      'Connects **Week 2 (Cardinality)**, **Week 6 (Bijections)**, and **Week 10 (Permutations)**: when $|A| = |B| = n$, bijections $A \\to B$ correspond 1-to-1 with permutations $P(n, n) = n! = 5! = 120$.',
  },
  {
    id: 'w14-02',
    week: 14,
    topic: 'Final Synthesis · Sum of Binomial Coefficients & Power Sets',
    category: 'formula',
    question:
      'Evaluate the finite sum $\\sum_{k=0}^{n} \\binom{n}{k}$ as a closed-form power of $2$.',
    answer: '2^n',
    answerLatex: '\\sum_{k=0}^{n} \\binom{n}{k} = (1 + 1)^n = 2^n = |P(A)|',
    acceptedVariants: [],
    formatHint: 'Exponential expression in n',
    explanation:
      'Unites **Week 2 (Power Sets)** and **Week 10 (Binomial Theorem)**: setting $x = y = 1$ in $(x + y)^n$ gives $\\sum_{k=0}^n \\binom{n}{k} = 2^n$, which counts all subsets of an $n$-element set partitioned by size $k$.',
  },
  {
    id: 'w14-03',
    week: 14,
    topic: 'Final Synthesis · Graph Adjacency Matrix Powers',
    category: 'concept',
    question:
      'Let $A$ be the adjacency matrix of simple graph $G$. Entry $(i, j)$ of the matrix power $A^k$ counts the exact number of walks of length `___` between vertex $v_i$ and vertex $v_j$.',
    answer: 'k',
    answerLatex: '(A^k)_{ij} = \\text{number of walks of length } k \\text{ from } v_i \\text{ to } v_j',
    acceptedVariants: [],
    formatHint: 'Single variable',
    explanation:
      'Unites **Week 5 (Induction)**, **Week 9 (Matrix Multiplication)**, and **Week 11 (Graph Theory)**: $(A^k)_{ij} = \\sum_m (A^{k-1})_{im} A_{mj}$ sums over all $(k-1)$-step walks to $v_m$ followed by edge $(v_m, v_j)$.',
  },
  {
    id: 'w14-04',
    week: 14,
    topic: 'Final Synthesis · Tree Average Degree & Handshaking',
    category: 'worked-example',
    question:
      'A tree has $|V| = 10$ vertices. Combining the Tree Edge Property and the Handshaking Lemma, compute the exact sum of degrees $\\sum_{v \\in V} \\deg(v)$.',
    answer: '18',
    answerLatex: '\\sum_{v \\in V} \\deg(v) = 2|E| = 2(|V| - 1) = 2(9) = 18',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Unites **Week 11 (Handshaking Lemma)** and **Week 12 (Trees)**: $|E| = |V| - 1 = 9$, and $\\sum \\deg(v) = 2|E| = 2(9) = 18$. Every tree with $|V| \\ge 2$ therefore has at least $2$ leaves (degree $1$).',
  },
  {
    id: 'w14-05',
    week: 14,
    topic: 'Final Synthesis · Inclusion-Exclusion Derangement / Divisibility',
    category: 'worked-example',
    question:
      'How many integers in $\\{1, 2, \\dots, 100\\}$ are divisible by $2$ **or** $5$?',
    answer: '60',
    answerLatex: '|D_2 \\cup D_5| = \\lfloor 100/2 \\rfloor + \\lfloor 100/5 \\rfloor - \\lfloor 100/10 \\rfloor = 50 + 20 - 10 = 60',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Unites **Week 1/5 (Divisibility)** and **Week 3 (Inclusion-Exclusion)**: $|D_2| = 50$, $|D_5| = 20$, and $D_2 \\cap D_5 = D_{\\operatorname{lcm}(2,5)} = D_{10}$ has $|D_{10}| = 10$, giving $50 + 20 - 10 = 60$.',
  },
  {
    id: 'w14-06',
    week: 14,
    topic: 'Final Synthesis · Quantifier Order Sensitivity',
    category: 'worked-example',
    question:
      'Over $\\mathbb{R}$, compare $S_1: \\forall x\\, \\exists y\\, (x + y = 0)$ and $S_2: \\exists y\\, \\forall x\\, (x + y = 0)$. Write their truth values as `T/F, T/F`.',
    answer: 'T, F',
    answerLatex: 'S_1 = T \\; (y = -x), \\qquad S_2 = F \\; (\\text{no single } y \\text{ works for all } x)',
    acceptedVariants: [],
    formatHint: 'T, F format',
    explanation:
      'In $\\forall x \\exists y$, $y$ may depend on $x$ ($y = -x$ works!). In $\\exists y \\forall x$, one fixed $y$ must satisfy both $x = 0$ ($y = 0$) and $x = 1$ ($1 + y = 0 \\implies y = -1$), a **contradiction**!',
  },
  {
    id: 'w14-07',
    week: 14,
    topic: 'Final Synthesis · Symmetric Reflexive Relations Count',
    category: 'worked-example',
    question:
      'How many **reflexive and symmetric** binary relations exist on a set $A$ with $|A| = 3$?',
    answer: '8',
    answerLatex: '2^{\\binom{3}{2}} = 2^3 = 8',
    acceptedVariants: ['2^3'],
    formatHint: 'Integer value',
    explanation:
      'Unites **Week 8 (Relation Matrices)**, **Week 10 (Counting)**, and **Week 11 (Simple Undirected Graphs)**: all $3$ diagonal entries of $M_R$ are fixed to $1$, and the $\\binom{3}{2} = 3$ upper-triangle off-diagonal pairs freely determine their symmetric mirrors: $2^3 = 8$.',
  },
  {
    id: 'w14-08',
    week: 14,
    topic: 'Final Synthesis · Contrapositive Proof on Pigeonhole Parity',
    category: 'worked-example',
    question:
      'How many integers must be selected from $\\mathbb{Z}$ to **guarantee** that at least two selected integers have an **even** sum?',
    answer: '3',
    answerLatex: '2 \\text{ parity classes (even, odd)} \\implies 2 + 1 = 3',
    acceptedVariants: [],
    formatHint: 'Integer value',
    explanation:
      'Unites **Week 5 (Parity Proofs)**, **Week 8 (Mod 2 Equivalence Classes)**, and **Week 10 (Pigeonhole Principle)**: $a + b$ is even iff $a \\equiv b \\pmod{2}$. Since there are only $2$ parity classes (Even and Odd), choosing $3$ integers guarantees $2$ share the same parity!',
  },
];
