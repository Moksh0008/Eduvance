/* ═══════════════════════════════════════════════════
   QUESTION BANK — Real MCQ questions by subject/topic
   Questions are grounded in actual CS curriculum
   ═══════════════════════════════════════════════════ */

const QUESTIONS = {
  'DBMS': {
    'Normalization': {
      easy: [
        { q: 'What is the main purpose of database normalization?', options: ['Reduce redundancy', 'Increase speed', 'Add more tables', 'Remove indexes'], answer: 0 },
        { q: 'In 1NF, each column must contain:', options: ['Atomic values', 'Multiple values', 'Null values', 'Arrays'], answer: 0 },
        { q: 'A relation is in 2NF if it is in 1NF and:', options: ['Has no partial dependencies', 'Has no transitive dependencies', 'Has no composite keys', 'Has no foreign keys'], answer: 0 },
        { q: 'Which normal form deals with transitive dependencies?', options: ['3NF', '1NF', '2NF', 'BCNF'], answer: 0 },
        { q: 'BCNF is a stricter version of:', options: ['3NF', '2NF', '1NF', '4NF'], answer: 0 },
      ],
      medium: [
        { q: 'A table has composite key (A,B) and attribute C depends only on A. This violates:', options: ['2NF', '3NF', 'BCNF', '1NF'], answer: 0 },
        { q: 'Which normal form removes all transitive dependencies?', options: ['3NF', '2NF', '1NF', 'BCNF'], answer: 0 },
        { q: 'A functional dependency X→Y where X is a candidate key satisfies:', options: ['BCNF', 'Only 1NF', 'Only 2NF', 'None'], answer: 0 },
        { q: 'Decomposition for 3NF must be lossless and:', options: ['Dependency preserving', 'BCNF compliant', '4NF compliant', '2NF compliant'], answer: 0 },
        { q: 'If A→B and B→C, then A→C is called:', options: ['Transitivity', 'Reflexivity', 'Augmentation', 'Decomposition'], answer: 0 },
      ],
      hard: [
        { q: 'A relation R(A,B,C) has FDs {A→B, B→C, A→C}. Key is A. R is in:', options: ['BCNF', '3NF only', '2NF only', '1NF only'], answer: 0 },
        { q: 'In BCNF, for every FD X→Y, X must be:', options: ['A superkey', 'A foreign key', 'A composite key', 'A candidate key only'], answer: 0 },
        { q: 'A multivalued dependency X→→Y violates:', options: ['4NF', 'BCNF', '3NF', '2NF'], answer: 0 },
        { q: 'Lossless join decomposition ensures:', options: ['Original relation can be reconstructed', 'No data is duplicated', 'All FDs are preserved', 'Performance improves'], answer: 0 },
        { q: 'If R is in BCNF but not 3NF, this is:', options: ['Impossible — BCNF ⊂ 3NF', 'Always true', 'Sometimes true', 'Never relevant'], answer: 0 },
      ],
    },
    'SQL': {
      easy: [
        { q: 'Which SQL keyword is used to fetch data from a database?', options: ['SELECT', 'GET', 'FETCH', 'RETRIEVE'], answer: 0 },
        { q: 'The WHERE clause is used to:', options: ['Filter records', 'Sort records', 'Group records', 'Join tables'], answer: 0 },
        { q: 'Which aggregate function returns the total number of rows?', options: ['COUNT', 'SUM', 'AVG', 'TOTAL'], answer: 0 },
        { q: 'HAVING clause is used with:', options: ['GROUP BY', 'WHERE', 'ORDER BY', 'SELECT'], answer: 0 },
        { q: 'The JOIN clause is used to:', options: ['Combine rows from two or more tables', 'Delete tables', 'Create tables', 'Update records'], answer: 0 },
      ],
      medium: [
        { q: 'A correlated subquery executes:', options: ['Once per row of outer query', 'Once total', 'Only on empty tables', 'Only with JOIN'], answer: 0 },
        { q: 'Which JOIN returns all rows from both tables?', options: ['FULL OUTER JOIN', 'INNER JOIN', 'LEFT JOIN', 'CROSS JOIN'], answer: 0 },
        { q: 'A view in SQL is:', options: ['A stored query', 'A physical table', 'An index', 'A stored procedure'], answer: 0 },
        { q: 'UNION removes duplicate rows, UNION ALL does:', options: ['Keeps all rows including duplicates', 'Removes more duplicates', 'Sorts results', 'Groups results'], answer: 0 },
        { q: 'An index in SQL improves:', options: ['SELECT query performance', 'INSERT performance', 'UPDATE performance', 'DELETE performance'], answer: 0 },
      ],
      hard: [
        { q: 'A window function RANK() assigns the same rank to ties, then:', options: ['Skips the next rank', 'Does not skip ranks', 'Uses decimal ranks', 'Assigns negative ranks'], answer: 0 },
        { q: 'Which isolation level prevents dirty reads but allows phantom reads?', options: ['READ COMMITTED', 'READ UNCOMMITTED', 'SERIALIZABLE', 'REPEATABLE READ'], answer: 0 },
        { q: 'A CTE (Common Table Expression) is:', options: ['A temporary named result set', 'A permanent table', 'An index', 'A stored procedure'], answer: 0 },
        { q: 'GROUPING SETS allows:', options: ['Multiple GROUP BY specifications in one query', 'Multiple WHERE clauses', 'Multiple JOINs', 'Multiple subqueries'], answer: 0 },
        { q: 'The EXPLAIN keyword in SQL is used to:', options: ['Show query execution plan', 'Delete a table', 'Create an index', 'Export data'], answer: 0 },
      ],
    },
    'Transactions': {
      easy: [
        { q: 'ACID stands for Atomicity, Consistency, Isolation, and:', options: ['Durability', 'Dependency', 'Depth', 'Density'], answer: 0 },
        { q: 'A transaction is a:', options: ['Logical unit of work', 'Physical file', 'Database table', 'User account'], answer: 0 },
        { q: 'COMMIT in a transaction means:', options: ['Save all changes permanently', 'Undo changes', 'Lock the table', 'Delete the transaction'], answer: 0 },
        { q: 'ROLLBACK does:', options: ['Undoes all changes in the transaction', 'Saves changes', 'Creates a checkpoint', 'Locks the database'], answer: 0 },
        { q: 'A dirty read occurs when:', options: ['Uncommitted data is read by another transaction', 'Data is read after commit', 'Data is read with a lock', 'Data is deleted'], answer: 0 },
      ],
      medium: [
        { q: 'The isolation level SERIALIZABLE prevents:', options: ['All concurrency anomalies', 'Only dirty reads', 'Only phantom reads', 'Only lost updates'], answer: 0 },
        { q: 'Two-phase locking (2PL) has:', options: ['Growing and shrinking phases', 'Read and write phases', 'Lock and unlock phases', 'Begin and end phases'], answer: 0 },
        { q: 'A deadlock occurs when:', options: ['Two transactions wait for each other permanently', 'One transaction fails', 'Database is locked', 'Connection is lost'], answer: 0 },
        { q: 'MVCC (Multi-Version Concurrency Control) allows:', options: ['Readers and writers to not block each other', 'Only one transaction at a time', 'Automatic deadlocks', 'No locking needed'], answer: 0 },
        { q: 'A savepoint in a transaction allows:', options: ['Partial rollback to a specific point', 'Full commit', 'Table creation', 'User authentication'], answer: 0 },
      ],
      hard: [
        { q: 'Write-Ahead Logging (WAL) ensures:', options: ['Changes are logged before being written to disk', 'Changes are logged after writing', 'No logging is needed', 'Only committed data is logged'], answer: 0 },
        { q: 'Snapshot isolation provides:', options: ['Each transaction sees a consistent snapshot', 'No isolation at all', 'Only row-level locks', 'Automatic commit'], answer: 0 },
        { q: 'A lost update problem occurs when:', options: ['Two transactions overwrite each other\'s changes', 'Data is permanently deleted', 'Transaction timeout', 'Lock is not released'], answer: 0 },
        { q: 'The phantom problem in transactions refers to:', options: ['New rows appearing between reads', 'Rows being deleted', 'Data corruption', 'Connection timeout'], answer: 0 },
        { q: 'Strict 2PL requires locks to be held until:', options: ['Transaction commits or aborts', 'Only during reads', 'Only during writes', 'At the start of transaction'], answer: 0 },
      ],
    },
    'ER Model': {
      easy: [
        { q: 'An entity in ER model represents:', options: ['A real-world object or concept', 'A table column', 'A database index', 'A user'], answer: 0 },
        { q: 'A relationship in ER model connects:', options: ['Two or more entities', 'Two columns', 'Two databases', 'Two users'], answer: 0 },
        { q: 'An attribute that uniquely identifies an entity is called:', options: ['Key attribute', 'Simple attribute', 'Composite attribute', 'Derived attribute'], answer: 0 },
        { q: 'A weak entity depends on:', options: ['Another entity for identification', 'No entity', 'The database admin', 'A view'], answer: 0 },
        { q: 'Cardinality in ER model describes:', options: ['Number of entity instances in a relationship', 'Number of tables', 'Number of rows', 'Number of indexes'], answer: 0 },
      ],
      medium: [
        { q: 'A ternary relationship involves:', options: ['Three entity types', 'Three attributes', 'Three tables', 'Three keys'], answer: 0 },
        { q: 'A derived attribute is calculated from:', options: ['Other stored attributes', 'External sources', 'Random values', 'Nothing'], answer: 0 },
        { q: 'An aggregation in ER model is used to:', options: ['Treat a relationship as a higher-level entity', 'Delete entities', 'Merge tables', 'Create indexes'], answer: 0 },
        { q: 'Total participation means:', options: ['Every entity instance must participate', 'No entity needs to participate', 'Only some participate', 'Only key entities participate'], answer: 0 },
        { q: 'Generalization in ER model is:', options: ['Bottom-up approach combining entities', 'Top-down splitting', 'Table creation', 'Index building'], answer: 0 },
      ],
      hard: [
        { q: 'In EER, a category (union type) is:', options: ['Union of entity subsets that form a superclass', 'A regular entity', 'A relationship type', 'An attribute type'], answer: 0 },
        { q: 'Specialization hierarchy depth affects:', options: ['Complexity of queries and constraints', 'Only storage', 'Only display', 'Nothing'], answer: 0 },
        { q: 'Disjoint constraint in specialization means:', options: ['An entity can belong to at most one subclass', 'Entity belongs to all subclasses', 'No subclasses exist', 'Entities are shared'], answer: 0 },
        { q: 'Completeness constraint (total) means:', options: ['Every superclass entity must be in a subclass', 'No entity needs subclass', 'Only some entities need subclasses', 'Subclasses are optional'], answer: 0 },
        { q: 'A relationship type with attributes is equivalent to:', options: ['An entity type in EER', 'A view', 'An index', 'A stored procedure'], answer: 0 },
      ],
    },
  },
  'CN': {
    'OSI Model': {
      easy: [
        { q: 'How many layers does the OSI model have?', options: ['7', '4', '5', '6'], answer: 0 },
        { q: 'Which layer is responsible for end-to-end delivery?', options: ['Transport', 'Network', 'Data Link', 'Session'], answer: 0 },
        { q: 'The Physical layer deals with:', options: ['Bit transmission', 'Packet routing', 'Data formatting', 'Session management'], answer: 0 },
        { q: 'Which layer handles encryption/decryption?', options: ['Presentation', 'Application', 'Transport', 'Network'], answer: 0 },
        { q: 'HTTP operates at which layer?', options: ['Application', 'Transport', 'Network', 'Session'], answer: 0 },
      ],
      medium: [
        { q: 'TCP operates at which OSI layer?', options: ['Transport', 'Network', 'Data Link', 'Session'], answer: 0 },
        { q: 'The Data Link layer uses:', options: ['MAC addresses', 'IP addresses', 'Port numbers', 'Domain names'], answer: 0 },
        { q: 'Which protocol operates at the Network layer?', options: ['IP', 'TCP', 'HTTP', 'Ethernet'], answer: 0 },
        { q: 'PDU at the Transport layer is called:', options: ['Segment', 'Packet', 'Frame', 'Bit'], answer: 0 },
        { q: 'The Session layer manages:', options: ['Dialogues between applications', 'Physical transmission', 'Routing', 'Data encoding'], answer: 0 },
      ],
      hard: [
        { q: 'Which OSI layer is NOT present in the TCP/IP model?', options: ['Session and Presentation', 'Transport', 'Network', 'Application'], answer: 0 },
        { q: 'At which layer does a switch primarily operate?', options: ['Data Link', 'Network', 'Transport', 'Physical'], answer: 0 },
        { q: 'Encapsulation in networking means:', options: ['Each layer adds its own header', 'Removing headers', 'Encrypting data', 'Compressing data'], answer: 0 },
        { q: 'A router operates at which layer?', options: ['Network', 'Data Link', 'Transport', 'Physical'], answer: 0 },
        { q: 'ARP maps:', options: ['IP address to MAC address', 'MAC to IP', 'Domain to IP', 'Port to protocol'], answer: 0 },
      ],
    },
    'TCP/IP': {
      easy: [
        { q: 'TCP stands for:', options: ['Transmission Control Protocol', 'Transfer Control Protocol', 'Total Control Protocol', 'Transaction Control Protocol'], answer: 0 },
        { q: 'UDP is:', options: ['Connectionless and faster than TCP', 'Connection-oriented and slower', 'Always encrypted', 'Only used for web browsing'], answer: 0 },
        { q: 'A port number identifies:', options: ['A specific process or service', 'A specific computer', 'A specific network', 'A specific cable'], answer: 0 },
        { q: 'HTTP typically uses port:', options: ['80', '443', '21', '25'], answer: 0 },
        { q: 'HTTPS uses port:', options: ['443', '80', '21', '8080'], answer: 0 },
      ],
      medium: [
        { q: 'TCP three-way handshake involves:', options: ['SYN, SYN-ACK, ACK', 'SYN, ACK, FIN', 'SYN, SYN, ACK', 'ACK, ACK, SYN'], answer: 0 },
        { q: 'TCP flow control uses:', options: ['Sliding window', 'Stop and wait', 'Token passing', 'CSMA/CD'], answer: 0 },
        { q: 'The TIME_WAIT state in TCP prevents:', options: ['Delayed duplicate segments', 'Buffer overflow', 'Connection refused', 'Deadlock'], answer: 0 },
        { q: 'Nagle\'s algorithm is used to:', options: ['Reduce small packet overhead', 'Increase bandwidth', 'Encrypt data', 'Route packets'], answer: 0 },
        { q: 'Socket in networking is:', options: ['Endpoint of a communication link', 'A cable type', 'A router', 'A protocol'], answer: 0 },
      ],
      hard: [
        { q: 'TCP congestion control uses which algorithms?', options: ['Slow Start, Congestion Avoidance, Fast Recovery', 'Token Bucket, Leaky Bucket', 'Dijkstra, Bellman-Ford', 'ARQ, FEC'], answer: 0 },
        { q: 'Silly Window Syndrome is avoided by:', options: ['Clark\'s solution and Nagle\'s algorithm', 'Encryption', 'Compression', 'Multiplexing'], answer: 0 },
        { q: 'TCP selective repeat acknowledges:', options: ['Only the correctly received segments', 'All segments', 'Only the first segment', 'Only the last segment'], answer: 0 },
        { q: 'Karn\'s algorithm is used in:', options: ['RTT estimation', 'Checksum calculation', 'Flow control', 'Address resolution'], answer: 0 },
        { q: 'Fast Retransmit triggers after:', options: ['3 duplicate ACKs', '1 duplicate ACK', 'Timeout', '5 duplicate ACKs'], answer: 0 },
      ],
    },
  },
  'OS': {
    'Process Management': {
      easy: [
        { q: 'A process is:', options: ['A program in execution', 'A stored program', 'A compiled code', 'A hardware component'], answer: 0 },
        { q: 'A thread is:', options: ['A lightweight process within a process', 'A separate program', 'A hardware unit', 'A memory block'], answer: 0 },
        { q: 'Context switching is:', options: ['Saving and restoring process state', 'Creating a new process', 'Terminating a process', 'Scheduling interrupts'], answer: 0 },
        { q: 'A PCB (Process Control Block) stores:', options: ['Process state, registers, and info', 'Only the program code', 'Only the output', 'User passwords'], answer: 0 },
        { q: 'Which is NOT a process state?', options: ['Compiled', 'Ready', 'Running', 'Blocked'], answer: 0 },
      ],
      medium: [
        { q: 'Race condition occurs when:', options: ['Multiple processes access shared data concurrently', 'A process is terminated', 'Memory is full', 'CPU is idle'], answer: 0 },
        { q: 'A semaphore is used for:', options: ['Process synchronization', 'Memory allocation', 'File management', 'Process creation'], answer: 0 },
        { q: 'Deadlock requires all EXCEPT:', options: ['Mutual exclusion', 'Hold and wait', 'No preemption', 'Starvation'], answer: 0 },
        { q: 'The Banker\'s algorithm prevents:', options: ['Deadlock', 'Starvation', 'Thrashing', 'Fragmentation'], answer: 0 },
        { q: 'A mutex allows:', options: ['Only one thread to access a resource at a time', 'Multiple threads simultaneously', 'No thread access', 'Unlimited access'], answer: 0 },
      ],
      hard: [
        { q: 'The dining philosophers problem illustrates:', options: ['Deadlock in concurrent resource allocation', 'Memory management', 'File systems', 'Network protocols'], answer: 0 },
        { q: 'Monitors provide:', options: ['Higher-level synchronization than semaphores', 'Lower-level synchronization', 'No synchronization', 'Hardware synchronization'], answer: 0 },
        { q: 'Priority inversion is solved by:', options: ['Priority inheritance protocol', 'Round-robin scheduling', 'FIFO queuing', 'Memory paging'], answer: 0 },
        { q: 'A process image includes:', options: ['PCB, code, data, stack, and heap', 'Only the executable', 'Only the output', 'Only the input'], answer: 0 },
        { q: 'IPC (Inter-Process Communication) methods include:', options: ['Pipes, message queues, shared memory', 'Only pipes', 'Only files', 'Only network'], answer: 0 },
      ],
    },
    'Memory Management': {
      easy: [
        { q: 'Virtual memory allows:', options: ['Programs to use more memory than physically available', 'Faster CPU', 'More storage', 'Better graphics'], answer: 0 },
        { q: 'A page fault occurs when:', options: ['A referenced page is not in RAM', 'Memory is full', 'CPU is busy', 'Disk is full'], answer: 0 },
        { q: 'Paging divides memory into:', options: ['Fixed-size blocks called pages', 'Variable-size segments', 'Random blocks', 'No blocks'], answer: 0 },
        { q: 'The TLB (Translation Lookaside Buffer) is:', options: ['Cache for page table entries', 'Main memory', 'Hard disk', 'CPU register'], answer: 0 },
        { q: 'Swap space is used for:', options: ['Storing pages not currently in RAM', 'Backup data', 'Installing software', 'Temporary files'], answer: 0 },
      ],
      medium: [
        { q: 'Thrashing occurs when:', options: ['System spends more time paging than executing', 'CPU usage is 100%', 'Memory is empty', 'Disk is full'], answer: 0 },
        { q: 'The working set model helps prevent:', options: ['Thrashing', 'Deadlock', 'Starvation', 'Race conditions'], answer: 0 },
        { q: 'In segmentation, segments are:', options: ['Variable-size logical units', 'Fixed-size blocks', 'Random chunks', 'No divisions'], answer: 0 },
        { q: 'Belady\'s anomaly occurs in:', options: ['FIFO page replacement', 'LRU', 'Optimal', 'LFU'], answer: 0 },
        { q: 'The page replacement algorithm LRU replaces:', options: ['Least recently used page', 'Most recently used page', 'Random page', 'Newest page'], answer: 0 },
      ],
      hard: [
        { q: 'Multi-level page tables reduce:', options: ['Memory needed for page tables', 'Page fault rate', 'CPU usage', 'Disk I/O'], answer: 0 },
        { q: 'Inverted page tables have one entry per:', options: ['Physical frame', 'Logical page', 'Process', 'Segment'], answer: 0 },
        { q: 'Copy-on-write optimization:', options: ['Defers copying until a write occurs', 'Always copies immediately', 'Never copies', 'Copies on read'], answer: 0 },
        { q: 'A dirty page is one that has been:', options: ['Modified in memory but not written to disk', 'Read from disk', 'Deleted', 'Never accessed'], answer: 0 },
        { q: 'The clock algorithm approximates:', options: ['LRU replacement', 'FIFO replacement', 'Optimal replacement', 'Random replacement'], answer: 0 },
      ],
    },
  },
  'Java': {
    'OOP Concepts': {
      easy: [
        { q: 'Encapsulation in Java means:', options: ['Bundling data and methods, hiding internals', 'Only using public methods', 'Inheriting from parent class', 'Using interfaces'], answer: 0 },
        { q: 'A class in Java is:', options: ['A blueprint for objects', 'An object itself', 'A method', 'A variable'], answer: 0 },
        { q: 'Inheritance allows a class to:', options: ['Reuse and extend another class\'s behavior', 'Delete another class', 'Copy another class exactly', 'Rename another class'], answer: 0 },
        { q: 'Polymorphism means:', options: ['Objects can take many forms', 'Only one class exists', 'No inheritance', 'Static typing only'], answer: 0 },
        { q: 'The \'this\' keyword refers to:', options: ['Current object instance', 'Parent class', 'Static method', 'Any variable'], answer: 0 },
      ],
      medium: [
        { q: 'Method overriding allows:', options: ['Subclass to provide specific implementation of parent method', 'Creating new methods', 'Deleting methods', 'Static method changes'], answer: 0 },
        { q: 'An abstract class:', options: ['Cannot be instantiated directly', 'Has no methods', 'Is always final', 'Cannot have constructors'], answer: 0 },
        { q: 'An interface in Java:', options: ['Defines a contract that classes must implement', 'Is a concrete class', 'Has state', 'Has private methods only'], answer: 0 },
        { q: 'The \'super\' keyword refers to:', options: ['Parent class instance', 'Current class', 'Static context', 'Any object'], answer: 0 },
        { q: 'Multiple inheritance is supported through:', options: ['Interfaces only', 'Classes only', 'Both equally', 'Neither'], answer: 0 },
      ],
      hard: [
        { q: 'The Diamond Problem in inheritance refers to:', options: ['Ambiguity when two parent classes have same method', 'Memory leak', 'Stack overflow', 'Null pointer'], answer: 0 },
        { q: 'Covariant return types allow:', options: ['Overriding method to return a subtype', 'Any return type', 'No return type changes', 'Only primitive returns'], answer: 0 },
        { q: 'The instanceof operator checks:', options: ['Whether an object is an instance of a class/interface', 'Object memory size', 'Object age', 'Object hash'], answer: 0 },
        { q: 'Static polymorphism is resolved at:', options: ['Compile time', 'Runtime', 'Link time', 'Load time'], answer: 0 },
        { q: 'Dynamic method dispatch means:', options: ['Method call resolved at runtime based on object type', 'Methods are static', 'Methods cannot be overridden', 'Only constructor dispatch'], answer: 0 },
      ],
    },
    'Collections': {
      easy: [
        { q: 'ArrayList in Java is:', options: ['A resizable array', 'A fixed-size array', 'A linked list', 'A tree'], answer: 0 },
        { q: 'HashMap stores data as:', options: ['Key-value pairs', 'Only values', 'Only keys', 'Ordered pairs'], answer: 0 },
        { q: 'LinkedList is best for:', options: ['Frequent insertions and deletions', 'Random access', 'Sorting', 'Searching'], answer: 0 },
        { q: 'HashSet does NOT allow:', options: ['Duplicate elements', 'Null values', 'Objects', 'Iteration'], answer: 0 },
        { q: 'Iterator is used to:', options: ['Traverse a collection', 'Create a collection', 'Delete a collection', 'Sort a collection'], answer: 0 },
      ],
      medium: [
        { q: 'TreeMap maintains elements in:', options: ['Sorted order by key', 'Insertion order', 'Random order', 'Reverse order'], answer: 0 },
        { q: 'ConcurrentHashMap is:', options: ['Thread-safe HashMap', 'Regular HashMap', 'Synchronized wrapper', 'Immutable map'], answer: 0 },
        { q: 'The Comparable interface defines:', options: ['natural ordering via compareTo()', 'Comparator logic', 'Equality only', 'Hashing only'], answer: 0 },
        { q: 'Generics in Collections provide:', options: ['Type safety at compile time', 'Faster runtime', 'Less memory', 'More flexibility'], answer: 0 },
        { q: 'fail-fast iterators throw:', options: ['ConcurrentModificationException', 'NullPointerException', 'IndexOutOfBoundsException', 'ClassCastException'], answer: 0 },
      ],
      hard: [
        { q: 'ConcurrentHashMap uses:', options: ['Segment-level locking (or CAS in Java 8+)', 'Global lock', 'No locking', 'File locking'], answer: 0 },
        { q: 'CopyOnWriteArrayList is best for:', options: ['Read-heavy, write-light scenarios', 'Write-heavy scenarios', 'Random access', 'Sorting'], answer: 0 },
        { q: 'The identityHashMap uses:', options: ['Reference equality (==) instead of equals()', 'Normal equals()', 'HashCode only', 'Comparable only'], answer: 0 },
        { q: 'WeakHashMap entries are:', options: ['Garbage collected when no strong references exist', 'Never collected', 'Always persistent', 'Thread-protected'], answer: 0 },
        { q: 'PriorityQueue orders elements by:', options: ['Natural ordering or comparator', 'Insertion order', 'Random order', 'Hash code'], answer: 0 },
      ],
    },
  },
}

