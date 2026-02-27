/* ===== seed-data.js – Demo Data ===== */

const SeedData = (() => {
    function seed() {
        if (Store.isSeeded()) return;

        // Demo users
        const users = [
            { id: 'u1', name: 'Ananya Sharma', email: 'ananya@university.edu', password: 'demo123', department: 'Computer Science', university: 'IIT University', bio: 'CS senior passionate about algorithms and machine learning.', joinedAt: '2025-09-15T08:00:00Z' },
            { id: 'u2', name: 'Rahul Verma', email: 'rahul@university.edu', password: 'demo123', department: 'Computer Science', university: 'IIT University', bio: 'Full-stack developer and open source contributor.', joinedAt: '2025-10-01T10:00:00Z' },
            { id: 'u3', name: 'Priya Patel', email: 'priya@university.edu', password: 'demo123', department: 'Electronics', university: 'IIT University', bio: 'EE student interested in VLSI design and embedded systems.', joinedAt: '2025-08-20T12:00:00Z' },
            { id: 'u4', name: 'Dr. Arun Kumar', email: 'arun.prof@university.edu', password: 'demo123', department: 'Computer Science', university: 'IIT University', bio: 'Associate Professor, teaching Data Structures and Algorithms.', joinedAt: '2024-01-10T09:00:00Z', role: 'teacher' },
            { id: 'u5', name: 'Sneha Gupta', email: 'sneha@university.edu', password: 'demo123', department: 'Mathematics', university: 'IIT University', bio: 'Applied Math student, loves probability and statistics.', joinedAt: '2025-11-05T14:00:00Z' },
        ];
        users.forEach(u => Store.addUser(u));

        // Demo resources
        const resources = [
            {
                id: 'r1', title: 'Data Structures & Algorithms — Complete Notes',
                description: 'Comprehensive notes covering arrays, linked lists, trees, graphs, dynamic programming, and sorting algorithms with time complexity analysis.',
                department: 'Computer Science', courseCode: 'CS201', type: 'notes',
                semester: '3rd', subject: 'Data Structures', module: 'Complete Course',
                tags: ['DSA', 'algorithms', 'trees', 'graphs', 'dynamic programming'],
                authorId: 'u1', authorName: 'Ananya Sharma', downloads: 234,
                fileType: 'markdown',
                content: `# Data Structures & Algorithms\n\n## 1. Arrays\nAn array is a collection of items stored at contiguous memory locations.\n\n### Time Complexity\n| Operation | Average | Worst |\n|-----------|---------|-------|\n| Access | O(1) | O(1) |\n| Search | O(n) | O(n) |\n| Insert | O(n) | O(n) |\n| Delete | O(n) | O(n) |\n\n## 2. Linked Lists\nA linked list is a linear data structure where elements are stored in nodes.\n\n\`\`\`python\nclass Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\`\`\`\n\n## 3. Trees\n- **Binary Tree**: Each node has at most two children\n- **BST**: Left child < parent < right child\n- **AVL Tree**: Self-balancing BST\n- **Red-Black Tree**: Self-balancing BST with color properties\n\n## 4. Graph Algorithms\n- **BFS**: Breadth First Search - O(V+E)\n- **DFS**: Depth First Search - O(V+E)\n- **Dijkstra**: Shortest path - O(V²) or O((V+E)logV)\n- **Bellman-Ford**: Shortest path with negative weights\n\n## 5. Dynamic Programming\n> "Those who cannot remember the past are condemned to repeat it."\n\nKey techniques:\n- **Memoization** (Top-down)\n- **Tabulation** (Bottom-up)\n\n### Classic Problems\n1. Fibonacci sequence\n2. Longest Common Subsequence\n3. 0/1 Knapsack\n4. Matrix Chain Multiplication`,
                createdAt: '2026-01-15T10:30:00Z'
            },
            {
                id: 'r2', title: 'Operating Systems — Mid-Semester Quiz',
                description: 'Practice quiz covering process scheduling, memory management, deadlocks, and file systems. 40 MCQs with detailed solutions.',
                department: 'Computer Science', courseCode: 'CS301', type: 'quiz',
                semester: '5th', subject: 'Operating Systems', module: 'Process Management',
                tags: ['OS', 'scheduling', 'deadlock', 'memory'],
                authorId: 'u2', authorName: 'Rahul Verma', downloads: 189,
                fileType: 'pdf',
                content: '# Operating Systems Quiz\n\n## Process Scheduling\n\n**Q1.** Which scheduling algorithm gives the minimum average waiting time?\n- a) FCFS\n- b) SJF ✓\n- c) Round Robin\n- d) Priority\n\n**Q2.** What is a race condition?\n- A situation where multiple processes access shared data concurrently and the outcome depends on the order of execution.\n\n## Memory Management\n\n**Q3.** What is the difference between paging and segmentation?\n- **Paging**: Fixed-size blocks, no external fragmentation\n- **Segmentation**: Variable-size blocks, logical division\n\n## Deadlocks\n\n**Q4.** List the four conditions for deadlock:\n1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait',
                createdAt: '2026-01-20T14:00:00Z'
            },
            {
                id: 'r3', title: 'Digital Electronics — Assignment 3: Sequential Circuits',
                description: 'Assignment on flip-flops, counters, and state machines with solutions and circuit diagrams.',
                department: 'Electronics', courseCode: 'EC201', type: 'assignment',
                semester: '3rd', subject: 'Digital Electronics', module: 'Sequential Circuits',
                tags: ['flip-flops', 'counters', 'state machines', 'digital logic'],
                authorId: 'u3', authorName: 'Priya Patel', downloads: 98,
                fileType: 'pdf',
                content: '# Assignment 3: Sequential Circuits\n\n## Q1. SR Flip-Flop\nDraw the circuit diagram and truth table for an SR flip-flop.\n\n| S | R | Q(next) |\n|---|---|--------|\n| 0 | 0 | Q (no change) |\n| 0 | 1 | 0 (Reset) |\n| 1 | 0 | 1 (Set) |\n| 1 | 1 | Invalid |\n\n## Q2. 4-bit Binary Counter\nDesign a synchronous 4-bit binary counter using JK flip-flops.\n\n## Q3. Finite State Machine\nDesign a Moore machine that detects the sequence "101" in a binary input stream.',
                createdAt: '2026-02-01T09:00:00Z'
            },
            {
                id: 'r4', title: 'Machine Learning — Linear Regression Notes',
                description: 'Detailed notes on linear regression including mathematical derivation, gradient descent, regularization techniques, and Python implementation.',
                department: 'Computer Science', courseCode: 'CS401', type: 'notes',
                semester: '7th', subject: 'Machine Learning', module: 'Regression',
                tags: ['ML', 'regression', 'gradient descent', 'regularization', 'python'],
                authorId: 'u1', authorName: 'Ananya Sharma', downloads: 312,
                fileType: 'markdown',
                content: `# Linear Regression\n\n## Hypothesis Function\n$$h_\\theta(x) = \\theta_0 + \\theta_1 x$$\n\n## Cost Function (MSE)\n$$J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2$$\n\n## Gradient Descent\n\`\`\`python\ndef gradient_descent(X, y, theta, alpha, iterations):\n    m = len(y)\n    for _ in range(iterations):\n        predictions = X.dot(theta)\n        errors = predictions - y\n        theta -= (alpha / m) * X.T.dot(errors)\n    return theta\n\`\`\`\n\n## Regularization\n- **L1 (Lasso)**: Adds |θ| penalty → sparse solutions\n- **L2 (Ridge)**: Adds θ² penalty → small weights\n- **Elastic Net**: Combination of L1 and L2\n\n## Key Metrics\n- **R² Score**: Coefficient of determination\n- **RMSE**: Root Mean Squared Error\n- **MAE**: Mean Absolute Error`,
                createdAt: '2026-02-05T11:00:00Z'
            },
            {
                id: 'r5', title: 'Probability & Statistics — Practice Problems',
                description: 'Collection of solved problems on probability distributions, hypothesis testing, and confidence intervals.',
                department: 'Mathematics', courseCode: 'MA201', type: 'notes',
                semester: '3rd', subject: 'Probability & Statistics', module: 'Distributions',
                tags: ['probability', 'statistics', 'distributions', 'hypothesis testing'],
                authorId: 'u5', authorName: 'Sneha Gupta', downloads: 156,
                fileType: 'markdown',
                content: '# Probability & Statistics\n\n## Common Distributions\n\n### Normal Distribution\n- Bell-shaped, symmetric around mean μ\n- 68-95-99.7 rule\n- PDF: f(x) = (1/σ√2π) × e^(-(x-μ)²/2σ²)\n\n### Binomial Distribution\n- n independent trials, probability p\n- P(X=k) = C(n,k) × p^k × (1-p)^(n-k)\n\n### Poisson Distribution\n- Events in fixed interval\n- P(X=k) = (λ^k × e^-λ) / k!\n\n## Hypothesis Testing\n1. State H₀ and H₁\n2. Choose significance level α\n3. Calculate test statistic\n4. Find p-value\n5. Make decision\n\n## Confidence Intervals\n- 95% CI: x̄ ± 1.96 × (σ/√n)\n- 99% CI: x̄ ± 2.576 × (σ/√n)',
                createdAt: '2026-02-10T16:00:00Z'
            },
            {
                id: 'r6', title: 'DBMS — Normalization Complete Guide',
                description: 'Step-by-step guide on 1NF, 2NF, 3NF, BCNF with examples, functional dependencies, and SQL queries.',
                department: 'Computer Science', courseCode: 'CS202', type: 'notes',
                semester: '4th', subject: 'Database Systems', module: 'Normalization',
                tags: ['DBMS', 'normalization', 'SQL', 'functional dependencies'],
                authorId: 'u2', authorName: 'Rahul Verma', downloads: 275,
                fileType: 'markdown',
                content: '# Database Normalization\n\n## Why Normalize?\n- Eliminate redundancy\n- Prevent update anomalies\n- Ensure data integrity\n\n## Normal Forms\n\n### 1NF (First Normal Form)\n- All attributes contain atomic values\n- Each row is unique\n\n### 2NF (Second Normal Form)\n- Must be in 1NF\n- No partial dependencies on candidate key\n\n### 3NF (Third Normal Form)\n- Must be in 2NF\n- No transitive dependencies\n\n### BCNF (Boyce-Codd Normal Form)\n- For every FD X→Y, X must be a superkey\n\n## Example\n\`\`\`sql\n-- Before normalization\nCREATE TABLE StudentCourse (\n    student_id INT,\n    student_name VARCHAR(100),\n    course_id INT,\n    course_name VARCHAR(100),\n    instructor VARCHAR(100)\n);\n\n-- After 3NF\nCREATE TABLE Students (student_id INT PRIMARY KEY, student_name VARCHAR(100));\nCREATE TABLE Courses (course_id INT PRIMARY KEY, course_name VARCHAR(100), instructor VARCHAR(100));\nCREATE TABLE Enrollments (student_id INT, course_id INT, PRIMARY KEY(student_id, course_id));\n\`\`\`',
                createdAt: '2026-02-15T13:00:00Z'
            },
            {
                id: 'r7', title: 'Computer Networks — TCP/IP Protocol Suite',
                description: 'Comprehensive notes on TCP/IP model, protocols at each layer, three-way handshake, and network security basics.',
                department: 'Computer Science', courseCode: 'CS302', type: 'notes',
                semester: '5th', subject: 'Computer Networks', module: 'Transport Layer',
                tags: ['networking', 'TCP', 'IP', 'protocols', 'security'],
                authorId: 'u4', authorName: 'Dr. Arun Kumar', downloads: 198,
                fileType: 'markdown',
                content: '# TCP/IP Protocol Suite\n\n## Layers\n1. **Application Layer**: HTTP, FTP, SMTP, DNS\n2. **Transport Layer**: TCP, UDP\n3. **Internet Layer**: IP, ICMP, ARP\n4. **Network Access Layer**: Ethernet, WiFi\n\n## TCP Three-Way Handshake\n1. Client → SYN → Server\n2. Server → SYN-ACK → Client\n3. Client → ACK → Server\n\n## TCP vs UDP\n| Feature | TCP | UDP |\n|---------|-----|-----|\n| Connection | Connection-oriented | Connectionless |\n| Reliability | Reliable | Unreliable |\n| Ordering | Ordered | Unordered |\n| Speed | Slower | Faster |\n| Use Case | Web, Email | Streaming, DNS |',
                createdAt: '2026-02-20T10:00:00Z'
            },
            {
                id: 'r8', title: 'Signals & Systems — Fourier Transform',
                description: 'Notes on Fourier Series, Fourier Transform, Laplace Transform with solved examples and MATLAB code.',
                department: 'Electronics', courseCode: 'EC301', type: 'notes',
                semester: '5th', subject: 'Signals & Systems', module: 'Fourier Analysis',
                tags: ['signals', 'Fourier', 'Laplace', 'transforms', 'MATLAB'],
                authorId: 'u3', authorName: 'Priya Patel', downloads: 145,
                fileType: 'markdown',
                content: '# Fourier Transform\n\n## Fourier Series\nAny periodic signal can be represented as sum of sinusoids:\n\nf(t) = a₀ + Σ(aₙcos(nω₀t) + bₙsin(nω₀t))\n\n## Fourier Transform\nExtends to non-periodic signals:\n\nF(ω) = ∫f(t)e^(-jωt)dt\n\n## Properties\n- **Linearity**: F{af + bg} = aF{f} + bF{g}\n- **Time Shift**: F{f(t-t₀)} = e^(-jωt₀)F(ω)\n- **Frequency Shift**: F{f(t)e^(jω₀t)} = F(ω-ω₀)\n- **Convolution**: F{f*g} = F(ω)G(ω)',
                createdAt: '2026-02-22T15:00:00Z'
            },
        ];
        resources.forEach(r => Store.addResource(r));

        // Demo reviews
        const reviews = [
            { id: 'rev1', resourceId: 'r1', userId: 'u2', userName: 'Rahul Verma', rating: 5, text: 'Excellent notes! Really helped me prepare for my DSA exam. The time complexity tables are super useful.', createdAt: '2026-01-18T12:00:00Z' },
            { id: 'rev2', resourceId: 'r1', userId: 'u3', userName: 'Priya Patel', rating: 4, text: 'Very comprehensive. Would love to see more graph algorithm examples.', createdAt: '2026-01-22T09:00:00Z' },
            { id: 'rev3', resourceId: 'r1', userId: 'u5', userName: 'Sneha Gupta', rating: 5, text: 'Best DSA notes I have found. Clear explanations and great code examples.', createdAt: '2026-02-01T11:00:00Z' },
            { id: 'rev4', resourceId: 'r2', userId: 'u1', userName: 'Ananya Sharma', rating: 4, text: 'Great practice quiz. Solutions are well explained.', createdAt: '2026-01-25T15:00:00Z' },
            { id: 'rev5', resourceId: 'r2', userId: 'u3', userName: 'Priya Patel', rating: 5, text: 'These MCQs covered all important topics. Very helpful!', createdAt: '2026-01-28T10:00:00Z' },
            { id: 'rev6', resourceId: 'r4', userId: 'u2', userName: 'Rahul Verma', rating: 5, text: 'The gradient descent code implementation is perfect. Saved me hours of work.', createdAt: '2026-02-08T14:00:00Z' },
            { id: 'rev7', resourceId: 'r4', userId: 'u5', userName: 'Sneha Gupta', rating: 4, text: 'Good notes on regularization techniques.', createdAt: '2026-02-12T16:00:00Z' },
            { id: 'rev8', resourceId: 'r6', userId: 'u1', userName: 'Ananya Sharma', rating: 5, text: 'The SQL examples make normalization so easy to understand!', createdAt: '2026-02-18T10:00:00Z' },
            { id: 'rev9', resourceId: 'r6', userId: 'u5', userName: 'Sneha Gupta', rating: 4, text: 'Clear step-by-step explanations. Bookmarked for reference.', createdAt: '2026-02-19T12:00:00Z' },
            { id: 'rev10', resourceId: 'r7', userId: 'u1', userName: 'Ananya Sharma', rating: 5, text: 'Professor Kumar\'s notes are always top-notch!', createdAt: '2026-02-22T11:00:00Z' },
            { id: 'rev11', resourceId: 'r5', userId: 'u1', userName: 'Ananya Sharma', rating: 4, text: 'Good set of problems. Could use more on Bayesian statistics.', createdAt: '2026-02-13T09:00:00Z' },
            { id: 'rev12', resourceId: 'r3', userId: 'u2', userName: 'Rahul Verma', rating: 4, text: 'Well-structured assignment with clear solutions.', createdAt: '2026-02-05T08:00:00Z' },
        ];
        reviews.forEach(r => Store.addReview(r));

        // Demo comments
        const comments = [
            { id: 'c1', resourceId: 'r1', userId: 'u2', userName: 'Rahul Verma', text: 'Can someone explain the difference between BFS and DFS more intuitively?', parentId: null, likes: 3, createdAt: '2026-01-19T10:00:00Z' },
            { id: 'c2', resourceId: 'r1', userId: 'u1', userName: 'Ananya Sharma', text: 'Think of BFS as exploring level by level (like ripples in water), while DFS goes as deep as possible first (like exploring a maze). BFS uses a queue, DFS uses a stack.', parentId: 'c1', likes: 7, createdAt: '2026-01-19T11:00:00Z' },
            { id: 'c3', resourceId: 'r1', userId: 'u5', userName: 'Sneha Gupta', text: 'Great analogy @Ananya! Also worth noting BFS is better for shortest path in unweighted graphs.', parentId: 'c1', likes: 4, createdAt: '2026-01-19T14:00:00Z' },
            { id: 'c4', resourceId: 'r1', userId: 'u3', userName: 'Priya Patel', text: 'Is there a good way to remember when to use DP vs greedy?', parentId: null, likes: 5, createdAt: '2026-01-25T08:00:00Z' },
            { id: 'c5', resourceId: 'r1', userId: 'u4', userName: 'Dr. Arun Kumar', text: 'Greedy makes locally optimal choices and works when the problem has the greedy-choice property. DP is for problems with overlapping subproblems. If you can prove greedy works, use it (simpler). Otherwise, try DP.', parentId: 'c4', likes: 12, createdAt: '2026-01-25T09:30:00Z' },
            { id: 'c6', resourceId: 'r2', userId: 'u3', userName: 'Priya Patel', text: 'The deadlock section was really helpful for understanding Banker\'s algorithm!', parentId: null, likes: 2, createdAt: '2026-01-30T12:00:00Z' },
            { id: 'c7', resourceId: 'r4', userId: 'u5', userName: 'Sneha Gupta', text: 'From a math perspective, the gradient descent derivation here is very clean. Nice work!', parentId: null, likes: 6, createdAt: '2026-02-09T10:00:00Z' },
            { id: 'c8', resourceId: 'r6', userId: 'u3', userName: 'Priya Patel', text: 'Quick question: is BCNF always achievable without losing functional dependencies?', parentId: null, likes: 3, createdAt: '2026-02-20T09:00:00Z' },
            { id: 'c9', resourceId: 'r6', userId: 'u2', userName: 'Rahul Verma', text: 'No, sometimes decomposing to BCNF can cause loss of functional dependencies. In such cases, 3NF is preferred as it guarantees dependency preservation.', parentId: 'c8', likes: 5, createdAt: '2026-02-20T10:00:00Z' },
        ];
        comments.forEach(c => Store.addComment(c));

        // Demo pull requests
        const pullRequests = [
            {
                id: 'pr1', resourceId: 'r1', resourceTitle: 'Data Structures & Algorithms — Complete Notes',
                authorId: 'u2', authorName: 'Rahul Verma',
                title: 'Add Trie data structure section',
                description: 'Added a new section on Trie (prefix tree) data structure with implementation and use cases like autocomplete and spell checking.',
                status: 'open',
                originalContent: '## 3. Trees\n- **Binary Tree**: Each node has at most two children\n- **BST**: Left child < parent < right child\n- **AVL Tree**: Self-balancing BST\n- **Red-Black Tree**: Self-balancing BST with color properties',
                proposedContent: '## 3. Trees\n- **Binary Tree**: Each node has at most two children\n- **BST**: Left child < parent < right child\n- **AVL Tree**: Self-balancing BST\n- **Red-Black Tree**: Self-balancing BST with color properties\n- **Trie**: Prefix tree for efficient string operations\n\n### 3.1 Trie (Prefix Tree)\nA trie is a tree-like data structure used for efficient retrieval of keys in a dataset.\n\n**Use cases:** Autocomplete, spell checker, IP routing\n\n**Time Complexity:** O(m) for search/insert where m is key length',
                createdAt: '2026-02-25T10:00:00Z'
            },
            {
                id: 'pr2', resourceId: 'r4', resourceTitle: 'Machine Learning — Linear Regression Notes',
                authorId: 'u5', authorName: 'Sneha Gupta',
                title: 'Fix gradient descent formula typo',
                description: 'Fixed a mathematical notation issue in the gradient descent section and added explanation of learning rate selection.',
                status: 'merged',
                originalContent: '## Gradient Descent\nUpdate rule: θ = θ - α∇J(θ)',
                proposedContent: '## Gradient Descent\nUpdate rule: θⱼ := θⱼ - α × (∂J(θ)/∂θⱼ)\n\n**Learning Rate Selection:**\n- Too large: may overshoot minimum\n- Too small: slow convergence\n- Common practice: start with 0.01, use learning rate scheduling',
                createdAt: '2026-02-20T14:00:00Z',
                mergedAt: '2026-02-21T09:00:00Z'
            },
            {
                id: 'pr3', resourceId: 'r7', resourceTitle: 'Computer Networks — TCP/IP Protocol Suite',
                authorId: 'u1', authorName: 'Ananya Sharma',
                title: 'Add HTTP/2 and HTTP/3 comparison',
                description: 'Proposed adding a section comparing HTTP/1.1, HTTP/2, and HTTP/3 protocols with performance improvements.',
                status: 'open',
                originalContent: '## Layers\n1. **Application Layer**: HTTP, FTP, SMTP, DNS',
                proposedContent: '## Layers\n1. **Application Layer**: HTTP, FTP, SMTP, DNS\n\n### HTTP Evolution\n| Feature | HTTP/1.1 | HTTP/2 | HTTP/3 |\n|---------|----------|--------|--------|\n| Multiplexing | No | Yes | Yes |\n| Header Compression | No | HPACK | QPACK |\n| Transport | TCP | TCP | QUIC/UDP |\n| Server Push | No | Yes | Yes |',
                createdAt: '2026-02-26T11:00:00Z'
            },
        ];
        pullRequests.forEach(pr => Store.addPullRequest(pr));

        // Demo progress
        const progress = [
            { userId: 'u1', resourceId: 'r2', status: 'read' },
            { userId: 'u1', resourceId: 'r6', status: 'understood' },
            { userId: 'u1', resourceId: 'r7', status: 'read' },
            { userId: 'u2', resourceId: 'r1', status: 'understood' },
            { userId: 'u2', resourceId: 'r4', status: 'read' },
        ];
        progress.forEach(p => Store.setProgress(p.userId, p.resourceId, p.status));

        Store.markSeeded();
    }

    return { seed };
})();
