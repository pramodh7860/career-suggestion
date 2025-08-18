document.addEventListener("DOMContentLoaded", () => {
  const progressBarFill = document.getElementById("progressBarFill")
  const questionCounter = document.getElementById("questionCounter")
  const questionText = document.getElementById("questionText")
  const answerCardsContainer = document.getElementById("answerCardsContainer")
  const quizContent = document.getElementById("quizContent")

  let currentQuestionIndex = 0
  const userAnswers = []
  let isAnimating = false // Flag to prevent multiple clicks during animation
  const quizStartTime = Date.now()

  const quizQuestions = [
    {
      question: "What kind of work environment do you prefer?",
      answers: [
        { text: "Structured and predictable", value: "structured" },
        { text: "Dynamic and fast-paced", value: "dynamic" },
        { text: "Collaborative and team-oriented", value: "collaborative" },
        { text: "Independent and flexible", value: "independent" },
      ],
    },
    {
      question: "Which subject interests you the most?",
      answers: [
        { text: "Science and research", value: "science" },
        { text: "Arts and creativity", value: "arts" },
        { text: "Business and finance", value: "business" },
        { text: "Technology and innovation", value: "technology" },
      ],
    },
    {
      question: "How do you prefer to solve problems?",
      answers: [
        { text: "Through logical analysis", value: "logical" },
        { text: "By experimenting and iterating", value: "experimenting" },
        { text: "By discussing with others", value: "discussing" },
        { text: "By trusting my intuition", value: "intuition" },
      ],
    },
    {
      question: "What motivates you most in a job?",
      answers: [
        { text: "Making a significant impact", value: "impact" },
        { text: "Continuous learning and growth", value: "learning" },
        { text: "High earning potential", value: "earning" },
        { text: "Work-life balance", value: "balance" },
      ],
    },
    {
      question: "Which skill do you enjoy using most?",
      answers: [
        { text: "Communication and persuasion", value: "communication" },
        { text: "Data analysis and interpretation", value: "data" },
        { text: "Design and visual creation", value: "design" },
        { text: "Problem-solving and critical thinking", value: "problem-solving" },
      ],
    },
  ]

  function updateProgressBar() {
    const progress = (currentQuestionIndex / quizQuestions.length) * 100
    progressBarFill.style.width = `${progress}%`
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`
  }

  function renderQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
      // Quiz finished
      showResults()
      return
    }

    isAnimating = true // Set flag to prevent interaction during animation

    const currentQuestion = quizQuestions[currentQuestionIndex]

    // Animate out current content (if any)
    quizContent.style.opacity = 0
    quizContent.style.transform = "translateY(20px)"

    setTimeout(() => {
      questionText.textContent = currentQuestion.question
      answerCardsContainer.innerHTML = "" // Clear previous answers

      currentQuestion.answers.forEach((answer, index) => {
        const card = document.createElement("div")
        card.classList.add("answer-card")
        card.textContent = answer.text
        card.dataset.value = answer.value
        card.dataset.index = index // For staggered animation delay

        card.addEventListener("click", () => selectAnswer(card, answer.value))
        answerCardsContainer.appendChild(card)

        // Apply staggered animation-in
        setTimeout(() => {
          card.classList.add("animate-in")
        }, index * 100) // 100ms delay between cards
      })

      // Animate in new content
      quizContent.style.opacity = 1
      quizContent.style.transform = "translateY(0)"
      isAnimating = false // Reset flag after animation
    }, 300) // Wait for fade-out to complete before changing content
    updateProgressBar()
  }

  function selectAnswer(selectedCard, answerValue) {
    if (isAnimating) return // Prevent multiple clicks

    isAnimating = true // Set flag to prevent further interaction

    // Remove 'selected' from any previously selected card
    const previouslySelected = answerCardsContainer.querySelector(".answer-card.selected")
    if (previouslySelected) {
      previouslySelected.classList.remove("selected")
    }

    // Add 'selected' class to the clicked card
    selectedCard.classList.add("selected")
    userAnswers.push({
      question: quizQuestions[currentQuestionIndex].question,
      answer: answerValue,
    })

    // Automatic transition after a short delay
    setTimeout(() => {
      // Animate out all answer cards
      const allAnswerCards = answerCardsContainer.querySelectorAll(".answer-card")
      allAnswerCards.forEach((card) => {
        card.classList.add("animate-out")
      })

      // Wait for cards to animate out before moving to next question
      setTimeout(() => {
        currentQuestionIndex++
        renderQuestion()
      }, 300) // Match fadeOut animation duration
    }, 800) // Delay before moving to next question
  }

  function mapAnswerToCategoryAndScore(questionIndex, answerValue) {
    // Map simple quiz answers to backend categories and numeric scores (1-5)
    // Defaults
    let category = 'practical'
    let score = '4'

    switch (questionIndex) {
      case 0: // Work environment
        if (answerValue === 'structured') { category = 'practical'; score = '5' }
        else if (answerValue === 'dynamic') { category = 'leadership'; score = '5' }
        else if (answerValue === 'collaborative') { category = 'social'; score = '5' }
        else if (answerValue === 'independent') { category = 'analytical'; score = '5' }
        break
      case 1: // Subject interest
        if (answerValue === 'science') { category = 'analytical'; score = '5' }
        else if (answerValue === 'arts') { category = 'creative'; score = '5' }
        else if (answerValue === 'business') { category = 'practical'; score = '5' }
        else if (answerValue === 'technology') { category = 'technical'; score = '5' }
        break
      case 2: // Problem solving style
        if (answerValue === 'logical') { category = 'analytical'; score = '5' }
        else if (answerValue === 'experimenting') { category = 'technical'; score = '5' }
        else if (answerValue === 'discussing') { category = 'social'; score = '5' }
        else if (answerValue === 'intuition') { category = 'creative'; score = '5' }
        break
      case 3: // Motivation
        if (answerValue === 'impact') { category = 'leadership'; score = '5' }
        else if (answerValue === 'learning') { category = 'analytical'; score = '5' }
        else if (answerValue === 'earning') { category = 'practical'; score = '5' }
        else if (answerValue === 'balance') { category = 'social'; score = '5' }
        break
      case 4: // Enjoyed skill
        if (answerValue === 'communication') { category = 'social'; score = '5' }
        else if (answerValue === 'data') { category = 'analytical'; score = '5' }
        else if (answerValue === 'design') { category = 'creative'; score = '5' }
        else if (answerValue === 'problem-solving') { category = 'technical'; score = '5' }
        break
    }

    return { category, score }
  }

  async function showResults() {
    // Save results locally for the result page typing UI
    localStorage.setItem("quizResults", JSON.stringify(userAnswers))
    console.log("Quiz Finished! User Answers:", userAnswers)

    // Build payload for backend submission
    const answersForApi = userAnswers.map((ua, idx) => {
      const { category, score } = mapAnswerToCategoryAndScore(idx, ua.answer)
      return {
        questionId: `q${idx + 1}`,
        question: quizQuestions[idx]?.question || ua.question || `Question ${idx + 1}`,
        answer: String(score),
        category
      }
    })

    const completionTimeSec = Math.round((Date.now() - quizStartTime) / 1000)

    try {
      const response = await auth.apiRequest('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({
          answers: answersForApi,
          quizType: 'comprehensive',
          completionTime: completionTimeSec,
          feedback: ''
        })
      })

      if (!response || !response.ok) {
        console.warn('Quiz submission failed', response && (await response.text()))
      } else {
        console.log('Quiz submitted successfully')
      }
    } catch (err) {
      console.error('Error submitting quiz:', err)
    }

    // Redirect to the results page
    document.body.style.opacity = "0"
    setTimeout(() => {
      window.location.href = "result.html"
    }, 500)
  }

  // Initial render
  renderQuestion()
})
