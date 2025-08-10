"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Project = {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  image: string;
  link: string;
  github: string;
  status: "completed" | "in-progress" | "concept";
  featured: boolean;
  stats?: {
    users?: string;
    performance?: string;
    uptime?: string;
  };
};

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with real-time inventory and payment processing",
    longDescription: "A comprehensive e-commerce platform built with Next.js and Node.js, featuring real-time inventory management, Stripe payment integration, and advanced analytics dashboard.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Redis"],
    image: "/api/placeholder/600/400",
    link: "https://example.com",
    github: "https://github.com",
    status: "completed",
    featured: true,
    stats: {
      users: "10K+",
      performance: "98%",
      uptime: "99.9%"
    }
  },
  {
    id: 2,
    title: "AI Content Generator",
    description: "Machine learning platform for automated content creation and optimization",
    longDescription: "An AI-powered content generation platform that helps businesses create high-quality marketing content using advanced NLP models and optimization algorithms.",
    tags: ["Python", "TensorFlow", "React", "AWS", "Docker"],
    image: "/api/placeholder/600/400",
    link: "https://example.com",
    github: "https://github.com",
    status: "completed",
    featured: true,
    stats: {
      users: "5K+",
      performance: "95%"
    }
  },
  {
    id: 3,
    title: "Real-time Analytics Dashboard",
    description: "Live data visualization platform with custom metrics and reporting",
    longDescription: "A powerful analytics dashboard that processes millions of events in real-time, providing actionable insights through interactive visualizations and automated reporting.",
    tags: ["React", "D3.js", "WebSocket", "InfluxDB", "Kafka"],
    image: "/api/placeholder/600/400",
    link: "https://example.com",
    github: "https://github.com",
    status: "in-progress",
    featured: false
  },
  {
    id: 4,
    title: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication",
    longDescription: "A secure mobile banking application featuring biometric authentication, real-time transactions, budget tracking, and investment portfolio management.",
    tags: ["React Native", "Node.js", "MongoDB", "JWT", "Firebase"],
    image: "/api/placeholder/600/400",
    link: "https://example.com",
    github: "https://github.com",
    status: "completed",
    featured: true,
    stats: {
      users: "50K+",
      uptime: "99.8%"
    }
  },
  {
    id: 5,
    title: "IoT Monitoring System",
    description: "Industrial IoT platform for equipment monitoring and predictive maintenance",
    longDescription: "An enterprise IoT platform that monitors industrial equipment in real-time, predicts maintenance needs, and optimizes operational efficiency.",
    tags: ["Vue.js", "Python", "MQTT", "TimescaleDB", "Kubernetes"],
    image: "/api/placeholder/600/400",
    link: "https://example.com",
    github: "https://github.com",
    status: "concept",
    featured: false
  },
  {
    id: 6,
    title: "Social Learning Platform",
    description: "Interactive learning management system with social features",
    longDescription: "A modern LMS that combines traditional learning with social networking features, enabling collaborative education and peer-to-peer knowledge sharing.",
    tags: ["Next.js", "GraphQL", "PostgreSQL", "WebRTC", "AWS"],
    image: "/api/placeholder/600/400",
    link: "https://example.com",
    github: "https://github.com",
    status: "completed",
    featured: false
  }
];

