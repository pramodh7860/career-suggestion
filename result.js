document.addEventListener("DOMContentLoaded", () => {
  const careerTitleElement = document.getElementById("careerTitle")
  const careerDescriptionElement = document.getElementById("careerDescription")
  const skillTagsContainer = document.getElementById("skillTagsContainer")
  const youtubeCardsContainer = document.getElementById("youtubeCardsContainer")
  const saveResultBtn = document.getElementById("saveResultBtn")

  // --- Simulated Career Data (would come from AI/backend) ---
  const careersData = {
    "Software Engineer": {
      description:
        "A Software Engineer designs, develops, and maintains software applications. This role requires strong problem-solving skills, logical thinking, and continuous learning in various programming languages and technologies.",
      skills: [
        "Programming (Python, JavaScript, Java)",
        "Data Structures & Algorithms",
        "Problem Solving",
        "Version Control (Git)",
        "Debugging",
        "Continuous Learning",
      ],
      youtubeLinks: [
        {
          title: "Learn Python - Full Course for Beginners",
          url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
        {
          title: "JavaScript Crash Course For Beginners",
          url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
        {
          title: "Data Structures and Algorithms in Java",
          url: "https://www.youtube.com/watch?v=B31LgI4DGgE",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
      ],
    },
    "Graphic Designer": {
      description:
        "A Graphic Designer creates visual concepts, using computer software or by hand, to communicate ideas that inspire, inform, or captivate consumers. They work on logos, websites, advertisements, and more.",
      skills: [
        "Adobe Creative Suite (Photoshop, Illustrator)",
        "Typography",
        "Color Theory",
        "Layout Design",
        "Creativity",
        "Attention to Detail",
      ],
      youtubeLinks: [
        {
          title: "Graphic Design Basics: Core Principles",
          url: "https://www.youtube.com/watch?v=s_R_W_20000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
        {
          title: "Adobe Photoshop Tutorial for Beginners",
          url: "https://www.youtube.com/watch?v=Q_000000000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
        {
          title: "Illustrator for Beginners - Full Course",
          url: "https://www.youtube.com/watch?v=00000000000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
      ],
    },
    "Financial Analyst": {
      description:
        "A Financial Analyst provides guidance to businesses and individuals making investment decisions. They assess the performance of stocks, bonds, and other investments.",
      skills: [
        "Financial Modeling",
        "Data Analysis (Excel)",
        "Economics",
        "Communication",
        "Attention to Detail",
        "Market Research",
      ],
      youtubeLinks: [
        {
          title: "Financial Modeling & Valuation Course",
          url: "https://www.youtube.com/watch?v=F0000000000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
        {
          title: "Excel for Finance Professionals",
          url: "https://www.youtube.com/watch?v=E0000000000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
      ],
    },
    "Marketing Specialist": {
      description:
        "A Marketing Specialist develops and implements strategies to promote products or services. This involves market research, campaign creation, and analyzing consumer behavior.",
      skills: ["Digital Marketing", "Content Creation", "SEO/SEM", "Social Media Marketing", "Analytics", "Creativity"],
      youtubeLinks: [
        {
          title: "Digital Marketing Full Course",
          url: "https://www.youtube.com/watch?v=00000000000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
        {
          title: "SEO Tutorial for Beginners",
          url: "https://www.youtube.com/watch?v=10000000000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
      ],
    },
    "Data Scientist": {
      description:
        "A Data Scientist collects, analyzes, and interprets large datasets to help organizations make better decisions. They use statistical methods, machine learning, and programming.",
      skills: [
        "Python/R Programming",
        "Statistics",
        "Machine Learning",
        "Data Visualization",
        "SQL",
        "Problem Solving",
      ],
      youtubeLinks: [
        {
          title: "Data Science Full Course for Beginners",
          url: "https://www.youtube.com/watch?v=20000000000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
        {
          title: "Machine Learning Tutorial",
          url: "https://www.youtube.com/watch?v=30000000000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
      ],
    },
    "Unknown Path": {
      description:
        "It seems your answers didn't align perfectly with our predefined career paths. Don't worry! This is just a starting point. Explore different fields, learn new skills, and keep an open mind. Every journey is unique!",
      skills: ["Exploration", "Open-mindedness", "Curiosity", "Adaptability"],
      youtubeLinks: [
        {
          title: "How to Find Your Passion and Career",
          url: "https://www.youtube.com/watch?v=40000000000",
          thumbnail: "/placeholder.svg?height=180&width=320",
        },
      ],
    },
  }

  // --- Simple AI Logic (Mapping quiz answers to a career) ---
  function getSuggestedCareer(answers) {
    const answerCounts = {}
    answers.forEach((qa) => {
      const value = qa.answer
      answerCounts[value] = (answerCounts[value] || 0) + 1
    })

    // Simple mapping based on dominant answers
    if (answerCounts["technology"] > 0 || answerCounts["logical"] > 0 || answerCounts["data"] > 0) {
      if (answerCounts["problem-solving"] > 0 || answerCounts["learning"] > 0) {
        return "Software Engineer"
      }
      if (answerCounts["science"] > 0) {
        return "Data Scientist"
      }
    }
    if (answerCounts["arts"] > 0 || answerCounts["design"] > 0) {
      return "Graphic Designer"
    }
    if (answerCounts["business"] > 0 || answerCounts["earning"] > 0) {
      return "Financial Analyst"
    }
    if (answerCounts["communication"] > 0 || answerCounts["dynamic"] > 0) {
      return "Marketing Specialist"
    }

    return "Unknown Path" // Fallback
  }

  // --- Typing Animation Function ---
  function typeDescription(element, text, speed = 30) {
    let i = 0
    element.textContent = "" // Clear content before typing
    function typeChar() {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
        setTimeout(typeChar, speed)
      }
    }
    typeChar()
  }

  // --- Render Result ---
  function renderResult() {
    const quizResultsString = localStorage.getItem("quizResults")
    let quizResults = []
    try {
      quizResults = quizResultsString ? JSON.parse(quizResultsString) : []
    } catch (e) {
      console.error("Error parsing quiz results from localStorage:", e)
      quizResults = []
    }

    const suggestedCareerName = getSuggestedCareer(quizResults)
    const careerData = careersData[suggestedCareerName] || careersData["Unknown Path"]

    careerTitleElement.textContent = suggestedCareerName
    typeDescription(careerDescriptionElement, careerData.description)

    // Render Skill Tags
    skillTagsContainer.innerHTML = ""
    careerData.skills.forEach((skill) => {
      const skillTag = document.createElement("span")
      skillTag.classList.add("skill-tag")
      skillTag.textContent = skill
      skillTagsContainer.appendChild(skillTag)
    })

    // Render YouTube Cards
    youtubeCardsContainer.innerHTML = ""
    careerData.youtubeLinks.forEach((link) => {
      const youtubeCard = document.createElement("a")
      youtubeCard.classList.add("youtube-card")
      youtubeCard.href = link.url
      youtubeCard.target = "_blank" // Open in new tab
      youtubeCard.rel = "noopener noreferrer" // Security best practice

      youtubeCard.innerHTML = `
                <img src="${link.thumbnail}" alt="${link.title} Thumbnail" class="youtube-card-thumbnail">
                <div class="youtube-card-content">
                    <h4>${link.title}</h4>
                    <p>Learn more on YouTube</p>
                </div>
            `
      youtubeCardsContainer.appendChild(youtubeCard)
    })
  }

  // --- Save Result Functionality ---
  saveResultBtn.addEventListener("click", () => {
    const currentResult = {
      career: careerTitleElement.textContent,
      description: careerDescriptionElement.textContent, // Get the fully typed text
      timestamp: new Date().toISOString(),
    }

    let savedResults = []
    try {
      const existingResults = localStorage.getItem("savedCareerResults")
      savedResults = existingResults ? JSON.parse(existingResults) : []
    } catch (e) {
      console.error("Error parsing saved results from localStorage:", e)
    }

    // Add new result to the beginning of the array
    savedResults.unshift(currentResult)
    localStorage.setItem("savedCareerResults", JSON.stringify(savedResults))

    alert("Your career result has been saved to your Dashboard!")
    saveResultBtn.textContent = "Saved!"
    saveResultBtn.disabled = true
    saveResultBtn.style.opacity = 0.7
  })

  // Initial render of the result
  renderResult()
})
