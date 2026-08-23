# Computer Networks Study Notes - OSI Model

## The 7 Layers of OSI Model

### Layer 7: Application Layer
- HTTP, HTTPS, FTP, SMTP, DNS
- Direct interface with user applications

### Layer 6: Presentation Layer
- Data translation, encryption, compression
- SSL/TLS encryption happens here

### Layer 5: Session Layer
- Manages sessions between applications
- Establishes, maintains, terminates connections

### Layer 4: Transport Layer
- TCP (reliable, connection-oriented)
- UDP (unreliable, connectionless)
- Port numbers, segmentation, flow control

### Layer 3: Network Layer
- IP addressing and routing
- Routers operate at this layer
- Protocols: IP, ICMP, OSPF

### Layer 2: Data Link Layer
- Frame formatting, error detection
- MAC addressing
- Switches operate at this layer
- Protocols: Ethernet, PPP, ARP

### Layer 1: Physical Layer
- Bit transmission over physical medium
- Cables, connectors, signal encoding
- Hubs operate at this layer

## Data Encapsulation
- Application Data → Segment (Transport) → Packet (Network) → Frame (Data Link) → Bits (Physical)

## Key Differences
- TCP vs UDP: Reliability vs Speed
- Switch vs Router: MAC vs IP addresses
- Hub vs Switch: Broadcast vs Intelligent forwarding
