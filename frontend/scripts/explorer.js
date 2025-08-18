document.addEventListener("DOMContentLoaded", () => {
  const careerSearchInput = document.getElementById("careerSearch")
  const careerCardsGrid = document.getElementById("careerCardsGrid")
  const noResultsMessage = document.getElementById("noResultsMessage")

  // --- All Career Data (Expanded from result.js for explorer) ---
  const allCareersData = [
    {
      title: "Software Engineer",
      shortDescription: "Designs, develops, and maintains software applications.",
      fullDescription:
        "A Software Engineer designs, develops, and maintains software applications across various platforms. This role requires strong problem-solving skills, logical thinking, and continuous learning in various programming languages and technologies like Python, JavaScript, Java, and C++.",
      skills: [
        "Programming Languages (Python, JavaScript, Java, C++)",
        "Data Structures & Algorithms",
        "Version Control (Git)",
        "Database Management",
        "Software Development Lifecycle",
        "Problem Solving",
        "Team Collaboration",
        "Continuous Learning"
      ]
    },
    {
      title: "Graphic Designer",
      shortDescription: "Creates visual concepts for branding, web, and print.",
      fullDescription:
        "A Graphic Designer creates visual concepts, using computer software or by hand, to communicate ideas that inspire, inform, or captivate consumers. They work on logos, websites, advertisements, magazines, and more, utilizing tools like Adobe Creative Suite.",
      skills: [
        "Adobe Creative Suite (Photoshop, Illustrator, InDesign)",
        "Typography",
        "Color Theory",
        "Layout Design",
        "Digital Illustration",
        "Brand Identity Design",
        "Print Design",
        "Web Design Fundamentals"
      ]
    },
    {
      title: "Financial Analyst",
      shortDescription: "Provides guidance on investment decisions and financial planning.",
      fullDescription:
        "A Financial Analyst provides guidance to businesses and individuals making investment decisions. They assess the performance of stocks, bonds, and other investments, analyze financial data, and forecast business trends.",
      skills: [
        "Financial Modeling",
        "Excel & Financial Software",
        "Statistical Analysis",
        "Risk Assessment",
        "Investment Analysis",
        "Financial Reporting",
        "Market Research",
        "Regulatory Compliance"
      ]
    },
    {
      title: "Marketing Specialist",
      shortDescription: "Develops and implements strategies to promote products/services.",
      fullDescription:
        "A Marketing Specialist develops and implements strategies to promote products or services. This involves market research, campaign creation, digital marketing, social media management, and analyzing consumer behavior to drive sales and brand awareness.",
      skills: [
        "Digital Marketing",
        "Social Media Management",
        "Content Creation",
        "SEO/SEM",
        "Email Marketing",
        "Analytics & Data Analysis",
        "Campaign Management",
        "Customer Research"
      ]
    },
    {
      title: "Data Scientist",
      shortDescription: "Analyzes large datasets to extract insights and build models.",
      fullDescription:
        "A Data Scientist collects, analyzes, and interprets large datasets to help organizations make better decisions. They use statistical methods, machine learning algorithms, and programming languages like Python and R to uncover patterns and predict future outcomes.",
      skills: [
        "Python & R Programming",
        "Machine Learning",
        "Statistical Analysis",
        "Data Visualization",
        "SQL & Database Management",
        "Big Data Technologies",
        "Predictive Modeling",
        "Business Intelligence"
      ]
    },
    {
      title: "Product Manager",
      shortDescription: "Oversees the development and strategy of a product.",
      fullDescription:
        "A Product Manager guides the success of a product and leads the cross-functional team that is responsible for improving it. They define the product vision, strategy, roadmap, and features based on market research and customer needs.",
      skills: [
        "Product Strategy",
        "Market Research",
        "User Experience Design",
        "Agile/Scrum Methodologies",
        "Data Analysis",
        "Stakeholder Management",
        "Roadmap Planning",
        "Customer Development"
      ]
    },
    {
      title: "UX/UI Designer",
      shortDescription: "Focuses on user experience and interface design.",
      fullDescription:
        "A UX/UI Designer focuses on creating intuitive, enjoyable, and aesthetically pleasing user experiences for digital products. They conduct user research, create wireframes and prototypes, and design the visual interface.",
      skills: [
        "User Research",
        "Wireframing & Prototyping",
        "Adobe XD/Figma/Sketch",
        "Information Architecture",
        "Usability Testing",
        "Visual Design",
        "Interaction Design",
        "Design Systems"
      ]
    },
    {
      title: "Cybersecurity Analyst",
      shortDescription: "Protects computer systems and networks from threats.",
      fullDescription:
        "A Cybersecurity Analyst protects an organization's computer systems and networks from cyber threats. They monitor for breaches, implement security measures, respond to incidents, and stay updated on the latest security vulnerabilities.",
      skills: [
        "Network Security",
        "Security Tools & Technologies",
        "Incident Response",
        "Vulnerability Assessment",
        "Security Compliance",
        "Threat Intelligence",
        "Penetration Testing",
        "Security Architecture"
      ]
    },
    {
      title: "Human Resources Manager",
      shortDescription: "Manages employee relations, recruitment, and company culture.",
      fullDescription:
        "A Human Resources Manager oversees all aspects of employee relations, including recruitment, onboarding, training, compensation, benefits, and maintaining a positive company culture. They ensure compliance with labor laws and support employee well-being.",
      skills: [
        "Recruitment & Talent Acquisition",
        "Employee Relations",
        "Performance Management",
        "HRIS Systems",
        "Labor Law Compliance",
        "Training & Development",
        "Compensation & Benefits",
        "Organizational Development"
      ]
    },
    {
      title: "Content Writer",
      shortDescription: "Creates engaging written content for various platforms.",
      fullDescription:
        "A Content Writer produces clear, concise, and engaging written material for websites, blogs, marketing campaigns, and other digital platforms. They research topics, optimize content for SEO, and adapt their writing style to different audiences.",
      skills: [
        "Content Writing",
        "SEO Optimization",
        "Copywriting",
        "Research Skills",
        "Editing & Proofreading",
        "Content Strategy",
        "Social Media Writing",
        "Brand Voice Development"
      ]
    },
  ]

  // Create modal for skills display
  function createSkillsModal() {
    const modal = document.createElement('div')
    modal.id = 'skillsModal'
    modal.className = 'skills-modal'
    modal.innerHTML = `
      <div class="skills-modal-content">
        <div class="skills-modal-header">
          <h3 id="modalCareerTitle"></h3>
          <button class="close-modal-btn">&times;</button>
        </div>
        <div class="skills-modal-body">
          <h4>Required Skills:</h4>
          <div id="skillsList" class="skills-list"></div>
        </div>
      </div>
    `
    document.body.appendChild(modal)

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal-btn')
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none'
    })

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none'
      }
    })

    return modal
  }

  // Show skills modal
  function showSkillsModal(career) {
    const modal = document.getElementById('skillsModal') || createSkillsModal()
    const modalTitle = modal.querySelector('#modalCareerTitle')
    const skillsList = modal.querySelector('#skillsList')

    modalTitle.textContent = career.title
    skillsList.innerHTML = career.skills.map(skill => 
      `<div class="skill-item">${skill}</div>`
    ).join('')

    modal.style.display = 'flex'
  }

  function renderCareerCards(careersToRender) {
    careerCardsGrid.innerHTML = "" // Clear existing cards

    if (careersToRender.length === 0) {
      noResultsMessage.style.display = "block"
    } else {
      noResultsMessage.style.display = "none"
      careersToRender.forEach((career, index) => {
        const cardWrapper = document.createElement("div")
        cardWrapper.classList.add("career-card-wrapper", "animate-in")
        cardWrapper.style.animationDelay = `${index * 0.08}s` // Staggered load

        cardWrapper.innerHTML = `
                    <div class="career-card">
                        <div class="career-card-front">
                            <h4>${career.title}</h4>
                            <p>${career.shortDescription}</p>
                            <button class="view-skills-btn">View Skills</button>
                        </div>
                        <div class="career-card-back">
                            <h4>${career.title}</h4>
                            <p>${career.fullDescription}</p>
                            <button class="view-skills-btn">View Skills</button>
                        </div>
                    </div>
                `
        
        // Add click event to show skills
        const viewSkillsBtns = cardWrapper.querySelectorAll('.view-skills-btn')
        viewSkillsBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation() // Prevent card flip
            showSkillsModal(career)
          })
        })

        careerCardsGrid.appendChild(cardWrapper)
      })
    }
  }

  function filterCareers() {
    const searchTerm = careerSearchInput.value.toLowerCase().trim()
    const filteredCareers = allCareersData.filter(
      (career) =>
        career.title.toLowerCase().includes(searchTerm) ||
        career.shortDescription.toLowerCase().includes(searchTerm) ||
        career.fullDescription.toLowerCase().includes(searchTerm),
    )
    renderCareerCards(filteredCareers)
  }

  // Initial render of all careers
  renderCareerCards(allCareersData)

  // Real-time filtering on input
  careerSearchInput.addEventListener("input", filterCareers)
})
