
import React from 'react';
import { Project, BlogPost, Service } from './types';

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Mobile App Development',
    description: 'Bespoke iOS and Android solutions built with Flutter and React Native for seamless performance.',
    icon: '📱'
  },
  {
    id: '2',
    title: 'Custom Web Platforms',
    description: 'Scalable, secure, and fast web applications using the latest React and Node.js ecosystems.',
    icon: '🌐'
  },
  {
    id: '3',
    title: 'AI & Machine Learning',
    description: 'Integrating intelligent features into your products using Gemini and LLM frameworks.',
    icon: '🧠'
  },
  {
    id: '4',
    title: 'UI/UX Strategy',
    description: 'Human-centric design that converts. We focus on accessibility and modern aesthetics.',
    icon: '🎨'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'FinStream Dashboard',
    category: 'Web Application',
    description: 'A real-time financial monitoring tool for enterprise crypto assets and high-frequency trading analytics.',
    image: 'https://picsum.photos/seed/finstream/800/600',
    tags: ['React 19', 'D3.js', 'Tailwind', 'WebSockets', 'AWS'],
    client: 'FinStream Capital Global',
    year: '2024',
    timeline: '4 Months of Execution',
    role: 'Full-Cycle Systems Architecture & Design',
    status: 'Live in Production',
    heroSubtitle: 'Sub-15ms real-time telemetry, institutional order book heatmaps, and automated risk thresholds across 12 tier-1 exchange feeds.',
    overview: 'FinStream Dashboard was built for institutional traders who handle billions in daily transactional volume. Previous vendor solutions suffered from erratic UI frame drops during periods of extreme market volatility. Yuvex Tech engineered a dedicated zero-copy WebGL/Canvas rendering pipeline paired with binary WebSocket feeds to deliver fluid 60FPS charting and instantaneous order execution under peak load.',
    challenge: {
      summary: 'Institutional traders were losing execution speed due to browser thread bottlenecks and DOM rendering latency exceeding 450ms during high-volume spikes.',
      points: [
        'Handling 40,000+ incoming trade ticks per second without triggering React garbage collection stutter.',
        'Zero tolerance for inaccurate price tick aggregation across desynchronized global liquidity pools.',
        'Strict institutional compliance: audit trails, role-based key rotation, and SOC2 financial controls.'
      ]
    },
    solution: {
      summary: 'We constructed an off-thread Web Worker architecture to ingest, parse, and buffer binary tick data before sending batch visual diffs to an accelerated Canvas chart engine.',
      highlights: [
        'Worker-driven data pipeline reducing main UI thread utilization by 82%.',
        'Hardware-accelerated D3 and HTML5 Canvas renderer maintaining locked 60FPS.',
        'Edge WebSocket proxy layer deployed across 18 AWS edge locations worldwide.'
      ]
    },
    architecture: {
      frontend: [
        'React 19 with Concurrent Rendering & Fine-grained Memoization',
        'Custom WebGL/Canvas high-frequency order book renderer',
        'Tailwind CSS v4 with dark mode optimized for trading terminals',
        'Off-thread Web Workers for high-throughput Protobuf deserialization'
      ],
      backend: [
        'Node.js & Rust microservices for tick normalization',
        'Redis Cluster for sub-millisecond in-memory order caching',
        'TimescaleDB for petabyte-scale historical tick time-series storage',
        'Kafka multi-broker cluster for immutable event streaming'
      ],
      cloudInfrastructure: [
        'AWS ECS Fargate with auto-scaling based on market volatility index',
        'Cloudflare Enterprise with custom TCP/WebSocket routing',
        'Terraform modular infrastructure with automated staging parity'
      ],
      securityAndCompliance: [
        'Hardware Security Module (HSM) signing key isolation',
        'TLS 1.3 with automated zero-downtime certificate rotation',
        'Comprehensive immutable audit logging stored in S3 Glacier'
      ],
      diagramSteps: [
        { step: '01', name: 'Ingestion Gateway', desc: '12 Tier-1 exchange feeds ingested via raw binary streams', icon: '⚡', latency: '< 3ms' },
        { step: '02', name: 'Normalization & Redis', desc: 'Tick validation, deduplication, and order book depth construction', icon: '🔄', latency: '< 5ms' },
        { step: '03', name: 'Edge WebSocket Hub', desc: 'Distributed edge brokers broadcasting diffs to connected terminals', icon: '🌐', latency: '< 8ms' },
        { step: '04', name: 'Client WebGL Stage', desc: 'Off-thread Web Worker updates Canvas buffer without DOM thrashing', icon: '🖥️', latency: '< 2ms' }
      ]
    },
    features: [
      {
        title: 'Microsecond Depth Heatmap',
        description: 'Dynamic order book liquidity depth visualizer rendering 200 price levels with color-coded volumetric pressure.',
        icon: '📊',
        impact: '10x faster market depth scanning'
      },
      {
        title: 'Algorithmic Execution Slicing',
        description: 'Automated TWAP/VWAP execution sliders with real-time slippage estimations and multi-exchange routing.',
        icon: '⚡',
        impact: '32% slippage reduction'
      },
      {
        title: 'Instant Risk Breach Circuit',
        description: 'Configurable automated stop-loss and collateral ratio circuit breakers triggered in under 10ms.',
        icon: '🛡️',
        impact: '100% loss containment guarantee'
      },
      {
        title: 'Multi-Terminal Workspace',
        description: 'Detachable workspace panes with multi-monitor memory sync and custom hotkey bindings.',
        icon: '💻',
        impact: 'Saved 45 min/day per trader'
      }
    ],
    metrics: [
      { value: '99.99%', label: 'System Uptime', change: '+0.09%', description: 'Zero unscheduled downtime through 3 flash crashes' },
      { value: '< 15ms', label: 'End-to-End Latency', change: '-88%', description: 'P99 latency down from 125ms to sub-15ms' },
      { value: '$2.4B+', label: 'Daily Trading Vol', change: '+140%', description: 'Processed daily across 45 institutional desks' },
      { value: '60 FPS', label: 'Frame Stability', change: 'Steady', description: 'Locked smooth rendering during peak book depth' }
    ],
    benchmarks: [
      { metric: 'Initial Page & Chart Load', before: '3.8s', after: '240ms', improvement: '93% Faster' },
      { metric: 'Main Thread Memory Consumption', before: '420 MB', after: '78 MB', improvement: '81% Reduction' },
      { metric: 'UI Lag during High Volatility', before: '840ms', after: '< 12ms', improvement: '98% Reduction' },
      { metric: 'Client Crash / Drop Rate', before: '1.4%', after: '0.002%', improvement: '99.8% Reliability' }
    ],
    codeSnippet: {
      title: 'offthread-worker.ts (Binary Tick Decompression & Stream Batcher)',
      language: 'typescript',
      code: `// Yuvex High-Performance Binary Protocol Decoder
const bufferPool = new ArrayBufferPool(64 * 1024);

self.onmessage = (event: MessageEvent<ArrayBuffer>) => {
  const view = new DataView(event.data);
  const messageType = view.getUint8(0);
  
  if (messageType === 0x4F) { // ORDER_BOOK_DIFF
    const sequenceId = view.getBigUint64(1, true);
    const bidsCount = view.getUint16(9, true);
    const asksCount = view.getUint16(11, true);
    
    const depthDiff = parseBinaryDepth(view, 13, bidsCount, asksCount);
    
    // Transfer buffer without serialization copy
    self.postMessage({ type: 'RENDER_DIFF', sequenceId, depthDiff }, [depthDiff.buffer]);
  }
};`
    },
    gallery: [
      { url: 'https://picsum.photos/seed/finstream-screen1/900/600', caption: 'High-density multi-exchange order book visualization terminal' },
      { url: 'https://picsum.photos/seed/finstream-screen2/900/600', caption: 'Algorithmic TWAP execution route builder with real-time slippage' },
      { url: 'https://picsum.photos/seed/finstream-screen3/900/600', caption: 'Institutional multi-asset portfolio balance and leverage tracker' }
    ],
    deliverables: [
      'Institutional Web Trader Portal (React 19 + Canvas)',
      'Sub-15ms WebSocket Gateway with Binary Protobuf Support',
      'TimescaleDB Time-Series Archival Pipeline',
      'Automated Disaster Recovery & Blue-Green Ingress',
      'Security Audit Documentation & SOC2 Type II Attestation',
      'End-to-End Cypress Integration & Chaos Engineering Suite'
    ],
    testimonial: {
      quote: "Yuvex Tech did what three previous tier-1 consultancies told us was impossible: running institutional-grade algorithmic charts at 60FPS in standard browsers without crashing client machines.",
      author: 'Marcus Vance',
      role: 'Chief Technology Officer',
      company: 'FinStream Capital Global',
      avatar: 'https://i.pravatar.cc/150?u=marcus_cto'
    }
  },
  {
    id: 'p2',
    title: 'HealthSync Pro',
    category: 'Mobile App',
    description: 'Connecting patients with healthcare providers through intelligent AI triage and secure telehealth consultations.',
    image: 'https://picsum.photos/seed/healthsync/800/600',
    tags: ['Flutter', 'Firebase', 'Gemini AI', 'WebRTC', 'HIPAA'],
    client: 'HealthSync Medical Alliance',
    year: '2024',
    timeline: '5 Months of Execution',
    role: 'Cross-Platform Mobile Engineering & Compliance',
    status: 'Live on iOS & Android',
    heroSubtitle: 'HIPAA-compliant telemedicine app supporting 250,000+ active patients with sub-second biometric sync and AI symptom triage.',
    overview: 'HealthSync Pro needed to modernize outpatient care for a network of 48 regional clinics. The primary obstacle was fragmented communication between patients, physicians, and wearable medical sensors. Yuvex Tech architected an end-to-end encrypted mobile platform that integrates native HealthKit/Google Fit streaming, HD WebRTC video visits, and an intelligent medical triage assistant powered by Gemini.',
    challenge: {
      summary: 'Healthcare providers spent an average of 18 minutes per patient on manual intake notes, resulting in physician burnout and appointment backlogs.',
      points: [
        'Strict regulatory HIPAA and HITECH compliance across all video, chat, and sensor data pipelines.',
        'Real-time biometric data streaming from Apple Watch and Wear OS devices with offline caching.',
        'Creating an ultra-accessible UI tailored for elderly and non-technical patients with motor impairments.'
      ]
    },
    solution: {
      summary: 'We developed an intuitive cross-platform Flutter experience backed by peer-to-peer WebRTC video with AI-assisted clinical note generation and automatic EHR synchronization.',
      highlights: [
        'Secure Gemini-powered clinical intake pre-screening saving 12 minutes per consultation.',
        'Zero-knowledge encryption for all patient health records and recorded vitals.',
        'Sub-second WebRTC peer connection time with automatic fallbacks for poor cellular connections.'
      ]
    },
    architecture: {
      frontend: [
        'Flutter 3.x cross-platform engine with native platform channels',
        'WebRTC P2P mesh video calling with adaptive bitrate management',
        'Native Apple HealthKit and Android Health Connect telemetry bridge',
        'WCAG 2.1 AAA accessible UI with dynamic font scaling and high contrast'
      ],
      backend: [
        'Firebase Cloud Functions & Google Cloud Run microservices',
        'HIPAA-compliant Google Cloud Healthcare API & FHIR store',
        'Gemini 1.5 Pro pipeline for clinical pre-consultation summaries',
        'Twilio Video WebRTC turn relay servers across global zones'
      ],
      cloudInfrastructure: [
        'Google Cloud Platform with BAA (Business Associate Agreement)',
        'Cloud Armor DDoS protection and Web Application Firewall',
        'Automated HIPAA compliance auditing and continuous log scrubbing'
      ],
      securityAndCompliance: [
        'AES-256 at rest and TLS 1.3 in transit with end-to-end consultation keys',
        'Biometric authentication (FaceID, TouchID, Android Biometrics)',
        'Zero-knowledge audit trails adhering to HIPAA & GDPR requirements'
      ],
      diagramSteps: [
        { step: '01', name: 'Patient Vitals Sync', desc: 'Bluetooth/HealthKit biometric data gathered securely on device', icon: '💓', latency: '< 50ms' },
        { step: '02', name: 'AI Symptom Triage', desc: 'Gemini analyzes reported symptoms against medical triage protocols', icon: '🧠', latency: '< 400ms' },
        { step: '03', name: 'EHR Secure Vault', desc: 'Data encrypted and committed to FHIR HL7 compliant medical records', icon: '🔒', latency: '< 80ms' },
        { step: '04', name: 'Doctor Consultation', desc: 'Ultra-low latency HD WebRTC video call with live vitals display', icon: '👨‍⚕️', latency: '< 30ms' }
      ]
    },
    features: [
      {
        title: 'Gemini Medical Intake Triage',
        description: 'Conversational assistant that gently gathers patient symptoms and prepares structured clinical summaries for doctors before the call.',
        icon: '🩺',
        impact: 'Cut doctor note-taking by 65%'
      },
      {
        title: 'Live Vitals Telemetry During Video',
        description: 'Physicians see real-time pulse, SpO2, and blood pressure graphs directly overlaid during the telehealth video call.',
        icon: '📈',
        impact: '98% diagnostic accuracy'
      },
      {
        title: 'Smart Prescription Delivery',
        description: 'One-tap prescription authorization sent instantly to over 15,000 partner pharmacies with delivery tracking.',
        icon: '💊',
        impact: 'Same-day fulfillment rate: 94%'
      },
      {
        title: 'Accessibility First Mode',
        description: 'High-contrast visual mode, text-to-speech navigation, and ultra-large tap targets for seniors and low-vision users.',
        icon: '♿',
        impact: 'Senior retention rate: 89%'
      }
    ],
    metrics: [
      { value: '250K+', label: 'Active Patients', change: '+320%', description: 'Onboarded across 48 healthcare clinics' },
      { value: '4.9 ★', label: 'App Store Rating', change: '42K reviews', description: 'Consistently ranked top 10 in Medical category' },
      { value: '12 min', label: 'Saved Per Consultation', change: '-60%', description: 'Physicians see 3 more patients daily' },
      { value: '99.98%', label: 'Consultation Success', change: 'High', description: 'Zero dropped video calls over poor LTE' }
    ],
    benchmarks: [
      { metric: 'Intake Questionnaire Time', before: '14 mins', after: '3.5 mins', improvement: '75% Faster' },
      { metric: 'Video Call Connection Time', before: '4.2s', after: '0.8s', improvement: '80% Faster' },
      { metric: 'Patient No-Show Rate', before: '22%', after: '4.8%', improvement: '78% Reduction' },
      { metric: 'Physician Documentation Overhead', before: '18 mins', after: '4 mins', improvement: '77% Saved' }
    ],
    codeSnippet: {
      title: 'fhir-telemetry-stream.dart (HealthKit & WebRTC Sync)',
      language: 'dart',
      code: `// Encrypted Real-Time Patient Sensor Pipeline
class PatientTelemetryChannel {
  final WebRTCConnection _peerConnection;
  final SecureFHIRVault _vault;

  Future<void> streamBiometrics(SensorData tick) async {
    final encryptedPayload = await _vault.encryptPayload(tick.toJson());
    
    // Broadcast via WebRTC data channel during video consultation
    _peerConnection.sendDataChannelMessage('vitals', encryptedPayload);
    
    // Asynchronously log to HIPAA-compliant audit vault
    await _vault.commitFHIRRecord(encryptedPayload);
  }
}`
    },
    gallery: [
      { url: 'https://picsum.photos/seed/healthsync-screen1/900/600', caption: 'Patient dashboard showing health summary and upcoming visits' },
      { url: 'https://picsum.photos/seed/healthsync-screen2/900/600', caption: 'Physician telehealth consultation interface with live sensor telemetry' },
      { url: 'https://picsum.photos/seed/healthsync-screen3/900/600', caption: 'Gemini-assisted symptom assessment and prescription delivery flow' }
    ],
    deliverables: [
      'Native iOS App (App Store Production Ready)',
      'Native Android App (Google Play Production Ready)',
      'HIPAA / HITECH Compliance Technical Audit Documentation',
      'WebRTC Video Teleconsultation Infrastructure',
      'FHIR HL7 Electronic Health Record Integration Bridge',
      'Automated Doctor Clinical Summary Generator'
    ],
    testimonial: {
      quote: "HealthSync Pro transformed our entire clinical workflow. Our physicians save hours of administrative agony every single day, and our patients genuinely love using the app.",
      author: 'Dr. Rebecca Aris',
      role: 'Chief Medical Officer',
      company: 'HealthSync Medical Alliance',
      avatar: 'https://i.pravatar.cc/150?u=rebecca_cmo'
    }
  },
  {
    id: 'p3',
    title: 'E-Shop Genesis',
    category: 'E-Commerce',
    description: 'High-conversion headless commerce platform with global edge delivery and AI-driven personalization.',
    image: 'https://picsum.photos/seed/eshop/800/600',
    tags: ['Next.js', 'Shopify Plus', 'Stripe', 'Algolia', 'Edge CDN'],
    client: 'Genesis Luxury Retailers',
    year: '2024',
    timeline: '3.5 Months of Execution',
    role: 'Headless Commerce Architecture & Conversion Engineering',
    status: 'Live in Production',
    heroSubtitle: 'Headless commerce ecosystem operating across 42 global regions with sub-second catalog lookups and a 38% conversion increase.',
    overview: 'Genesis Luxury Retailers required a total overhaul of their legacy monolithic store. High cart abandonment rates were caused by slow page transitions, clumsy international currency conversions, and rigid promotional landing pages. Yuvex Tech migrated the brand to a headless Next.js architecture connected to Shopify Plus and Stripe Global, delivering lightning-fast client-side navigation and customized localized storefronts.',
    challenge: {
      summary: 'Legacy monolith took 4.5 seconds to render product detail pages, causing a 68% mobile cart abandonment rate during holiday flash sales.',
      points: [
        'Slow global catalog queries failing to reflect dynamic inventory across 14 international warehouses.',
        'Complex cross-border customs calculation and multi-currency taxation compliance.',
        'High bounce rate from slow server-side rendering during high-traffic influencer promotions.'
      ]
    },
    solution: {
      summary: 'We architected a globally distributed static edge build pipeline that pre-renders product pages and hydrates dynamic pricing and stock in under 40 milliseconds.',
      highlights: [
        '99/100 Google Lighthouse performance score across mobile and desktop.',
        'Algolia neural search integration returning instant semantic suggestions in under 18ms.',
        'One-click international checkout supporting Apple Pay, Google Pay, and localized payment rails.'
      ]
    },
    architecture: {
      frontend: [
        'Next.js 15 App Router with Partial Prerendering (PPR)',
        'Tailwind CSS design system with micro-interaction hover states',
        'Zustand lightweight client-side state management for cart synchronization',
        'Optimistic cart updates with instant inventory reservation'
      ],
      backend: [
        'Shopify Plus Storefront GraphQL API bridge',
        'Stripe Payments & Tax API for dynamic cross-border VAT calculation',
        'Algolia Neural Search engine with AI vector embeddings',
        'Vercel Edge Functions for geo-targeted pricing and translation'
      ],
      cloudInfrastructure: [
        'Vercel Global Edge Network across 300+ CDN points of presence',
        'Upstash Redis for global rate-limiting and cart session storage',
        'Automated Webhook synchronization keeping inventory accurate to the second'
      ],
      securityAndCompliance: [
        'PCI-DSS Level 1 certified checkout environment',
        'Cloudflare Bot Management mitigating inventory scalping bots',
        'Automated GDPR/CCPA consumer privacy and cookie governance'
      ],
      diagramSteps: [
        { step: '01', name: 'Edge Geo Routing', desc: 'Visitor routed to closest edge node with localized currency & language', icon: '🌍', latency: '< 12ms' },
        { step: '02', name: 'Pre-rendered Cache', desc: 'Product imagery and specifications served instantly from edge cache', icon: '⚡', latency: '< 25ms' },
        { step: '03', name: 'Realtime Inventory', desc: 'Lightweight GraphQL query fetches dynamic warehouse stock availability', icon: '📦', latency: '< 40ms' },
        { step: '04', name: 'One-Click Checkout', desc: 'Stripe integrated wallet checkout with automatic fraud prevention', icon: '💳', latency: '< 80ms' }
      ]
    },
    features: [
      {
        title: 'Instant Neural Product Search',
        description: 'Typo-tolerant, image-aware semantic search that finds products based on visual descriptions and intent in real time.',
        icon: '🔍',
        impact: 'Search conversion boosted by 52%'
      },
      {
        title: 'Dynamic Geo-Currency Engine',
        description: 'Automatic detection of visitor country, duty estimation, and currency conversion without confusing checkout surprises.',
        icon: '💱',
        impact: 'Cross-border sales up 68%'
      },
      {
        title: 'Optimistic Cart Drawer',
        description: 'Zero loading spinners when adding items or applying promotional codes, backed by instant rollback safeguards.',
        icon: '🛒',
        impact: 'Abandonment dropped by 34%'
      },
      {
        title: '3D Augmented Reality Viewer',
        description: 'Interactive 3D model inspector allowing shoppers to visualize luxury products in their living spaces with ARKit/ARCore.',
        icon: '🕶️',
        impact: 'Return rate reduced by 41%'
      }
    ],
    metrics: [
      { value: '+38%', label: 'Mobile Conversion', change: '+38%', description: 'Direct increase in completed checkout transactions' },
      { value: '0.4s', label: 'Average Page Load', change: '-91%', description: 'Worldwide edge latency on product pages' },
      { value: '99.99%', label: 'Black Friday Uptime', change: '100% pass', description: 'Flawlessly handled 4.2M visitors over 72 hours' },
      { value: '$45M+', label: 'Annual GMV Routed', change: '+85%', description: 'Gross merchandise volume processed securely' }
    ],
    benchmarks: [
      { metric: 'Mobile PageSpeed Score', before: '32 / 100', after: '99 / 100', improvement: '+67 Points' },
      { metric: 'Time to Interactive (TTI)', before: '4.8s', after: '0.6s', improvement: '87% Reduction' },
      { metric: 'Cart Abandonment Rate', before: '68%', after: '34%', improvement: '50% Better' },
      { metric: 'Catalog Search Response', before: '650ms', after: '18ms', improvement: '97% Faster' }
    ],
    codeSnippet: {
      title: 'edge-cart-sync.ts (Optimistic Mutation & Inventory Lock)',
      language: 'typescript',
      code: `// Yuvex Optimistic Edge Cart Mutator
export async function addCartItemWithEdgeLock(cartId: string, item: CartItem) {
  // 1. Instantly reserve temporary inventory token in Edge Redis (TTL: 15 min)
  const reservation = await edgeRedis.eval(RESERVE_INVENTORY_LUA, [item.sku, item.quantity]);
  if (!reservation.success) throw new Error('OUT_OF_STOCK');

  // 2. Dispatch optimistic state to client UI
  // 3. Asynchronously reconcile with Shopify Plus GraphQL Storefront
  const updatedCart = await storefrontClient.request(ADD_LINES_MUTATION, {
    cartId,
    lines: [{ merchandiseId: item.variantId, quantity: item.quantity }]
  });

  return updatedCart;
}`
    },
    gallery: [
      { url: 'https://picsum.photos/seed/eshop-screen1/900/600', caption: 'Responsive luxury product catalog with instant filtering and search' },
      { url: 'https://picsum.photos/seed/eshop-screen2/900/600', caption: 'Interactive 3D product showcase and spatial augmented reality preview' },
      { url: 'https://picsum.photos/seed/eshop-screen3/900/600', caption: 'Streamlined localized checkout flow with one-click payment tokens' }
    ],
    deliverables: [
      'Next.js 15 Headless Front-End Storefront',
      'Shopify Plus Custom App & GraphQL Middleware',
      'Algolia Neural Search & Recommendation Implementation',
      'Stripe Cross-Border Payment & Tax Calculator Integration',
      'Tailwind Component Library for Marketing Team Pages',
      'Continuous Deployment Pipeline on Vercel Enterprise'
    ],
    testimonial: {
      quote: "Our previous site crashed every time we ran an influencer campaign. Yuvex Tech gave us a platform that handles millions of page hits without breaking a sweat, and our revenue reflects that.",
      author: 'Sophia Lauren',
      role: 'VP of Digital Commerce',
      company: 'Genesis Luxury Retailers',
      avatar: 'https://i.pravatar.cc/150?u=sophia_vp'
    }
  },
  {
    id: 'p4',
    title: 'NexusAI Cognitive Ops',
    category: 'AI & Machine Learning',
    description: 'Autonomous multi-agent orchestration platform for enterprise IT infrastructure self-healing and incident resolution.',
    image: 'https://picsum.photos/seed/nexusai/800/600',
    tags: ['Gemini 1.5 Pro', 'Python', 'React 19', 'Kafka', 'Kubernetes'],
    client: 'Nexus Automata Inc.',
    year: '2024',
    timeline: '6 Months of Execution',
    role: 'Autonomous AI Agent System Architecture',
    status: 'Live in Production',
    heroSubtitle: 'Enterprise cognitive operations engine coordinating autonomous agents that triage, diagnose, and remediate cloud outages in seconds.',
    overview: 'Modern cloud architectures generate tens of millions of telemetry logs per hour, making human incident response slow and costly. Yuvex Tech built NexusAI, a multi-agent cognitive orchestration platform powered by Gemini models. NexusAI correlates distributed traces, pinpoints root-cause failure vectors, and executes safe canary rollbacks before human engineers even open their laptops.',
    challenge: {
      summary: 'Enterprise engineering teams endured an average Mean Time to Resolution (MTTR) of 42 minutes for complex microservice outages, resulting in severe SLA penalties.',
      points: [
        'Processing 500,000 log events per second across 1,200 Kubernetes clusters in real time.',
        'Synthesizing multi-modal telemetry (metrics, traces, logs, git commits) into accurate causal chains.',
        'Ensuring safety guardrails that prevent automated agents from executing catastrophic commands.'
      ]
    },
    solution: {
      summary: 'We designed a hierarchy of specialized Gemini agents (Diagnostician, Verifier, SRE Operator) that reason collaboratively under strict deterministic sandboxes.',
      highlights: [
        'Autonomous Mean Time to Resolution (MTTR) dropped from 42 minutes to 48 seconds.',
        'Hierarchical consensus protocol requiring dual agent agreement before mutating infrastructure.',
        'Interactive real-time canvas visualizing agent thought processes and root cause DAGs.'
      ]
    },
    architecture: {
      frontend: [
        'React 19 with dynamic node-graph canvas visualizer',
        'Real-time streaming Markdown thoughts with token-by-token reasoning output',
        'Tailwind CSS cybersecurity aesthetic with dark mode telemetry accents'
      ],
      backend: [
        'Gemini 1.5 Pro with Function Calling & Structured JSON Outputs',
        'Python FastAPI async agent orchestration runtime',
        'Apache Kafka event bus handling 500k telemetry logs/sec',
        'Vector database (Qdrant) indexing 10 million historical incident postmortems'
      ],
      cloudInfrastructure: [
        'Kubernetes Operator with isolated ephemeral remediation pods',
        'AWS PrivateLink securely bridging to on-premise enterprise clusters',
        'OpenTelemetry native collectors gathering standardized metric feeds'
      ],
      securityAndCompliance: [
        'Deterministic policy engine (Open Policy Agent) gating all actions',
        'Air-gapped deployment option for defense and financial clients',
        'Complete cryptographic session replay of every AI intervention'
      ],
      diagramSteps: [
        { step: '01', name: 'Anomaly Ingestion', desc: 'OpenTelemetry collector flags latency spike across service mesh', icon: '📡', latency: '< 5ms' },
        { step: '02', name: 'Agent Reasoning', desc: 'Gemini Correlator matches error spikes with recent git deploy commits', icon: '🤖', latency: '< 600ms' },
        { step: '03', name: 'Policy Gate Check', desc: 'Open Policy Agent verifies remediation boundaries and permissions', icon: '🛡️', latency: '< 10ms' },
        { step: '04', name: 'Auto-Remediation', desc: 'Canary rollback triggered; traffic drained from unhealthy pods', icon: '🚀', latency: '< 1.2s' }
      ]
    },
    features: [
      {
        title: 'Autonomous Causal Root-Cause Graph',
        description: 'Interactive directed acyclic graph (DAG) illustrating the exact sequence of events that precipitated an outage.',
        icon: '🕸️',
        impact: '94% automated diagnostic accuracy'
      },
      {
        title: 'Dual-Agent Consensus Engine',
        description: 'No remediation script runs without an independent auditor agent verifying syntax and side-effect blast radius.',
        icon: '⚖️',
        impact: 'Zero false-positive outages caused'
      },
      {
        title: 'Natural Language Postmortem Bot',
        description: 'Auto-generates publication-ready incident reports and Jira tickets with complete remediation timelines.',
        icon: '📝',
        impact: 'Saved 3 hours per incident'
      },
      {
        title: 'Predictive Capacity Auto-Scaler',
        description: 'Forecasts upcoming traffic surges based on historical patterns and preemptively warms container pools.',
        icon: '🔮',
        impact: 'Prevented 14 critical blackouts'
      }
    ],
    metrics: [
      { value: '48 sec', label: 'Average MTTR', change: '-98%', description: 'Resolution time down from 42 minutes' },
      { value: '99.999%', label: 'Infrastructure Uptime', change: 'Five 9s', description: 'Maintained across all managed client clusters' },
      { value: '$3.2M', label: 'Downtime Losses Saved', change: 'Annual', description: 'Calculated across enterprise SLA thresholds' },
      { value: '1.2M', label: 'Incidents Triaged', change: 'Year to date', description: 'Handled with 94% autonomy without human pager' }
    ],
    benchmarks: [
      { metric: 'Incident Detection Time', before: '6.5 mins', after: '4.2 secs', improvement: '98% Faster' },
      { metric: 'Root Cause Identification', before: '28 mins', after: '12 secs', improvement: '99% Faster' },
      { metric: 'Engineering Pager Alerts / Week', before: '142 calls', after: '9 calls', improvement: '93% Reduction' },
      { metric: 'Postmortem Documentation Time', before: '4 hours', after: '30 secs', improvement: '99% Saved' }
    ],
    codeSnippet: {
      title: 'autonomous-remediation-gate.py',
      language: 'python',
      code: `# Yuvex Autonomous Agent Remediation Verification Pipeline
async def verify_and_dispatch_remediation(incident_context: IncidentContext):
    # 1. Generate candidate remediation plan with Gemini
    plan = await agent_diagnostician.propose_remediation(incident_context)
    
    # 2. Independent safety verification agent executes dry-run simulation
    verification = await agent_verifier.simulate_blast_radius(plan)
    if not verification.is_safe:
        await alert_human_sre("Remediation blocked: Blast radius exceeded safety budget")
        return
        
    # 3. Open Policy Agent deterministic evaluation
    opa_verdict = evaluate_opa_policy(plan.manifest, incident_context.environment)
    assert opa_verdict.allowed, f"Policy violation: {opa_verdict.reason}"
    
    # 4. Execute atomic rollback with canary traffic verification
    await kubernetes_operator.apply_canary_rollback(plan)`
    },
    gallery: [
      { url: 'https://picsum.photos/seed/nexusai-screen1/900/600', caption: 'Interactive root-cause causal DAG canvas with live streaming thoughts' },
      { url: 'https://picsum.photos/seed/nexusai-screen2/900/600', caption: 'Multi-agent consensus telemetry dashboard monitoring 1,200 clusters' },
      { url: 'https://picsum.photos/seed/nexusai-screen3/900/600', caption: 'Automated postmortem generator with cryptographic audit proof' }
    ],
    deliverables: [
      'Multi-Agent Python Cognitive Engine with Gemini 1.5 Pro',
      'Interactive React 19 Incident Management Canvas',
      'Kubernetes Custom Resource Definition (CRD) Operator',
      'Open Policy Agent Security & Safety Guardrail Suite',
      'Automated Incident Postmortem & Audit Trail Exporter',
      'Grafana / Prometheus Real-Time Telemetry Dashboards'
    ],
    testimonial: {
      quote: "NexusAI caught a cascading database deadlock at 3:14 AM and rolled back the bad migration in 45 seconds. By the time our team woke up, the postmortem was already formatted and waiting in our inbox.",
      author: 'David Chen',
      role: 'Head of Site Reliability',
      company: 'Nexus Automata Inc.',
      avatar: 'https://i.pravatar.cc/150?u=david_sre'
    }
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Future of AI in Mobile UX',
    category: 'AI',
    excerpt: 'How generative AI is reshaping the way users interact with handheld devices...',
    content: 'Generative AI is not just a buzzword; it is fundamentally altering the interface between humans and machines. In mobile UX, we are moving away from rigid navigation menus toward fluid, intent-based conversations. This post explores how predictive text, image generation, and voice synthesis are creating hyper-personalized experiences that anticipate user needs before they even express them.',
    author: 'Alex Rivera',
    date: 'Oct 12, 2024',
    image: 'https://picsum.photos/seed/aiux/600/400',
    readTime: '5 min'
  },
  {
    id: 'b2',
    title: 'React 19: What Developers Need to Know',
    category: 'Web Development',
    excerpt: 'Exploring the new compiler features and hook improvements in the upcoming release.',
    content: 'React 19 is set to be a milestone release. The introduction of the React Compiler (React Forget) aims to eliminate the need for manual memoization with useMemo and useCallback. This transition promises to make development faster and cleaner. We also dive into the new Actions API and improvements to concurrent rendering that will make your web apps feel snappier than ever.',
    author: 'Sarah Chen',
    date: 'Oct 05, 2024',
    image: 'https://picsum.photos/seed/react19/600/400',
    readTime: '8 min'
  },
  {
    id: 'b3',
    title: 'Scaling Tech for 10M+ Users',
    category: 'Architecture',
    excerpt: 'Case study on architecture patterns for high-traffic global applications.',
    content: 'Building for millions requires a shift in mindset from single servers to distributed systems. We discuss the importance of horizontal scaling, the role of Redis for low-latency caching, and how edge computing with Vercel and Cloudflare Workers can bring your application closer to your users. Scale isn’t just about the database; it is about every layer of the stack working in harmony.',
    author: 'Mark Sterling',
    date: 'Sep 28, 2024',
    image: 'https://picsum.photos/seed/scale/600/400',
    readTime: '12 min'
  }
];
