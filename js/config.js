const APP_CONFIG = {
    owner: {
        name: "KISHORE",
        fullName: "Kishore V",
        rollNo: "25IT161",
        title: "Information Technology Student",
        bio: "First-year IT student at SKCET (25IT161)",
        shortBio: "IT Student | 25IT161 | SKCET"
    },
    
    stats: [
        { label: "CERTIFICATIONS", value: 4, icon: "fa-certificate" },  // 👈 UPDATED
        { label: "PROJECTS", value: 3, icon: "fa-code-branch" },        // 👈 UPDATED
        { label: "LEARNING", value: 6, icon: "fa-book" },               // 👈 UPDATED
        { label: "CONTRIBUTIONS", value: 8, icon: "fa-github" }
    ],

    contact: {
        instagram: { url: "https://instagram.com/kishore_amv", icon: "fab fa-instagram", label: "Instagram" },
        linkedin: { url: "https://linkedin.com/in/kishore-v-a363433a9", icon: "fab fa-linkedin", label: "LinkedIn" },
        github: { url: "https://github.com/kiz915", icon: "fab fa-github", label: "GitHub" },
        whatsapp: { url: "https://wa.me/916374372312", icon: "fab fa-whatsapp", label: "WhatsApp" },
        email: { url: "mailto:kishorevk40@gmail.com", icon: "fas fa-envelope", label: "Email" },
        phone: { url: "tel:+916374372312", icon: "fas fa-phone", label: "Phone" }
    },
    
    skills: {
        programming: [
            { name: "Python", level: 65, icon: "fab fa-python" },
            { name: "JavaScript", level: 50, icon: "fab fa-js" },
            { name: "HTML/CSS", level: 70, icon: "fab fa-html5" }
        ],
        data: [
            { name: "Data Analysis", level: 45, icon: "fas fa-chart-bar" },
            { name: "Excel", level: 60, icon: "fas fa-table" },
            { name: "SQL", level: 40, icon: "fas fa-database" }
        ],
        cloud: [  // 👈 ADDED BACK
            { name: "AWS", level: 40, icon: "fab fa-aws" }
        ]
    },
    
    projects: [
        {
            title: "Portfolio Website",
            description: "Personal portfolio with HTML, CSS, JS",
            technologies: ["HTML", "CSS", "JS"],
            githubUrl: "https://github.com/kiz915/portfolio",
            category: "Web Dev"
        },
        {
            title: "Sales Data Analysis",
            description: "Analysis of sales trends using Python and Excel",
            technologies: ["Python", "Excel", "Pandas"],
            githubUrl: "#",
            category: "Data Analysis"
        },
        {
            title: "AWS Learning Projects",  // 👈 ADDED
            description: "Hands-on projects with AWS services (EC2, S3, Lambda)",  // 👈 ADDED
            technologies: ["AWS", "Cloud"],  // 👈 ADDED
            githubUrl: "#",  // 👈 ADDED
            category: "Cloud Computing"  // 👈 ADDED
        }
    ],
    
    certifications: [
        { name: "AWS Cloud Practitioner", issuer: "AWS", date: "2025", progress: 100 },
        { name: "Python Basics", issuer: "Coursera", date: "2025", progress: 100 },
        { name: "Data Analysis with Python", issuer: "IBM", date: "In Progress", progress: 50 },
        { name: "Excel Skills", issuer: "Microsoft", date: "In Progress", progress: 40 }
    ],
    
    education: [
        { degree: "B.Tech IT", institution: "SKCET", period: "2025-2028", rollNo: "25IT161" }
    ],
    
    // UI Configuration
    ui: {
        theme: {
            default: "light",
            localStorageKey: "kishore-theme"
        }
    }
};

Object.freeze(APP_CONFIG);