export default function Showcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "featured" | "completed" | "in-progress">("all");
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    if (filter === "featured") return project.featured;
    return project.status === filter;
  });

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "completed": return "from-green-500/20 to-emerald-500/10 border-green-500/30";
      case "in-progress": return "from-yellow-500/20 to-orange-500/10 border-yellow-500/30";
      case "concept": return "from-purple-500/20 to-violet-500/10 border-purple-500/30";
      default: return "from-gray-500/20 to-gray-400/10 border-gray-500/30";
    }
  };

  const getStatusText = (status: Project["status"]) => {
    switch (status) {
      case "completed": return "Live";
      case "in-progress": return "In Development";
      case "concept": return "Concept";
      default: return "";
    }
  };

  return (
    <section id="projects" className="relative min-h-screen bg-gradient-to-b from-black via-gray-950 to-black py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 mb-6">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-cyan-300">Featured Work</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
              Projects &amp; Solutions
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A showcase of full-stack applications, from e-commerce platforms to AI-powered tools.
            Each project represents a unique challenge solved with modern technologies.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { key: "all", label: "All Projects", count: projects.length },
            { key: "featured", label: "Featured", count: projects.filter(p => p.featured).length },
            { key: "completed", label: "Live", count: projects.filter(p => p.status === "completed").length },
            { key: "in-progress", label: "In Development", count: projects.filter(p => p.status === "in-progress").length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                filter === key
                  ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-300"
              }`}
            >
              {label} 
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs">
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 cursor-pointer ${
                project.featured ? "lg:col-span-2 lg:row-span-1" : ""
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isLoading ? "none" : "slideUp 0.6s ease-out forwards"
              }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Status Badge */}
              <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </div>

              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay with Quick Actions */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/90 text-gray-900 rounded-full font-medium hover:bg-white transition-colors">
                      View Live
                    </button>
                    <button className="px-4 py-2 bg-black/80 text-white border border-white/20 rounded-full font-medium hover:bg-black transition-colors">
                      Source Code
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-medium text-yellow-300">Featured</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Stats for featured projects */}
                {project.featured && project.stats && (
                  <div className="flex gap-4 mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    {project.stats.users && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-400">{project.stats.users}</div>
                        <div className="text-xs text-gray-500">Users</div>
                      </div>
                    )}
                    {project.stats.performance && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">{project.stats.performance}</div>
                        <div className="text-xs text-gray-500">Performance</div>
                      </div>
                    )}
                    {project.stats.uptime && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-violet-400">{project.stats.uptime}</div>
                        <div className="text-xs text-gray-500">Uptime</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, project.featured ? 5 : 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium text-gray-300 bg-white/10 rounded-full border border-white/10 hover:bg-white/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > (project.featured ? 5 : 3) && (
                    <span className="px-3 py-1 text-xs font-medium text-gray-400 bg-white/5 rounded-full border border-white/5">
                      +{project.tags.length - (project.featured ? 5 : 3)} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button 
                    className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                  >
                    Learn more
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  
                  <div className="flex gap-2">
                    <a
                      href={project.link}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <a
                      href={project.github}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-6 p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to start your project?
              </h3>
              <p className="text-gray-400">
                Let's discuss your ideas and build something amazing together.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="#contact"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-full hover:from-cyan-400 hover:to-violet-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
              >
                Get In Touch
              </a>
              <a
                href="#services"
                className="px-8 py-3 border border-white/20 text-gray-300 font-semibold rounded-full hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/20 rounded-2xl backdrop-blur-md">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h2>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedProject.status)}`}>
                    {getStatusText(selectedProject.status)}
                  </div>
                </div>
              </div>

              <div className="relative aspect-video mb-6 rounded-xl overflow-hidden">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {selectedProject.longDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm font-medium text-gray-300 bg-white/10 rounded-full border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProject.stats && (
                  <div>
                    <h4 className="text-white font-semibold mb-3">Project Stats</h4>
                    <div className="space-y-2">
                      {selectedProject.stats.users && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Users:</span>
                          <span className="text-cyan-400 font-medium">{selectedProject.stats.users}</span>
                        </div>
                      )}
                      {selectedProject.stats.performance && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Performance:</span>
                          <span className="text-green-400 font-medium">{selectedProject.stats.performance}</span>
                        </div>
                      )}
                      {selectedProject.stats.uptime && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Uptime:</span>
                          <span className="text-violet-400 font-medium">{selectedProject.stats.uptime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <a
                  href={selectedProject.link}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-full text-center hover:from-cyan-400 hover:to-violet-400 transition-all duration-300"
                >
                  View Live Project
                </a>
                <a
                  href={selectedProject.github}
                  className="flex-1 px-6 py-3 border border-white/20 text-gray-300 font-semibold rounded-full text-center hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  View Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}