export * from "./question-generator/types"
export * from "./question-generator/document-processor"
export * from "./question-generator/keyword-extractor"
export * from "./question-generator/question-generator"
export * from "./question-generator/utils"

// Sample data for testing
export const sampleDocument = {
  title: "Introduction to Artificial Intelligence",
  content: `# Introduction to Artificial Intelligence

Artificial Intelligence (AI) is the field of computer science dedicated to creating systems capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.

## History of AI

The concept of artificial intelligence dates back to ancient times, with myths and stories about artificial beings endowed with intelligence. However, the field of AI as we know it today began in the mid-20th century.

In 1956, the Dartmouth Conference marked the official birth of AI as a field. Researchers like John McCarthy, Marvin Minsky, Allen Newell, and Herbert Simon became the founders of AI research.

## Types of AI

### Narrow AI

Narrow AI, also known as Weak AI, is designed to perform a specific task. Examples include:
- Voice assistants like Siri and Alexa
- Image recognition systems
- Recommendation algorithms

### General AI

General AI, or Strong AI, refers to systems that possess the ability to understand, learn, and apply knowledge across a wide range of tasks at a level equal to or greater than humans. This type of AI does not yet exist but remains a goal of many researchers.

## Machine Learning

Machine Learning is a subset of AI that focuses on developing algorithms that allow computers to learn from and make predictions based on data. Instead of explicitly programming rules, these systems learn patterns from examples.

### Supervised Learning

In supervised learning, algorithms learn from labeled training data. The algorithm makes predictions, and the error is calculated against the known labels. This error is then used to adjust the algorithm's parameters.

### Unsupervised Learning

Unsupervised learning algorithms work with unlabeled data. They identify patterns and relationships within the data without prior training examples.

### Reinforcement Learning

Reinforcement learning involves an agent learning to make decisions by taking actions in an environment to maximize a reward signal. It's based on the concept of learning through trial and error.

## Neural Networks and Deep Learning

Neural networks are computing systems inspired by the human brain's neural structure. Deep learning refers to neural networks with multiple layers (deep neural networks) that can learn hierarchical representations of data.

## Ethical Considerations in AI

As AI becomes more integrated into society, ethical considerations become increasingly important:

1. Privacy concerns related to data collection
2. Bias and fairness in AI systems
3. Transparency and explainability of AI decisions
4. Economic impact, including job displacement
5. Autonomous systems and responsibility

## Future of AI

The future of AI holds tremendous potential for solving complex problems in healthcare, climate science, education, and more. However, it also presents challenges that require careful consideration and governance.

Researchers continue to push the boundaries of what's possible, working toward more sophisticated systems that can reason, learn, and interact with the world in increasingly human-like ways.`,
}

export const sampleQuestionOptions = {
  questionTypes: ["multiple-choice", "fill-in-blank", "true-false", "short-answer"],
  difficultyRange: [0.3, 0.8],
  count: 10,
}

