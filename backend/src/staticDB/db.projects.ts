interface Project {
    pname: string, 
    description: string, 
    github: string, 
    star: number,
    tags: string[]
}

export const projects: Project[] = 
[{
    pname: "Cypher",
    description: "Android app powered by Google's Gemini API for natural language processing, personalized AI features and real-time communication.",
    github: "https://github.com/mrinmoyxb/Cypher",
    star: 4,
    tags: ["Kotlin", "Jetpack Compose", "Gemini API"]
},
{
    pname: "Cardiac Compass",
    description: "Android app + ML backend detecting heart disease with 97% accuracy, combining Kotlin UI with a Python-trained Decision Tree model.",
    github: "https://github.com/mrinmoyxb/Cardiac-Compass",
    star: 1,
    tags: ["Kotlin", "Python", "ML"]
},
{
    pname: "Pneumonia X-Ray CNN",
    description: "Deep learning CNN classifying chest X-rays as pneumonia or normal using TensorFlow, with data augmentation and hyperparameter tuning.",
    github: "https://github.com/mrinmoyxb/Pneumonia-vs.-Normal-Lungs-X-Rays-CNN-Classification-Model",
    star: 5,
    tags: ["TensorFlow", "Computer Vision"]
},
{
    pname: "Anzen",
    description: "Secure Android password vault and generator built with Kotlin and Jetpack Compose, including password health checks.",
    github: "https://github.com/mrinmoyxb/Anzen-PasswordsVault",
    star: 2,
    tags: ["Kotlin", "Jetpack Compose"]
},
{
    pname: "Octopus",
    description: "A terminal-native API client for developers who live in the command line — inspect, test, and debug APIs without leaving the shell.",
    github: "https://github.com/mrinmoyxb/octopus",
    star: 1,
    tags: ["JavaScript", "CLI"]
},
{
    pname: "NLP Suicide Detection",
    description: "Deep learning NLP model detecting potentially suicidal content in tweets, trained for real-world crisis monitoring use cases.",
    github: "https://github.com/mrinmoyxb/Suicidal-Tweet-Detection-NLP-Model",
    star: 1,
    tags: ["NLP", "Deep Learning"]
}
]