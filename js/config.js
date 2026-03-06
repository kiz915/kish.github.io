/**
 * CONFIGURATION FILE - KISHORE Information Technology Student
 * Batch 2025-2028 | Sri Krishna College of Engineering and Technology
 * Roll No: 25IT161
 */

const APP_CONFIG = {
    // Owner Information
    owner: {
        name: "KISHORE",
        fullName: "Kishore V",
        title: "Information Technology Student",
        rollNo: "25IT161",
        dynamicTitles: [
            "IT Student",
            "Cloud Learner", 
            "Web Developer",
            "Tech Enthusiast",
            "AMV Creator"
        ],
        bio: "First-year Information Technology student at SKCET (Roll No: 25IT161) passionate about cloud computing, web development, and anime music video creation.",
        shortBio: "IT Student at SKCET | Roll No: 25IT161 | Learning Cloud & Web Dev | AMV Creator",
        resumeUrl: "/assets/resume-kishore.pdf",
        profileImage: "/assets/images/kishore-profile.jpg",
        heroBg: "/assets/images/tech-bg.jpg",
        location: "Coimbatore, Tamil Nadu",
        college: "Sri Krishna College of Engineering and Technology",
        year: "1st Year",
        department: "Information Technology",
        batch: "2025 - 2028"
    },
    
    // Statistics Counters
    stats: [
        { label: "CERTIFICATIONS", value: 3, icon: "fa-certificate", suffix: "" },
        { label: "PROJECTS", value: 2, icon: "fa-code-branch", suffix: "" },
        { label: "LEARNING", value: 5, icon: "fa-book", suffix: "" },
        { label: "CONTRIBUTIONS", value: 8, icon: "fa-github", suffix: "" }
    ],

    // Social Media & Contact Links
    contact: {
        instagram: {
            url: "https://www.instagram.com/kishore_amv/",
            icon: "fab fa-instagram",
            label: "Instagram",
            username: "@kishore_amv"
        },
        linkedin: {
            url: "https://www.linkedin.com/in/kishore-v-a363433a9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
            icon: "fab fa-linkedin-in",
            label: "LinkedIn",
            username: "kishore-v-a363433a9"
        },
        github: {
            url: "https://github.com/kiz915",
            icon: "fab fa-github",
            label: "GitHub",
            username: "kiz915"
        },
        whatsapp: {
            url: "https://wa.me/916374372312",
            icon: "fab fa-whatsapp",
            label: "WhatsApp",
            username: "+91 63743 72312"
        },
        email: {
            url: "mailto:kishorevk40@gmail.com",
            icon: "far fa-envelope",
            label: "Email",
            username: "kishorevk40@gmail.com"
        },
        phone: {
            url: "tel:+916374372312",
            icon: "fas fa-phone-alt",
            label: "Phone",
            username: "+91 63743 72312"
        }
    },
    
    // Skills Configuration
    skills: {
        programming: [
            { name: "Python", level: 65, category: "Programming", icon: "fab fa-python" },
            { name: "JavaScript", level: 50, category: "Programming", icon: "fab fa-js" },
            { name: "HTML5/CSS3", level: 70, category: "Programming", icon: "fab fa-html5" },
            { name: "C++ Basics", level: 45, category: "Programming", icon: "fas fa-code" }
        ],
        cloud: [
            { name: "AWS", level: 40, category: "Cloud", icon: "fab fa-aws" },
            { name: "Firebase", level: 35, category: "Cloud", icon: "fas fa-fire" },
            { name: "Cloud Concepts", level: 50, category: "Cloud", icon: "fas fa-cloud" }
        ],
        tools: [
            { name: "Git/GitHub", level: 55, category: "Tools", icon: "fab fa-git-alt" },
            { name: "VS Code", level: 75, category: "Tools", icon: "fas fa-code" },
            { name: "Figma Basics", level: 30, category: "Tools", icon: "fab fa-figma" },
            { name: "Linux Basics", level: 25, category: "Tools", icon: "fab fa-linux" }
        ],
        creative: [
            { name: "AMV Creation", level: 60, category: "Creative", icon: "fas fa-film" },
            { name: "Video Editing", level: 55, category: "Creative", icon: "fas fa-video" }
        ]
    },
    
    // Projects Data
    projects: [
        {
            id: 1,
            title: "Personal Portfolio Website",
            description: "My first portfolio website built with HTML, CSS, and JavaScript.",
            longDescription: "A responsive portfolio website to showcase my skills and projects. Features include dark mode, smooth animations, and a contact form. This project helped me learn modern CSS techniques and JavaScript interactivity.",
            technologies: ["HTML5", "CSS3", "JavaScript", "Firebase"],
            image: "/assets/images/project-portfolio.jpg",
            githubUrl: "https://github.com/kiz915/portfolio",
            liveUrl: "https://kishore.dev",
            category: "Web Development",
            features: ["Responsive Design", "Dark Mode", "Contact Form", "Smooth Animations"]
        },
        {
            id: 2,
            title: "Weather App",
            description: "Simple weather application using OpenWeather API.",
            longDescription: "A weather app that shows current weather conditions for any city. Built with JavaScript and integrated with OpenWeather API. Learned about API integration, async/await, and error handling.",
            technologies: ["JavaScript", "API Integration", "CSS3"],
            image: "/assets/images/project-weather.jpg",
            githubUrl: "https://github.com/kiz915/weather-app",
            liveUrl: "https://weather-app.demo",
            category: "Web Development",
            features: ["API Integration", "Search Function", "Responsive", "Error Handling"]
        }
    ],
    
    // Certifications
    certifications: [
        {
            id: 1,
            name: "AWS Certified Cloud Practitioner Essentials",
            issuer: "Amazon Web Services",
            date: "2025",
            credentialId: "AWS-CCP-12345",
            verificationUrl: "https://aws.amazon.com/verify",
            image: "/assets/images/cert-aws.jpg",
            skills: ["Cloud Concepts", "AWS Services", "Security", "Pricing"],
            progress: 100,
            description: "Completed AWS Cloud Practitioner certification covering cloud fundamentals, AWS core services, security, and pricing models."
        },
        {
            id: 2,
            name: "Introduction to Python",
            issuer: "Coursera",
            date: "2025",
            credentialId: "N31A]T84N2CW",
            verificationUrl: "https://coursera.org/verify/N31A]T84N2CW",
            image: "/assets/images/cert-python.jpg",
            skills: ["Python Basics", "Functions", "Data Structures", "File Handling"],
            progress: 100,
            description: "Completed Python programming course covering fundamentals, functions, data structures, and file operations."
        },
        {
            id: 3,
            name: "Google Cloud Digital Leader",
            issuer: "Google Cloud",
            date: "In Progress",
            credentialId: "In Progress",
            verificationUrl: "#",
            image: "/assets/images/cert-gcp.jpg",
            skills: ["GCP", "Digital Transformation", "Data", "AI/ML"],
            progress: 60,
            description: "Currently pursuing Google Cloud Digital Leader certification. 60% complete with focus on cloud concepts and digital transformation."
        }
    ],
    
    // Education Timeline
    education: [
        {
            degree: "B.Tech in Information Technology",
            institution: "Sri Krishna College of Engineering and Technology",
            period: "2025 - 2028",
            rollNo: "25IT161",
            description: "First-year student with Roll No: 25IT161 focusing on cloud computing, web development, and programming fundamentals."
        },
        {
            degree: "Higher Secondary Education",
            institution: "Kendriya Vidyalaya",
            period: "2023 - 2025",
            description: "Computer Science stream with focus on mathematics and programming basics."
        }
    ],
    
    // Blog Posts
    blogPosts: [
        {
            id: 1,
            title: "My Journey to AWS Cloud Practitioner Certification",
            excerpt: "How I prepared for and passed the AWS Cloud Practitioner exam in my first semester.",
            content: "Full blog content about AWS certification journey, study resources, exam tips, and experience...",
            category: "Cloud Computing",
            date: "2025-02-15",
            readTime: 4,
            image: "/assets/images/blog/aws-journey.jpg",
            author: "KISHORE (25IT161)"
        },
        {
            id: 2,
            title: "Learning Python as a First-Year IT Student",
            excerpt: "Tips and resources for learning Python from scratch - my personal experience.",
            content: "Full blog content about learning Python, projects built, and resources used...",
            category: "Programming",
            date: "2025-02-01",
            readTime: 5,
            image: "/assets/images/blog/python-learning.jpg",
            author: "KISHORE (25IT161)"
        },
        {
            id: 3,
            title: "Building My First Portfolio Website",
            excerpt: "A step-by-step guide to creating a modern portfolio with HTML, CSS, and JavaScript.",
            content: "Full blog content about building portfolio, challenges faced, and lessons learned...",
            category: "Web Development",
            date: "2025-01-20",
            readTime: 6,
            image: "/assets/images/blog/portfolio-build.jpg",
            author: "KISHORE (25IT161)"
        }
    ],
    
    // UI Configuration
    ui: {
        theme: {
            default: "dark",
            localStorageKey: "kishore-theme",
            colors: {
                primary: "#6366f1",
                secondary: "#8b5cf6",
                accent: "#ec4899",
                success: "#10b981",
                warning: "#f59e0b",
                error: "#ef4444"
            }
        },
        animations: {
            enabled: true,
            typingSpeed: 80,
            fadeDuration: 400,
            staggerDelay: 100
        }
    },
    
    // Analytics Configuration
    analytics: {
        googleAnalyticsId: "G-XXXXXXXXXX", // Replace with your GA ID if you have one
        visitorCounter: true,
        trackEvents: true,
        trackPageViews: true
    },
    
    // SEO Configuration
    seo: {
        title: "KISHORE (25IT161) - Information Technology Student | Cloud Enthusiast | AMV Creator",
        description: "First-year IT student at SKCET with Roll No: 25IT161, passionate about cloud computing, web development, and anime music video creation. AWS Certified, Python developer.",
        keywords: "KISHORE, 25IT161, IT Student, Cloud Computing, AWS, Python, Web Development, SKCET, AMV Creator, kiz915",
        author: "KISHORE (25IT161)",
        ogImage: "/assets/images/og-image.jpg"
    }
};

// Freeze configuration to prevent modifications
Object.freeze(APP_CONFIG);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
