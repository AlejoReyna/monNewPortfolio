// user-data.ts - Información personalizada de Alexis Alberto Reyna Sánchez

export interface UserData {
  personal: PersonalInfo;
  professional: ProfessionalInfo;
  casual: CasualInfo;
  context: ContextInfo;
}

export interface PersonalInfo {
  fullName: string;
  firstName: string;
  currentRole: string;
  experience: string;
  specialization: string;
  location: string;
  availability: string;
}

export interface ProfessionalInfo {
  stack: TechStack;
  experience: WorkExperience;
  projects: Project[];
  contact: ContactInfo;
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  databases: string[];
  cloud: string[];
  tools: string[];
  languages: string[];
}

export interface WorkExperience {
  current: {
    company: string;
    role: string;
    startDate: string;
    description: string;
  };
  background: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  highlight?: boolean;
}

export interface CasualInfo {
  music: {
    genres: string[];
    currentArtists: string[];
    concerts: string[];
    instruments: string[];
    specialNote: string;
  };
  movies: {
    favorites: string[];
    currentSeries: string[];
    genres: string[];
  };
  travel: {
    visited: string[];
    planned: string;
    bucketList: string[];
    style: string;
  };
  hobbies: {
    sports: string;
    gaming: string;
    reading: string[];
    creativity: string;
  };
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  cv: string;
}

export interface ContextInfo {
  languages: string[];
  timezone: string;
  uniqueness: string;
  goals: string;
  currentChallenge: string;
  funFacts: string[];
  personality: {
    motivation: string;
    communicationStyle: string;
  };
}

// ===== DATOS REALES DE ALEXIS =====
export const alexisData: UserData = {
  personal: {
    fullName: "Alexis Alberto Reyna Sánchez",
    firstName: "Alexis",
    currentRole: "Full stack developer en Inverater, una startup de inversiones inmobiliarias en la que ejerzo labores de UX/UI tanto como de backend",
    experience: "4 años como programador, casi 1 año como profesional",
    specialization: "UX/UI",
    location: "Monterrey, Nuevo León, México",
    availability: "Ofrezco servicios de freelance, puedes saber más yendo al apartado de let's talk"
  },
  
  professional: {
    stack: {
      frontend: ["React", "Vue", "NextJS"],
      backend: ["Node.js", "Ruby"],
      databases: ["MongoDB", "PostgreSQL", "MySQL"],
      cloud: ["AWS"],
      tools: ["Git", "Figma"],
      languages: ["TypeScript", "Ruby", "Swift"]
    },
    
    experience: {
      current: {
        company: "Inverater",
        role: "Full Stack Developer",
        startDate: "7 de Octubre de 2024",
        description: "Startup de inversiones inmobiliarias donde desempeño labores de UX/UI y backend"
      },
      background: "Anteriormente me desempeñaba como freelance"
    },
    
    projects: [
      // Placeholder - agregar proyectos reales del portfolio
      {
        name: "Inverater Platform",
        description: "Plataforma de startup de inversiones inmobiliarias - desarrollo full-stack con enfoque en UX/UI",
        technologies: ["React", "Node.js", "AWS", "Figma"],
        link: "https://inverater.com",
        highlight: true
      }
    ],
    
    contact: {
      email: "contacto@alexisreyna.dev",
      linkedin: "linkedin.com/in/alexisreyna",
      github: "github.com/alexisreyna",
      portfolio: "alexisreyna.dev",
      cv: "cv.alexisreyna.dev"
    }
  },
  
  casual: {
    music: {
      genres: ["Rock", "Hip-Hop", "R&B", "House", "Techno", "Dubstep", "Corridos", "Regional Mexicano"],
      currentArtists: [
        "The Beatles", "PXNDX", "José Madero", "Paul McCartney", "Eric Clapton", 
        "Mac Miller", "George Harrison", "Skrillex", "Adriel Favela", 
        "Kanye West", "Gorillaz", "León Larregui"
      ],
      concerts: ["Truck Fest 2025 donde se presentó José Madero"],
      instruments: ["Guitarra electroacústica"],
      specialNote: "AMO A LOS BEATLES - eso siempre hay que destacarlo"
    },
    
    movies: {
      favorites: ["Scarface", "Casino", "Bichos"],
      currentSeries: ["Peacemaker", "Rick & Morty"],
      genres: ["Gangsters", "Sci-Fi"]
    },
    
    travel: {
      visited: ["Cancún", "Puerto Vallarta", "Ciudad de México", "Isla del Padre", "Veracruz"],
      planned: "Ojalá Perú...",
      bucketList: ["Perú", "Estados Unidos (beyond Texas)", "Inglaterra", "Japón"],
      style: "Mochilero"
    },
    
    hobbies: {
      sports: "Practico Artes Marciales, soy afiliado a la asociación de LIMA LAMA en la UANL FIME",
      gaming: "Jugador retirado de League of Legends",
      reading: ["Travesuras de la niña mala", "Pesadillas para cenar", "Hands on Machine Learning"],
      creativity: "Nada como una sesión de programación con freestyle de guitarra, o tocar simplemente canciones de mis artistas favoritos"
    }
  },
  
  context: {
    languages: ["Español", "Inglés", "Francés (bastante limitado)"],
    timezone: "Monterrey, Nuevo León (GMT-6)",
    uniqueness: "Me mama el exceso",
    goals: "Llegar a Microsoft o alguna big tech! A corto plazo: ser el mejor programador de Nuevo León",
    currentChallenge: "Dejar mi huella en Inverater.com",
    funFacts: ["Me encanta el café"],
    personality: {
      motivation: "Llegar a Microsoft o alguna big tech",
      communicationStyle: "Directo y apasionado"
    }
  }
};

// ===== HELPER FUNCTIONS =====

export const getRandomMusicArtist = () => {
  const artists = alexisData.casual.music.currentArtists;
  return artists[Math.floor(Math.random() * artists.length)];
};

export const getRandomTech = () => {
  const allTech = [
    ...alexisData.professional.stack.frontend,
    ...alexisData.professional.stack.backend,
    ...alexisData.professional.stack.languages
  ];
  return allTech[Math.floor(Math.random() * allTech.length)];
};

export const getRandomDestination = () => {
  const destinations = [...alexisData.casual.travel.visited, ...alexisData.casual.travel.bucketList];
  return destinations[Math.floor(Math.random() * destinations.length)];
};