/**
 * Get questions for a given subject/topic, with adaptive difficulty
 * @param {string} subject
 * @param {string} topic
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @param {number} count - number of questions to return
 * @returns {Array} array of question objects
 */
export function getQuestions(subject, topic, difficulty = 'medium', count = 10) {
  const subjectBank = QUESTIONS[subject]
  if (!subjectBank) return []

  const topicBank = subjectBank[topic]
  if (!topicBank) {
    // Try fuzzy match — find a topic that contains the search term
    const allTopics = Object.keys(subjectBank)
    const match = allTopics.find(t =>
      t.toLowerCase().includes(topic.toLowerCase()) ||
      topic.toLowerCase().includes(t.toLowerCase())
    )
    if (!match) return []
    return getQuestions(subject, match, difficulty, count)
  }

  // Get questions at requested difficulty, fall back to others
  const primary = topicBank[difficulty] || []
  const fallback1 = difficulty === 'hard' ? (topicBank.medium || []) : (topicBank[difficulty === 'easy' ? 'medium' : 'easy'] || [])
  const fallback2 = topicBank.easy || []

  // Shuffle and pick
  const pool = [...primary, ...fallback1, ...fallback2]
  const shuffled = pool.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((q, i) => ({
    id: `q-${subject.slice(0, 2).toUpperCase()}-${Date.now()}-${i}`,
    prompt: q.q,
    options: q.options,
    answer: q.answer,
    difficulty,
    subject,
    topic,
  }))
}

/**
 * Get available subjects from the question bank
 */
export function getAvailableSubjects() {
  return Object.keys(QUESTIONS)
}

/**
 * Get available topics for a subject
 */
export function getAvailableTopics(subject) {
  return Object.keys(QUESTIONS[subject] || {})
}

/**
 * Determine difficulty level based on recent performance
 * @param {number} recentScore - most recent quiz score (0-100)
 * @param {string} currentDifficulty
 * @returns {string} new difficulty
 */
export function adaptDifficulty(recentScore, currentDifficulty = 'medium') {
  if (recentScore >= 80) {
    if (currentDifficulty === 'easy') return 'medium'
    if (currentDifficulty === 'medium') return 'hard'
    return 'hard'
  }
  if (recentScore < 50) {
    if (currentDifficulty === 'hard') return 'medium'
    if (currentDifficulty === 'medium') return 'easy'
    return 'easy'
  }
  return currentDifficulty
}

/**
 * Get all available questions (for analytics/debugging)
 */
export function getAllQuestions() {
  return QUESTIONS
}
