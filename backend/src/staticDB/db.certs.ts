interface Certification {
    issuer: string;
    platform: string;
    name: string;
    date: string;
    tags: string[];
    url: string;
}

export const certs: Certification[] = [
    {   
        issuer: "DeepLearning.AI",
        platform: "Coursera",
        name: "Machine Learning Specialization",
        date: "Jul 2023",
        tags: ["Stanford CPD", "Andrew Ng", "Supervised & Unsupervised & RL"],
        url: ""
    },
    {   
        issuer: "DeepLearning.AI",
        platform: "Coursera",
        name: "TensorFlow Developer Professional Certificate",
        date: "Aug 2023",
        tags: ["CNN", "NLP", "Time Series", "Computer Vision"],
        url: ""
    },
    {   
        issuer: "DataCamp",
        platform: "DataCamp",
        name: "Data Scientist Professional with Python",
        date: "Jan 2023 - Jul 2023",
        tags: ["Pandas", "Scikit-learn", "Statistics", "ML Pipelines"],
        url: ""
    }
]