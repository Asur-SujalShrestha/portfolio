
export const profile = {
  name: 'Sujal Shrestha',
  role: 'Backend Software Engineer',
  location: 'Putalisadak, Kathmandu',
  phone: '+977 9827732079',
  email: 'shresthasujal519@gmail.com',
  github: 'https://github.com/Asur-SujalShrestha',
  summary:
    'I build scalable, secure, cloud-native applications with Java and Spring Boot. My work centres on Hexagonal Architecture, Spring Modulith, microservices, multi-tenancy and Keycloak security, plus real-time WebSocket features, system integrations and data synchronization.',
}

export const jobs = [
  {
    company: 'Pexus Tech. / ING Tech', title: 'Java Developer', period: 'Dec 2025 - Present',
    projects: [
      {
        name: 'Enrollment V2',
        image: 'projects/admission-system.png',
        stack: ['Spring Modulith', 'Keycloak', 'PostgreSQL', 'Kubernetes', 'WebSocket'],
        points: [
          'Designed Enrollment V2 with Spring Modulith and Hexagonal Architecture, setting modular and maintainable domain boundaries.',
          'Implemented Keycloak-based IAM and permission-driven RBAC for authentication and fine-grained authorization.',
          'Designed schema-based multi-tenancy with PostgreSQL and built tenant-aware functionality.',
          'Built cloud-native infrastructure on Docker and Kubernetes with MinIO, Redis, Elasticsearch, Cloud Config and HashiCorp Vault.',
          'Implemented WebSocket-based real-time student admission events across modules.']
      },
      {
        name: 'Attendease',
        image: 'projects/attendease.png',
        stack: ['Microservices', 'Multi-tenancy', 'WebSocket', 'Keycloak', 'Biometric sync'],
        points: [
          'Contributed to a multi-tenant microservice architecture with isolated operations per tenant.',
          'Implemented WebSocket-based routine import to synchronize student routines across groups and tenants.',
          'Integrated biometric attendance services with scheduled processing and log synchronization.',
          'Built email and report generation services and supported onboarding of new tenants.',
          'Migrated Keycloak authorization from role-based to permission-based authorities and integrated Attendease with Enrollment through a reverse proxy.']
      },
      {
        name: 'Authorization Server',
        image: 'projects/auth.webp',
        stack: ['Spring Modulith', 'Hexagonal Architecture', 'Keycloak', 'Feign Client'],
        points: [
          'Designed a centralized Authorization Server with Spring Modulith and Hexagonal Architecture.',
          'Integrated with Keycloak IAM to retrieve user details, roles and granular permissions.',
          'Developed Feign Client integration that serves authorization to both Attendease and Enrollment.']
      },
    ],
  },
  {
    company: 'Sona Consolidate Pvt. Ltd.', title: 'Full Stack Developer Trainee', period: 'Jul 2024 - Jan 2025',
    projects: [{
      name: 'Bus Management System',
      image: 'projects/sona-bus.jpg',
      points: [
        'Worked on frontend and backend components of a Bus Management System.',
        'Assisted senior developers with features, bug fixes and system improvements.']
    }],
  },
]

export const skills = [
  { group: 'Languages', items: ['Java', 'SQL', 'React', 'Angular'] },
  { group: 'Backend', items: ['Spring Boot', 'Spring Microservices', 'Spring Modulith', 'Hexagonal Architecture'] },
  { group: 'Security', items: ['Keycloak', 'IAM', 'OAuth 2.0 / JWT'] },
  { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'MS SQL'] },
  { group: 'Infrastructure', items: ['Docker', 'Kubernetes', 'CI/CD'] },
  { group: 'Messaging & Real-time', items: ['Kafka', 'RabbitMQ', 'WebSocket'] },
  { group: 'Caching & Logs', items: ['Redis', 'Elasticsearch'] },
  { group: 'Storage & Config', items: ['MinIO', 'HashiCorp Vault', 'Cloud Config'] },
  { group: 'Version Control', items: ['Git', 'GitHub', 'GitLab'] },
]

// Add your own repo / demo links in `link`
export const projects = [
  {
    name: 'Online Learning and Collaboration Platform', stack: 'Spring Boot, PostgreSQL, React',
    text: 'Organizations, classrooms, groups, assignments and announcements, with JWT auth, role-based authorization, real-time WebSocket chat and file sharing.', link: 'https://github.com/Asur-SujalShrestha/Online-Learning-and-Collaboration-Platform'
  },
  {
    name: 'Hospital Management System', stack: 'Java, Spring Boot, React, PostgreSQL, Microservices',
    text: 'Microservices for patient registration, doctors, appointments and medical records, with role-based access control and a normalized PostgreSQL design.', link: 'https://github.com/Asur-SujalShrestha/Online-Hospital-Appointment-Booking-System'
  },
  {
    name: 'Online Food Ordering System', stack: 'Java Spring Boot, React, PostgreSQL',
    text: 'End-to-end ordering for restaurants, customers, admins and riders, with Khalti payments, order tracking and delivery management.', link: 'https://github.com/Asur-SujalShrestha/Online-food-ordering-System'
  },
]

export const education = [
  { title: 'Bachelor in Computing Science', place: 'Islington College', period: 'Nov 2022 - Jun 2025' },
  { title: '+2 level in Science', place: 'Capital College (CCRC)', period: '2020 - 2022' },
]
export const certifications = ['AWS Cloud Foundation', 'AWS Cloud Data Engineering', 'AWS Cloud Machine Learning']
