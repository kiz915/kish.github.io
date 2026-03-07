const APP_CONFIG = {
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
        resumeUrl: "/kish.github.io/assets/resume-kishore.pdf",
        profileImage: "/kish.github.io/assets/images/profile.jpg",
        heroBg: "/kish.github.io/assets/images/tech-bg.jpg",
        location: "Coimbatore, Tamil Nadu",
        college: "Sri Krishna College of Engineering and Technology",
        year: "1st Year",
        department: "Information Technology",
        batch: "2025 - 2028"
    },
    
    stats: [
        { label: "CERTIFICATIONS", value: 3, icon: "fa-certificate", suffix: "" },
        { label: "PROJECTS", value: 2, icon: "fa-code-branch", suffix: "" },
        { label: "LEARNING", value: 5, icon: "fa-book", suffix: "" },
        { label: "CONTRIBUTIONS", value: 8, icon: "fa-github", suffix: "" }
    ],

    contact: {
        instagram: {
            url: "https://www.instagram.com/kishore_amv/",
            icon: "fab fa-instagram",
            label: "Instagram",
            username: "@kishore_amv"
        },
        linkedin: {
            url: "https://www.linkedin.com/in/kishore-v-a363433a9/",
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
    
    skills: {
        programming: [
            { name: "Python", level: 65, category: "Programming", icon: "fab fa-python" },
            { name: "HTML5/CSS3", level: 70, category: "Programming", icon: "fab fa-html5" },
            { name: "C++ Basics", level: 45, category: "Programming", icon: "fas fa-code" }
        ],
        cloud: [
            { name: "AWS", level: 40, category: "Cloud", icon: "fab fa-aws" },
            { name: "Cloud Concepts", level: 50, category: "Cloud", icon: "fas fa-cloud" }
        ],
        tools: [
            { name: "Git/GitHub", level: 55, category: "Tools", icon: "fab fa-git-alt" },
            { name: "VS Code", level: 75, category: "Tools", icon: "fas fa-code" }
        ],
        creative: [
            { name: "AMV Creation", level: 60, category: "Creative", icon: "fas fa-film" },
            { name: "Video Editing", level: 55, category: "Creative", icon: "fas fa-video" }
        ]
    },
    
    projects: [
        {
            id: 1,
            title: "Personal Portfolio Website",
            description: "My first portfolio website built with HTML, CSS, and JavaScript.",
            longDescription: "A responsive portfolio website to showcase my skills and projects. Features include dark mode, smooth animations, and a contact form.",
            technologies: ["HTML5", "CSS3", "JavaScript", "Firebase"],
            image: "/kish.github.io/assets/images/project-portfolio.jpg",
            githubUrl: "https://github.com/kiz915/portfolio",
            liveUrl: "https://kiz915.github.io/kish.github.io",
            category: "Web Development",
            features: ["Responsive Design", "Dark Mode", "Contact Form"]
        },
        {
            id: 2,
            title: "Weather App",
            description: "Simple weather application using OpenWeather API.",
            longDescription: "A weather app that shows current weather conditions for any city. Built with JavaScript and integrated with OpenWeather API.",
            technologies: ["JavaScript", "API Integration", "CSS3"],
            image: "/kish.github.io/assets/images/project-weather.jpg",
            githubUrl: "https://github.com/kiz915/weather-app",
            liveUrl: "https://weather-app.demo",
            category: "Web Development",
            features: ["API Integration", "Search Function", "Responsive"]
        }
    ],
    
    certifications: [
        {
            id: 1,
            name: "AWS Certified Cloud Practitioner Essentials",
            issuer: "Amazon Web Services",
            date: "2025",
            credentialId: "AWS-CCP-12345",
            verificationUrl: "https://aws.amazon.com/verify",
            image: "/kish.github.io/assets/images/cert-aws.jpg",
            skills: ["Cloud Concepts", "AWS Services", "Security", "Pricing"],
            progress: 100
        },
        {
            id: 2,
            name: "Introduction to Python",
            issuer: "Coursera",
            date: "2025",
            credentialId: "N31A]T84N2CW",
            verificationUrl: "https://coursera.org/verify/N31A]T84N2CW",
            image: "/kish.github.io/assets/images/cert-python.jpg",
            skills: ["Python Basics", "Functions", "Data Structures", "File Handling"],
            progress: 100
        },
        {
            id: 3,
            name: "Google Cloud Digital Leader",
            issuer: "Google Cloud",
            date: "In Progress",
            credentialId: "In Progress",
            verificationUrl: "#",
            image: "/kish.github.io/assets/images/cert-gcp.jpg",
            skills: ["GCP", "Digital Transformation", "Data", "AI/ML"],
            progress: 60
        }
    ],
    
    education: [
        {
            degree: "B.Tech in Information Technology",
            institution: "Sri Krishna College of Engineering and Technology",
            period: "2025 - 2029",
            rollNo: "25IT161",
            description: "First-year student with Roll No: 25IT161 focusing on cloud computing and web development."
        },
        {
            degree: "Higher Secondary Education",
            institution: "Vailankanni Martic Higher Secondary School - Bagur",
            period: "2023 - 2025",
            description: "Computer Science stream."
        }
    ],
    
    blogPosts: [
        {
            id: 1,
            title: "My Journey to AWS Cloud Practitioner Certification",
            excerpt: "How I prepared for and passed the AWS Cloud Practitioner exam in my first semester.",
            content: "Full blog content about AWS certification journey...",
            category: "Cloud Computing",
            date: "2025-02-15",
            readTime: 4,
            image: "/kish.github.io/assets/images/blog/blog1.jpg",
            author: "KISHORE (25IT161)"
        },
        {
            id: 2,
            title: "Learning Python as a First-Year IT Student",
            excerpt: "Tips and resources for learning Python from scratch - my personal experience.",
            content: "Full blog content about learning Python...",
            category: "Programming",
            date: "2025-02-01",
            readTime: 5,
            image: "/kish.github.io/assets/images/blog/blog2.jpg",
            author: "KISHORE (25IT161)"
        }
    ],
    
    ui: {
        theme: {
            default: "dark",
            localStorageKey: "kishore-theme",
            colors: {
                primary: "#6366f1",
                secondary: "#8b5cf6",
                accent: "#ec4899"
            }
        },
        animations: {
            enabled: true,
            typingSpeed: 80,
            fadeDuration: 400
        }
    },
    
    analytics: {
        googleAnalyticsId: "G-XXXXXXXXXX",
        visitorCounter: true,
        trackEvents: true
    },
    
    seo: {
        title: "KISHORE - Information Technology Student",
        description: "First-year IT student at SKCET with Roll No: 25IT161, passionate about cloud computing and web development.",
        keywords: "KISHORE, 25IT161, IT Student, Cloud Computing, AWS, Python, SKCET",
        author: "KISHORE (25IT161)",
        ogImage: "/kish.github.io/assets/images/og-image.jpg"
    }
};

Object.freeze(APP_CONFIG);
