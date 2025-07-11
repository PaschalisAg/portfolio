// Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', currentTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // CV content toggle
        let cvVisible = false;
        const sampleCV = `CURRICULUM VITAE

Your Name, Ph.D.
Data Scientist & Researcher
Email: your.email@university.edu
Phone: +1 (555) 123-4567
LinkedIn: linkedin.com/in/yourprofile
GitHub: github.com/yourusername

EDUCATION
Ph.D. in Computer Science                                               2020
University Name, Department of Computer Science
Dissertation: "Advanced Machine Learning Techniques for Complex Data Analysis"
Advisor: Dr. Advisor Name

M.S. in Statistics                                                      2016
University Name, Department of Statistics
Thesis: "Statistical Methods for High-Dimensional Data"

B.S. in Mathematics, summa cum laude                                    2014
University Name, Department of Mathematics

PROFESSIONAL EXPERIENCE
Senior Data Scientist                                           2021-Present
Tech Company Name, Data Science Team
• Lead machine learning initiatives for customer analytics
• Develop and deploy production ML models serving 1M+ users
• Mentor junior data scientists and establish best practices

Research Scientist                                              2020-2021
Research Institute Name
• Conducted research in deep learning and statistical modeling
• Published 5 peer-reviewed papers in top-tier venues
• Collaborated with interdisciplinary teams on funded projects

TECHNICAL SKILLS
Programming: Python, R, SQL, JavaScript, C++, Java
ML/AI: TensorFlow, PyTorch, Scikit-learn, Keras, XGBoost
Data: Pandas, NumPy, Spark, Hadoop, MongoDB, PostgreSQL
Tools: Git, Docker, Kubernetes, AWS, GCP, Linux/Unix
Visualization: Matplotlib, Plotly, D3.js, Tableau, ggplot2

SELECTED PUBLICATIONS
1. "Deep Learning for Time Series Forecasting" - JMLR 2024
2. "Statistical Methods for High-Dimensional Data" - Nature MI 2023
3. "Network Analysis with Graph Neural Networks" - NeurIPS 2023

CONFERENCES & WORKSHOPS
• International Conference on Machine Learning (ICML) 2023, 2024
• Neural Information Processing Systems (NeurIPS) 2022, 2023
• Data Science Summer School, University of Excellence 2022
• Advanced Statistical Methods Workshop, Statistical Institute 2021

AWARDS & HONORS
• Best Paper Award, International Data Science Conference 2023
• Outstanding Graduate Student Award, University Name 2020
• NSF Graduate Research Fellowship 2017-2020
• Dean's List, University Name 2012-2014`;

        function toggleCVView() {
            const cvContent = document.getElementById('cvContent');
            cvVisible = !cvVisible;
            
            if (cvVisible) {
                cvContent.style.display = 'block';
                cvContent.textContent = sampleCV;
            } else {
                cvContent.style.display = 'none';
            }
        }

        // Add animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections for scroll animations
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });