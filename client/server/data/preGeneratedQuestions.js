/* ═══════════════════════════════════════════════════
   PRE-GENERATED QUESTION BANK DATA
   Common CS subjects/topics with curated questions.
   Used by the seeding script to populate MongoDB.
   ═══════════════════════════════════════════════════ */

export const preGeneratedQuestions = {

  // ─── COMPUTER NETWORKS ───
  'computer networks|networking commands': {
    easy: [
      { prompt: 'Which command displays the IP configuration on a Windows system?', options: ['ipconfig', 'ifconfig', 'ping', 'traceroute'], correctAnswer: 0, explanation: 'ipconfig displays all current TCP/IP network configuration values on Windows.' },
      { prompt: 'What does the ping command test?', options: ['Network connectivity between two hosts', 'File transfer speed', 'DNS resolution only', 'Port availability'], correctAnswer: 0, explanation: 'Ping tests the reachability of a host on an IP network and measures round-trip time.' },
      { prompt: 'Which command is used to trace the route packets take to a network destination?', options: ['traceroute', 'netstat', 'nslookup', 'arp'], correctAnswer: 0, explanation: 'traceroute (or tracert on Windows) shows the path packets take to reach a destination.' },
      { prompt: 'What does nslookup do?', options: [' Queries DNS to obtain domain name or IP address mapping', 'Lists all network connections', 'Displays routing tables', 'Tests port connectivity'], correctAnswer: 0, explanation: 'nslookup is a network tool for querying DNS to find domain name or IP address mapping.' },
      { prompt: 'Which command shows active network connections on a system?', options: ['netstat', 'ping', 'ipconfig', 'dig'], correctAnswer: 0, explanation: 'netstat displays network connections, routing tables, and network interface statistics.' },
    ],
    medium: [
      { prompt: 'What is the purpose of the ARP command?', options: ['Maps IP addresses to MAC addresses', 'Resolves domain names to IPs', 'Configures network interfaces', 'Tests network latency'], correctAnswer: 0, explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on a local network.' },
      { prompt: 'Which flag in the ping command sets the packet size?', options: ['-l (Windows) or -s (Linux)', '-p', '-t', '-c'], correctAnswer: 0, explanation: 'On Windows, ping -l sets packet size; on Linux, ping -s sets the data size in bytes.' },
      { prompt: 'What does the tracert -d command do on Windows?', options: ['Disables DNS resolution for faster tracing', 'Enables detailed output', 'Sets maximum hop count', 'Uses ICMP instead of TCP'], correctAnswer: 0, explanation: 'The -d flag prevents tracert from resolving IP addresses to hostnames, making it faster.' },
      { prompt: 'Which command displays the DNS cache on Windows?', options: ['ipconfig /displaydns', 'nslookup /cache', 'netstat /dns', 'arp -a'], correctAnswer: 0, explanation: 'ipconfig /displaydns shows the contents of the DNS resolver cache on Windows.' },
      { prompt: 'What is the purpose of the route command?', options: ['Displays or modifies the IP routing table', 'Traces packet routes', 'Configures DNS servers', 'Manages network interfaces'], correctAnswer: 0, explanation: 'The route command displays and modifies the network routing table.' },
    ],
    hard: [
      { prompt: 'In a TCP/IP network, what happens when a host sends a packet to a destination on a different subnet?', options: ['The packet is sent to the default gateway', 'The packet is broadcast to all hosts', 'The packet is dropped immediately', 'The host ARP requests the destination directly'], correctAnswer: 0, explanation: 'When the destination is on a different subnet, the packet is forwarded to the default gateway for routing.' },
      { prompt: 'What is the significance of the TTL field in an IP header?', options: ['Prevents infinite routing loops by limiting packet lifetime', 'Encrypts the packet payload', 'Determines the packet priority', 'Specifies the maximum segment size'], correctAnswer: 0, explanation: 'TTL (Time To Live) is decremented at each hop; when it reaches 0, the packet is discarded to prevent loops.' },
      { prompt: 'Which DNS record type maps a hostname to an IPv6 address?', options: ['AAAA', 'A', 'CNAME', 'MX'], correctAnswer: 0, explanation: 'AAAA (quad-A) records map hostnames to IPv6 addresses, while A records map to IPv4.' },
      { prompt: 'What is the purpose of TCP three-way handshake?', options: ['Establishes a reliable connection before data transfer', 'Encrypts data during transmission', 'Assigns IP addresses to hosts', 'Resolves domain names to IPs'], correctAnswer: 0, explanation: 'The three-way handshake (SYN, SYN-ACK, ACK) establishes a reliable TCP connection.' },
      { prompt: 'What happens when a switch receives a frame with an unknown destination MAC?', options: ['It floods the frame to all ports except the source', 'It drops the frame', 'It sends an ARP request', 'It buffers the frame until timeout'], correctAnswer: 0, explanation: 'Switches flood unknown unicast frames to all ports to ensure delivery.' },
    ],
  },

  'computer networks|socket programming': {
    easy: [
      { prompt: 'What is a socket in network programming?', options: ['An endpoint for communication between two processes', 'A type of firewall', 'A physical network connector', 'A DNS resolution tool'], correctAnswer: 0, explanation: 'A socket is a communication endpoint that enables inter-process communication over a network.' },
      { prompt: 'Which protocol is commonly used for reliable web communication?', options: ['TCP', 'UDP', 'ICMP', 'ARP'], correctAnswer: 0, explanation: 'TCP provides reliable, ordered delivery of data, making it ideal for web communication.' },
      { prompt: 'What does a server socket do?', options: ['Listens for and accepts incoming connections', 'Sends data to clients only', 'Resolves domain names', 'Encrypts network traffic'], correctAnswer: 0, explanation: 'A server socket listens on a specific port and accepts incoming client connections.' },
      { prompt: 'Which port is commonly used for HTTP?', options: ['80', '443', '22', '21'], correctAnswer: 0, explanation: 'HTTP uses port 80 by default; HTTPS uses port 443.' },
      { prompt: 'What is the difference between TCP and UDP?', options: ['TCP is reliable and ordered; UDP is fast but unreliable', 'UDP is reliable; TCP is fast', 'They are the same protocol', 'TCP uses less bandwidth'], correctAnswer: 0, explanation: 'TCP guarantees delivery and ordering; UDP is connectionless and faster but does not guarantee delivery.' },
    ],
    medium: [
      { prompt: 'In socket programming, what does bind() do?', options: ['Assigns a local address and port to a socket', 'Establishes a connection to a remote host', 'Sends data through the socket', 'Closes the socket connection'], correctAnswer: 0, explanation: 'bind() associates a socket with a specific IP address and port number.' },
      { prompt: 'What is the purpose of the listen() system call?', options: ['Marks the socket as passive and sets the backlog queue', 'Sends data to connected clients', 'Accepts incoming connections', 'Creates a new socket'], correctAnswer: 0, explanation: 'listen() marks a socket as passive (server) and specifies the maximum pending connection queue.' },
      { prompt: 'What does the accept() system call return?', options: ['A new socket file descriptor for the connected client', 'The client IP address only', 'The number of bytes received', 'The connection status code'], correctAnswer: 0, explanation: 'accept() creates a new socket specifically for communication with the connected client.' },
      { prompt: 'Which socket type is used for UDP communication?', options: ['SOCK_DGRAM', 'SOCK_STREAM', 'SOCK_RAW', 'SOCK_SEQPACKET'], correctAnswer: 0, explanation: 'SOCK_DGRAM is used for datagram (UDP) sockets; SOCK_STREAM is for TCP.' },
      { prompt: 'What is a blocking socket call?', options: ['A call that waits until the operation completes before returning', 'A call that immediately returns success', 'A call that sends data in the background', 'A call that only works on Linux'], correctAnswer: 0, explanation: 'Blocking calls pause execution until the operation (e.g., read, accept) completes or fails.' },
    ],
    hard: [
      { prompt: 'What is the purpose of the select() or poll() system calls?', options: ['Monitors multiple file descriptors for I/O readiness', 'Creates new socket connections', 'Encrypts data on multiple sockets', 'Resolves DNS for multiple hosts'], correctAnswer: 0, explanation: 'select()/poll() enable I/O multiplexing by monitoring multiple sockets for readability/writability.' },
      { prompt: 'In a non-blocking server, what is the common pattern for handling thousands of connections?', options: ['Event-driven I/O multiplexing (epoll/kqueue/select)', 'One thread per connection', 'Spawning a new process for each request', 'Using only UDP to avoid connection overhead'], correctAnswer: 0, explanation: 'Event-driven I/O multiplexing efficiently handles many connections without one thread per connection.' },
      { prompt: 'What is a socket option, and how is it set?', options: ['Configures socket behavior using setsockopt()', 'Defines the IP address of the socket', 'Sets the maximum data transfer rate', 'Creates a backup socket'], correctAnswer: 0, explanation: 'setsockopt() configures socket-level options like SO_REUSEADDR, SO_KEEPALIVE, etc.' },
      { prompt: 'What is the TIME_WAIT state in TCP?', options: ['State after connection close to ensure all packets are received', 'State while waiting for a SYN packet', 'State during data transfer', 'State when the server is overloaded'], correctAnswer: 0, explanation: 'TIME_WAIT ensures delayed packets from the old connection are discarded before reuse.' },
      { prompt: 'What is the purpose of SO_REUSEADDR socket option?', options: ['Allows reusing a port in TIME_WAIT state immediately', 'Enables address sharing across processes', 'Forces all connections to use the same port', 'Disables TCP keepalive'], correctAnswer: 0, explanation: 'SO_REUSEADDR allows binding to a port that is in TIME_WAIT state, useful for server restarts.' },
    ],
  },

  // ─── OPERATING SYSTEMS ───
  'operating systems|process management': {
    easy: [
      { prompt: 'What is a process in operating systems?', options: ['A program in execution', 'A stored file on disk', 'A type of memory', 'A network connection'], correctAnswer: 0, explanation: 'A process is an instance of a program that is being executed, including its current state.' },
      { prompt: 'What is the difference between a process and a thread?', options: ['A thread is a lightweight process within a process', 'A process is faster than a thread', 'They are the same thing', 'A thread runs on a different computer'], correctAnswer: 0, explanation: 'Threads share the same address space within a process and are lighter than separate processes.' },
      { prompt: 'What is a context switch?', options: ['Saving and restoring the state of a process when switching CPU', 'Switching between network connections', 'Changing the display resolution', 'Loading a new program into memory'], correctAnswer: 0, explanation: 'A context switch saves the current process state and restores another process state on the CPU.' },
      { prompt: 'Which scheduling algorithm gives each process an equal time slice?', options: ['Round Robin', 'First Come First Serve', 'Shortest Job First', 'Priority Scheduling'], correctAnswer: 0, explanation: 'Round Robin assigns a fixed time quantum to each process in a cyclic order.' },
      { prompt: 'What is a process control block (PCB)?', options: ['Data structure storing information about a process', 'A hardware component for process execution', 'A type of memory allocation', 'A file system structure'], correctAnswer: 0, explanation: 'The PCB contains process state, program counter, registers, and scheduling information.' },
    ],
    medium: [
      { prompt: 'What is a race condition in process synchronization?', options: ['When output depends on the timing of uncontrollable events', 'When two processes run on different CPUs', 'When a process runs faster than expected', 'When memory is exhausted'], correctAnswer: 0, explanation: 'Race conditions occur when the outcome depends on the relative timing of processes accessing shared resources.' },
      { prompt: 'What is a deadlock in operating systems?', options: ['A situation where processes are permanently blocked waiting for resources', 'When a process runs infinitely', 'When the CPU overheats', 'When memory is fully utilized'], correctAnswer: 0, explanation: 'Deadlock occurs when four conditions hold: mutual exclusion, hold and wait, no preemption, and circular wait.' },
      { prompt: 'What is the purpose of a semaphore?', options: ['Controls access to shared resources through signaling', 'Allocates memory for processes', 'Schedules process execution', 'Handles network communication'], correctAnswer: 0, explanation: 'Semaphores use wait (P) and signal (V) operations to control access to shared resources.' },
      { prompt: 'What is virtual memory?', options: ['An abstraction that gives each process its own address space', 'RAM installed on the motherboard', 'A type of cache memory', 'External storage for backup'], correctAnswer: 0, explanation: 'Virtual memory maps logical addresses to physical addresses, enabling memory isolation and overcommitment.' },
      { prompt: 'What is the role of the MMU (Memory Management Unit)?', options: ['Translates virtual addresses to physical addresses', 'Manages disk I/O operations', 'Controls network packet routing', 'Executes arithmetic instructions'], correctAnswer: 0, explanation: 'The MMU handles virtual-to-physical address translation using page tables.' },
    ],
    hard: [
      { prompt: 'What is the convoy effect in CPU scheduling?', options: ['Short processes wait behind one long process in FCFS scheduling', 'All processes execute simultaneously', 'The CPU switches between processes too quickly', 'Processes are arranged by priority'], correctAnswer: 0, explanation: 'In FCFS, a single long process blocks many short processes, reducing CPU and device utilization.' },
      { prompt: 'What is the dining philosophers problem?', options: ['A classic synchronization problem with resource allocation', 'A deadlock detection algorithm', 'A memory management technique', 'A disk scheduling algorithm'], correctAnswer: 0, explanation: 'It illustrates deadlock and resource allocation with philosophers sharing chopsticks (resources).' },
      { prompt: 'What is copy-on-write (COW) in process creation?', options: ['Parent and child share pages until one writes, then a copy is made', 'All memory is copied immediately on fork()', 'Pages are written to disk before sharing', 'Only the code segment is shared'], correctAnswer: 0, explanation: 'COW delays copying until a write operation, improving fork() performance significantly.' },
      { prompt: 'What is the banker\'s algorithm used for?', options: ['Deadlock avoidance by checking safe states', 'Deadlock detection after occurrence', 'Process scheduling on multiple CPUs', 'Memory fragmentation prevention'], correctAnswer: 0, explanation: 'The banker\'s algorithm prevents deadlock by ensuring the system stays in a safe state.' },
      { prompt: 'What is the difference between internal and external fragmentation?', options: ['Internal wastes space within allocated blocks; external wastes free space between blocks', 'Internal is in RAM; external is on disk', 'They are the same concept', 'Internal affects processes; external affects files'], correctAnswer: 0, explanation: 'Internal fragmentation occurs when allocated memory is larger than needed; external when free memory is scattered.' },
    ],
  },

  // ─── DATA STRUCTURES ───
  'data structures|arrays and linked lists': {
    easy: [
      { prompt: 'What is the time complexity of accessing an element in an array by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'Arrays provide constant-time access because elements are stored contiguously in memory.' },
      { prompt: 'What is a linked list?', options: ['A data structure where elements are connected by pointers', 'A type of array with fixed size', 'A tree with two children per node', 'A hash table with chaining'], correctAnswer: 0, explanation: 'A linked list consists of nodes where each node contains data and a pointer to the next node.' },
      { prompt: 'What is the disadvantage of an array compared to a linked list?', options: ['Fixed size (in static arrays)', 'Slower access by index', 'Uses more memory per element', 'Cannot store different data types'], correctAnswer: 0, explanation: 'Static arrays have a fixed size determined at compile time, unlike linked lists which grow dynamically.' },
      { prompt: 'In a singly linked list, how do you traverse from head to tail?', options: ['Follow next pointers from each node', 'Use index-based access', 'Jump directly to the last node', 'Use binary search'], correctAnswer: 0, explanation: 'Singly linked lists only support sequential access by following next pointers.' },
      { prompt: 'What does the head pointer in a linked list point to?', options: ['The first node in the list', 'The last node in the list', 'The middle node', 'The empty list'], correctAnswer: 0, explanation: 'The head pointer references the first node, which is the entry point for traversal.' },
    ],
    medium: [
      { prompt: 'What is the time complexity of inserting at the beginning of a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'Inserting at the head of a linked list only requires updating a few pointers, which is O(1).' },
      { prompt: 'What is a circular linked list?', options: ['A linked list where the last node points back to the first node', 'A linked list arranged in a circle physically', 'A linked list that wraps around array indices', 'A doubly linked list'], correctAnswer: 0, explanation: 'In a circular linked list, the last node\'s next pointer references the head node.' },
      { prompt: 'What is the main advantage of a doubly linked list over a singly linked list?', options: ['Bidirectional traversal', 'Less memory usage', 'Faster random access', 'Simpler implementation'], correctAnswer: 0, explanation: 'Doubly linked lists have both next and prev pointers, allowing traversal in both directions.' },
      { prompt: 'How do you detect a cycle in a linked list?', options: ['Floyd\'s cycle detection algorithm (slow and fast pointers)', 'Counting the number of nodes', 'Using binary search', 'Checking if the list is sorted'], correctAnswer: 0, explanation: 'Floyd\'s algorithm uses a slow pointer (1 step) and fast pointer (2 steps); they meet if a cycle exists.' },
      { prompt: 'What is the space complexity of an array with n elements?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'An array stores exactly n elements, requiring O(n) space.' },
    ],
    hard: [
      { prompt: 'What is the time complexity of reversing a singly linked list in-place?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correctAnswer: 0, explanation: 'Reversing requires visiting each node once to redirect pointers, which is O(n).' },
      { prompt: 'What is a skip list?', options: ['A probabilistic data structure that allows O(log n) search in a sorted linked list', 'A linked list with random deletion', 'A type of array with gaps', 'A binary tree implemented with arrays'], correctAnswer: 0, explanation: 'Skip lists add multiple levels of pointers to enable faster search, similar to balanced trees.' },
      { prompt: 'How can you merge two sorted linked lists into one sorted list?', options: ['Compare heads and append the smaller node, repeat until both are exhausted', 'Concatenate and re-sort', 'Interleave nodes alternately', 'Use binary search to find insertion points'], correctAnswer: 0, explanation: 'The merge operation compares front nodes and appends the smaller one, achieving O(n+m) time.' },
      { prompt: 'What is the Josephus problem?', options: ['A circle elimination problem solvable with circular linked lists', 'A sorting algorithm comparison', 'A graph traversal problem', 'A hash collision resolution method'], correctAnswer: 0, explanation: 'The Josephus problem involves eliminating every k-th person in a circle until one remains.' },
      { prompt: 'What is the difference between a dynamic array and a linked list for frequent insertions in the middle?', options: ['Linked list is O(1) for insertion; dynamic array is O(n) for shifting', 'Dynamic array is always faster', 'They have identical performance', 'Linked list uses less memory for the same data'], correctAnswer: 0, explanation: 'Linked lists allow O(1) insertion if you have the position; arrays require shifting elements O(n).' },
    ],
  },

  // ─── DATABASE MANAGEMENT SYSTEMS ───
  'database management systems|sql fundamentals': {
    easy: [
      { prompt: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Logic', 'Standard Question Language', 'System Query Lookup'], correctAnswer: 0, explanation: 'SQL (Structured Query Language) is the standard language for managing relational databases.' },
      { prompt: 'Which SQL command is used to retrieve data from a database?', options: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], correctAnswer: 0, explanation: 'SELECT is used to query and retrieve data from database tables.' },
      { prompt: 'What does the WHERE clause do in SQL?', options: ['Filters rows based on a condition', 'Groups rows together', 'Sorts the result set', 'Limits the number of rows returned'], correctAnswer: 0, explanation: 'WHERE filters rows that match the specified condition before grouping or ordering.' },
      { prompt: 'Which command is used to add new records to a table?', options: ['INSERT INTO', 'ADD RECORD', 'UPDATE', 'CREATE'], correctAnswer: 0, explanation: 'INSERT INTO adds new rows of data into a specified table.' },
      { prompt: 'What is a primary key?', options: ['A unique identifier for each record in a table', 'A field that can contain NULL values', 'A field used only for sorting', 'A foreign reference to another table'], correctAnswer: 0, explanation: 'A primary key uniquely identifies each record and cannot contain NULL values.' },
    ],
    medium: [
      { prompt: 'What is the difference between WHERE and HAVING?', options: ['WHERE filters rows before grouping; HAVING filters after grouping', 'HAVING is faster than WHERE', 'WHERE is for numbers; HAVING is for text', 'They are interchangeable'], correctAnswer: 0, explanation: 'WHERE applies to individual rows before GROUP BY; HAVING applies to grouped results after aggregation.' },
      { prompt: 'What is a foreign key?', options: ['A column that references the primary key of another table', 'A key used to encrypt data', 'A duplicate primary key', 'An index for fast searching'], correctAnswer: 0, explanation: 'A foreign key establishes a relationship between two tables by referencing the primary key of another table.' },
      { prompt: 'What does the JOIN clause do?', options: ['Combines rows from two or more tables based on a related column', 'Creates a new table', 'Deletes duplicate rows', 'Merges two databases'], correctAnswer: 0, explanation: 'JOIN combines rows from multiple tables where the join condition is met.' },
      { prompt: 'What is an index in a database?', options: ['A data structure that improves the speed of data retrieval', 'A copy of the table data', 'A constraint on column values', 'A type of join operation'], correctAnswer: 0, explanation: 'Indexes create a data structure (like B-tree) that allows faster lookups without scanning the entire table.' },
      { prompt: 'What is the difference between INNER JOIN and LEFT JOIN?', options: ['INNER JOIN returns only matching rows; LEFT JOIN returns all rows from the left table', 'LEFT JOIN is faster', 'INNER JOIN returns more rows', 'They produce identical results'], correctAnswer: 0, explanation: 'INNER JOIN returns rows with matches in both tables; LEFT JOIN returns all left rows with NULLs for non-matching right rows.' },
    ],
    hard: [
      { prompt: 'What is a transaction in a database?', options: ['A logical unit of work that is atomic, consistent, isolated, and durable', 'A single SQL statement', 'A backup operation', 'A user login session'], correctAnswer: 0, explanation: 'Transactions follow ACID properties: Atomicity, Consistency, Isolation, Durability.' },
      { prompt: 'What is the difference between a clustered and non-clustered index?', options: ['Clustered determines physical row order; non-clustered creates a separate lookup structure', 'Non-clustered is always faster', 'Clustered uses more disk space', 'They are the same thing'], correctAnswer: 0, explanation: 'A clustered index sorts the table data physically; a non-clustered index creates a separate structure with pointers.' },
      { prompt: 'What is a deadlock in a database?', options: ['Two transactions waiting for each other to release locks', 'A query that runs too slowly', 'A table with no primary key', 'A failed backup operation'], correctAnswer: 0, explanation: 'Database deadlock occurs when two transactions hold locks that the other needs, creating a circular wait.' },
      { prompt: 'What is normalization in database design?', options: ['Organizing data to reduce redundancy and improve integrity', 'Adding more columns to a table', 'Creating backup copies of data', 'Sorting data for faster queries'], correctAnswer: 0, explanation: 'Normalization decomposes tables to eliminate redundancy, following normal forms (1NF, 2NF, 3NF, BCNF).' },
      { prompt: 'What is the CAP theorem?', options: ['A distributed system can guarantee only 2 of 3: Consistency, Availability, Partition tolerance', 'All databases must be consistent and available', 'A database can have at most 3 replicas', 'Transactions can only last 3 seconds'], correctAnswer: 0, explanation: 'CAP theorem states a distributed system cannot simultaneously provide consistency, availability, and partition tolerance.' },
    ],
  },

  // ─── JAVA PROGRAMMING ───
  'java|object oriented programming': {
    easy: [
      { prompt: 'What is a class in Java?', options: ['A blueprint for creating objects', 'An instance of an object', 'A primitive data type', 'A method for input/output'], correctAnswer: 0, explanation: 'A class is a template that defines the properties and behaviors of objects.' },
      { prompt: 'What is the main method signature in Java?', options: ['public static void main(String[] args)', 'public void main(String args)', 'static void main()', 'void main(String[] args)'], correctAnswer: 0, explanation: 'The JVM looks for this exact signature as the entry point of a Java application.' },
      { prompt: 'What does the keyword "new" do in Java?', options: ['Creates a new object instance', 'Declares a new variable', 'Imports a new package', 'Defines a new method'], correctAnswer: 0, explanation: 'The "new" keyword allocates memory and creates a new instance of a class.' },
      { prompt: 'What is inheritance in Java?', options: ['A mechanism where a class acquires properties of another class', 'Creating multiple objects', 'Defining abstract methods', 'Managing memory allocation'], correctAnswer: 0, explanation: 'Inheritance allows a subclass to inherit fields and methods from a superclass using "extends".' },
      { prompt: 'What is the difference between == and .equals() in Java?', options: ['== compares references; .equals() compares content', 'They are identical', '== is faster', '.equals() is for primitives only'], correctAnswer: 0, explanation: '== checks if two references point to the same object; .equals() checks value equivalence.' },
    ],
    medium: [
      { prompt: 'What is polymorphism in Java?', options: ['The ability of an object to take many forms through method overriding/overloading', 'Having multiple constructors', 'Defining static methods', 'Using final classes'], correctAnswer: 0, explanation: 'Polymorphism allows a single reference type to represent different actual types at runtime.' },
      { prompt: 'What is an interface in Java?', options: ['A contract that defines methods a class must implement', 'A concrete class with all methods implemented', 'A type of variable', 'A memory management unit'], correctAnswer: 0, explanation: 'An interface defines abstract methods that implementing classes must provide.' },
      { prompt: 'What is the difference between an abstract class and an interface?', options: ['Abstract class can have constructors and state; interface cannot (pre-Java 8)', 'Interfaces are always faster', 'Abstract classes cannot have methods', 'They are identical'], correctAnswer: 0, explanation: 'Abstract classes can have instance variables and constructors; interfaces traditionally only had abstract methods.' },
      { prompt: 'What is exception handling in Java?', options: ['A mechanism to handle runtime errors gracefully', 'A way to debug code', 'A method for memory management', 'A type of loop control'], correctAnswer: 0, explanation: 'Java uses try-catch-finally blocks to handle exceptions and prevent program crashes.' },
      { prompt: 'What is the difference between checked and unchecked exceptions?', options: ['Checked must be declared; unchecked are runtime errors', 'Unchecked must be declared', 'They are the same', 'Checked only occur at compile time'], correctAnswer: 0, explanation: 'Checked exceptions must be caught or declared; unchecked (RuntimeException) can be ignored.' },
    ],
    hard: [
      { prompt: 'What is the Java Memory Model (JMM)?', options: ['Defines how threads interact through memory and what behaviors are allowed in concurrent code', 'A specification for RAM sizing', 'A garbage collection algorithm', 'A network protocol for Java'], correctAnswer: 0, explanation: 'JMM defines happens-before relationships and visibility rules for shared variables across threads.' },
      { prompt: 'What is the difference between HashMap and ConcurrentHashMap?', options: ['ConcurrentHashMap is thread-safe; HashMap is not', 'HashMap is faster in all cases', 'ConcurrentHashMap allows null keys', 'They are identical'], correctAnswer: 0, explanation: 'ConcurrentHashMap uses segment locking for thread safety; HashMap is not synchronized.' },
      { prompt: 'What is the purpose of the volatile keyword?', options: ['Ensures a variable is always read from and written to main memory', 'Makes a variable constant', 'Prevents garbage collection', 'Marks a variable as deprecated'], correctAnswer: 0, explanation: 'volatile ensures visibility of changes across threads by bypassing thread-local caches.' },
      { prompt: 'What is the difference between serialization and deserialization?', options: ['Serialization converts objects to byte streams; deserialization reconstructs them', 'They are the same process', 'Serialization compresses data', 'Deserialization encrypts data'], correctAnswer: 0, explanation: 'Serialization converts objects to a byte format for storage/transmission; deserialization reverses it.' },
      { prompt: 'What is a Weak Reference in Java?', options: ['A reference that does not prevent garbage collection of the referenced object', 'A reference to a weakly typed object', 'A deprecated reference type', 'A reference with lower priority'], correctAnswer: 0, explanation: 'Weak references allow the GC to collect the object even if the reference exists, useful for caches.' },
    ],
  },
}

/**
 * Get all available pre-generated subject|topic combinations.
 */
export function getPreGeneratedTopics() {
  return Object.keys(preGeneratedQuestions).map(key => {
    const [subject, topic] = key.split('|')
    const difficulties = Object.keys(preGeneratedQuestions[key])
    const questionCounts = {}
    for (const diff of difficulties) {
      questionCounts[diff] = preGeneratedQuestions[key][diff].length
    }
    return { subject, topic, difficulties, questionCounts }
  })
}
