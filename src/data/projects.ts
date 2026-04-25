export type LinkLabel = 'view' | 'live'

export interface Project {
  name: string
  tags: string[]
  en: string
  fr: string
  link: string
  linkLabel: LinkLabel
}

export const PROJECTS: Project[] = [
  {
    name: 'UIM — User Identity Management',
    tags: ['Django', 'PostgreSQL', 'AI', 'JWT', 'MFA', 'Streamlit', 'RBAC'],
    en: 'AI-powered identity management platform. Detects anomalous user behavior using Isolation Forest (scikit-learn), with JWT + TOTP double-factor auth, role-based access control, and a real-time Streamlit dashboard.',
    fr: "Plateforme intelligente de gestion des identités. Détection de comportements anormaux via Isolation Forest, authentification JWT + TOTP, contrôle d'accès par rôles et tableau de bord Streamlit en temps réel.",
    link: 'https://github.com/yannuser',
    linkLabel: 'view',
  },
  {
    name: 'Ledger — Learning Effort Tracker',
    tags: ['React', 'Node.js', 'MongoDB', 'JWT', 'Vite', 'Express'],
    en: 'Full-stack MERN app for tracking learning effort over time. Features secure JWT auth with httpOnly cookies, automatic token rotation, and session persistence.',
    fr: "Application MERN complète pour suivre l'effort d'apprentissage dans le temps. Auth JWT sécurisée avec cookies httpOnly, rotation automatique de tokens et persistance de session.",
    link: 'https://github.com/yannuser/Ledger',
    linkLabel: 'view',
  },
  {
    name: 'Projet VB — Medical Appointments',
    tags: ['VB.NET', 'Azure SQL', 'Entity Framework', 'Windows Forms', 'SMTP'],
    en: 'Desktop appointment management app for clinic receptionists. Built with VB.NET + Windows Forms, SQL Server on Azure, Entity Framework Core 8, and automated email confirmations via Gmail SMTP.',
    fr: "Application de gestion de rendez-vous médicaux pour réceptionnistes. VB.NET + Windows Forms, SQL Server sur Azure, Entity Framework Core 8 et confirmations email automatiques via SMTP Gmail.",
    link: 'https://github.com/yannuser',
    linkLabel: 'view',
  },
  {
    name: 'Library Self-Service Kiosk',
    tags: ['Java', 'Swing', 'SQLite', 'OOP', 'PDF'],
    en: 'Self-service library kiosk system in Java. Layered OOP architecture (UI / Controller / Business / DAO), RFID-based document loans, SQLite database, and PDF receipt generation.',
    fr: "Borne de prêt en libre-service en Java. Architecture en couches OOP (UI / Contrôleur / Métier / DAO), emprunts par code RFID, base de données SQLite et génération de reçus PDF.",
    link: 'https://github.com/yannuser',
    linkLabel: 'view',
  },
  {
    name: 'Real Estate — Front-End',
    tags: ['React', 'JavaScript', 'CSS'],
    en: 'Front-end real estate browsing app built with React. Clean UI, component-based architecture, deployed live.',
    fr: "Application front-end de navigation immobilière en React. Interface soignée, architecture par composants, déployée en production.",
    link: 'https://real-estate-ytb.pages.dev/',
    linkLabel: 'live',
  },
]
