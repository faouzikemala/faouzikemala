export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface SkillCategory {
  category: string;
  items: { name: string; level: number; highlight?: boolean }[];
}

export interface Project {
  id: string;
  title: string;
  period: string;
  category?: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  featured?: boolean;
  stars?: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  honors: string;
  details?: string;
}

export const personalInfoData = {
  name: "FAOUZI KEMALA",
  nameArabic: "فوزي كمالة",
  title: "Développeur Web & Immersif 3D/VR • Recherche d'Emploi Active",
  titleArabic: "مطور ويب وتطبيقات ثلاثية الأبعاد وواقع افتراضي • أبحث عن عمل",
  tagline: "Diplômé d'une Licence en Sciences de l'Informatique (ISIMG) avec première année de Master recherche suivie (non achevé). Activement à la recherche d'un emploi stable (CDI).",
  taglineArabic: "خريج إجازة في علوم الإعلامية مع سنة أولى ماجستير بحث (غير مكتمل). أبحث بجدية ونشاط عن عمل دائم (CDI).",
  email: "faouzikemala205@gmail.com",
  phone: "+216 96 897 484",
  location: "Ghomrassen 3220, Tataouine, Tunisie",
  locationArabic: "غمراسن 3220، تطاوين، تونس",
  github: "https://github.com/faouzikemala",
  githubUsername: "faouzikemala",
  linkedin: "https://linkedin.com/in/faouzikemala",
  status: "À la recherche active d'un emploi / Poste CDI",
  bio: [
    "Développeur passionné de 24 ans basé en Tunisie, titulaire d'une Licence en Sciences de l'Informatique de l'Institut Supérieur d'Informatique et de Multimédia de Gabès (ISIMG).",
    "Après une première année en Master de Recherche en informatique (non terminée car j'ai choisi de m'orienter directement vers le milieu professionnel), je suis immédiatement disponible pour rejoindre une équipe dynamique.",
    "Compétences clés en développement web full-stack (PHP, Symfony, MySQL, HTML5/CSS/JS), programmation C#, et création d'applications 3D/VR immersives avec Unity et casque Meta Quest 3."
  ],
  stats: [
    { label: "Statut", value: "Recherche Emploi", subtext: "Prêt à démarrer immédiatement" },
    { label: "Diplôme Obtenu", value: "Licence Informatique", subtext: "ISIMG Gabès" },
    { label: "Spécialité 3D/VR", value: "Unity & Quest 3", subtext: "Applications Immersives" },
    { label: "Web Full-Stack", value: "Symfony & PHP", subtext: "Architecture & SQL" }
  ],
  skills: [
    {
      category: "Développement Immersif & 3D/VR",
      items: [
        { name: "Unity 3D / VR", level: 94, highlight: true },
        { name: "C# Programming", level: 92, highlight: true },
        { name: "Meta Quest 3 & Oculus SDK", level: 90, highlight: true },
        { name: "Modélisation Blender", level: 82 },
        { name: "Simulation Interactive", level: 88 }
      ]
    },
    {
      category: "Développement Web & Backend",
      items: [
        { name: "PHP & Symfony", level: 90, highlight: true },
        { name: "HTML5 / CSS / JavaScript", level: 92, highlight: true },
        { name: "SQL & MySQL", level: 88 },
        { name: "Apache & Serveurs Web", level: 84 },
        { name: "Systèmes d'Authentification Sécurisés", level: 89 }
      ]
    },
    {
      category: "Développement Mobile & Scripting",
      items: [
        { name: "Android Studio & Kotlin/Java", level: 86, highlight: true },
        { name: "SQLite & Firebase", level: 85 },
        { name: "Python (Automatisation & Scripts)", level: 84 },
        { name: "Git & GitHub Version Control", level: 90 }
      ]
    },
    {
      category: "Conception & Design",
      items: [
        { name: "Design Logo & Flyer", level: 88 },
        { name: "Création Menu Digital", level: 90 },
        { name: "Résolution de Problèmes", level: 92 },
        { name: "Travail en Équipe & Proactivité", level: 94 }
      ]
    }
  ],
  experiences: [
    {
      id: "exp-1",
      role: "Développeur Freelance 3D & Simulateur Immersif",
      company: "Projet Freelance Simulation Avicole",
      period: "Été 2025 (en 3 périodes)",
      location: "Tunisie",
      description: "Conception et développement d'une application immersive de simulation d’une ferme avicole. Modélisation en 3D d'une ferme composée de trois espaces distincts, chacun adapté à une catégorie de poulets selon leur taille et leur âge.",
      highlights: [
        "Intégration d'interactions en temps réel permettant la gestion de l’alimentation, des déplacements et de la croissance des volailles.",
        "Solution interactive et pédagogique offrant un outil de simulation réaliste pour la formation et l’expérimentation dans l’élevage avicole.",
        "Modélisation et optimisation des assets 3D pour un rendu fluide et éducatif."
      ],
      tech: ["Unity 3D", "C#", "Blender", "Simulation Temps Réel", "3D Architecture"]
    },
    {
      id: "exp-2",
      role: "Stagiaire Développeur Réalité Mixte (Projet Fin d’Étude PFE)",
      company: "HM Groupe",
      period: "4 mois",
      location: "Gabès, Tunisie",
      description: "Conception et développement d'une application complète de simulation de chariot élévateur combinant un volant physique (réel) et le casque de réalité mixte Meta Quest 3.",
      highlights: [
        "Reproduction fidèle de l'expérience de conduite d'un chariot élévateur dans un environnement 3D immersif et interactif.",
        "Interfaçage matériel entre le volant physique réel et les contrôles sous Unity / Oculus SDK.",
        "Optimisation des performances et latence pour une immersion réaliste et sécuritaire de formation."
      ],
      tech: ["Meta Quest 3", "Unity 3D", "C#", "Oculus SDK", "Hardware Coupling", "VR Simulation"]
    },
    {
      id: "exp-3",
      role: "Stagiaire Développeur Web (Stage Technique)",
      company: "Soft Ghom",
      period: "3 mois",
      location: "Ghomrassen, Tunisie",
      description: "Conception et implémentation d’un système complet d’authentification pour une application web, basé sur le framework Symfony.",
      highlights: [
        "Respect scrupuleux des bonnes pratiques de sécurité (hachage, tokens, sessions) et d’architecture logicielle MVC.",
        "Gestion des rôles utilisateurs, permissions, et intégration base de données relationnelle MySQL.",
        "Développement des vues responsives et validation des formulaires."
      ],
      tech: ["Symfony", "PHP", "MySQL", "HTML5", "CSS", "JavaScript", "Sécurité Web"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Visite virtuelle d’un musée interactif",
      period: "Projet VR / 3D",
      category: "Réalité Virtuelle & 3D",
      description: "Simulation VR d'un espace d'exposition artistique et culturel avec Unity et casque Meta Quest, interactions 3D immersives et navigation libre.",
      tags: ["Unity", "C#", "Meta Quest", "Oculus SDK", "Blender"],
      githubUrl: "https://github.com/faouzikemala",
      stars: 180
    },
    {
      id: "proj-2",
      title: "Planificateur de repas avec gestion des courses",
      period: "Application Mobile Android",
      category: "Développement Mobile",
      description: "Application Android native avec stockage local et interface ergonomique pour l'organisation nutritionnelle, la génération des menus et la liste des courses.",
      tags: ["Android Studio", "Kotlin", "Java", "SQLite", "Firebase"],
      githubUrl: "https://github.com/faouzikemala",
      stars: 120
    },
    {
      id: "proj-3",
      title: "Site de gestion de clubs étudiants",
      period: "Plateforme Web Full-Stack",
      category: "Développement Web",
      description: "Développement full-stack d'un site web dynamique avec base de données pour l'administration des clubs étudiants, la gestion des membres et des événements.",
      tags: ["PHP", "HTML/CSS", "JavaScript", "MySQL", "Apache"],
      githubUrl: "https://github.com/faouzikemala",
      stars: 140
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Master de Recherche en Sciences de l'Informatique (1ère année - Non achevé)",
      institution: "Institut Supérieur d'Informatique et de Multimédia de Gabès (ISIMG)",
      year: "2024",
      honors: "Première année suivie (non achevée, choix de réorientation vers l'insertion professionnelle directe).",
      details: "Première année suivie (non achevée, choix de réorientation vers l'insertion professionnelle directe)."
    },
    {
      id: "edu-2",
      degree: "Licence en Sciences de l'Informatique (Diplôme Obtenu)",
      institution: "Institut Supérieur d'Informatique et de Multimédia de Gabès (ISIMG)",
      year: "2021 — 2023",
      honors: "Diplôme national de Licence en Sciences de l'Informatique obtenu avec succès.",
      details: "Diplôme national de Licence en Sciences de l'Informatique obtenu avec succès."
    },
    {
      id: "edu-3",
      degree: "Formations Spécialisées en Python",
      institution: "Formations certifiantes en ligne",
      year: "2020 — 2021",
      honors: "Développement de compétences en programmation, automatisation et traitement de données.",
      details: "Développement de compétences en programmation, automatisation et traitement de données."
    },
    {
      id: "edu-4",
      degree: "Diplôme Baccalauréat Spécialité en Sciences Informatique",
      institution: "Lycée 2 mars 1934 Ghomrassen",
      year: "2019 — 2020",
      honors: "Diplôme du Baccalauréat obtenu avec succès.",
      details: "Diplôme du Baccalauréat obtenu avec succès."
    }
  ],
  languages: [
    { name: "Arabe", level: "Langue maternelle" },
    { name: "Français", level: "Avancé" },
    { name: "Anglais", level: "Avancé" }
  ],
  interests: [
    "Création et design de Logo, Flyer et Menu Digital",
    "Programmation en temps libre",
    "Recherches innovations technologiques et Intelligence Artificielle (IA)"
  ]
};

// Convenience adapter for FileExplorer, PdfViewer, Notepad, etc.
export const personalInfo = {
  name: personalInfoData.name,
  nameArabic: personalInfoData.nameArabic,
  title: personalInfoData.title,
  titleArabic: personalInfoData.titleArabic,
  tagline: personalInfoData.tagline,
  taglineArabic: personalInfoData.taglineArabic,
  location: personalInfoData.location,
  locationArabic: personalInfoData.locationArabic,
  bio: personalInfoData.bio.join(' '),
  summary: personalInfoData.tagline,
  contact: {
    email: personalInfoData.email,
    phone: personalInfoData.phone,
    github: personalInfoData.githubUsername,
    githubUrl: personalInfoData.github,
    linkedin: personalInfoData.linkedin,
    location: personalInfoData.location,
    locationArabic: personalInfoData.locationArabic
  },
  metrics: personalInfoData.stats.map(s => ({
    label: s.label,
    value: s.value,
    description: s.subtext
  })),
  experience: personalInfoData.experiences.map(e => ({
    id: e.id,
    role: e.role,
    company: e.company,
    period: e.period,
    location: e.location,
    description: e.description,
    highlights: e.highlights,
    technologies: e.tech
  })),
  skills: personalInfoData.skills.flatMap(c => c.items.map(i => ({
    name: i.name,
    level: i.level,
    category: c.category
  }))),
  projects: personalInfoData.projects.map(p => ({
    id: p.id,
    title: p.title,
    period: p.period,
    category: p.category || p.period,
    description: p.description,
    tags: p.tags,
    githubUrl: p.githubUrl,
    stars: p.stars || 150
  })),
  education: personalInfoData.education.map(ed => ({
    id: ed.id,
    degree: ed.degree,
    institution: ed.institution,
    year: ed.year,
    honors: ed.honors,
    details: ed.details || ed.honors
  })),
  languages: personalInfoData.languages,
  interests: personalInfoData.interests
};
